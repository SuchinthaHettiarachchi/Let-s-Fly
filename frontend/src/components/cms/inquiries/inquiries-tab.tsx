"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { CmsButton } from "@/components/cms/CmsButton";

import {
  fetchManageInquiries,
  inquiryCmsApi,
  type Inquiry,
  type InquiryCategory,
  type InquiryStatus,
} from "@/lib/inquiry-api";

const statuses = ["New", "In Progress", "Closed"] as const;

const categories = [
  "Contact",
  "Plan my Trip Section",
  "Air Ticket",
  "Visa Inquiry",
] as const satisfies readonly InquiryCategory[];

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export default function InquiriesTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [storageError, setStorageError] = useState("");
  const [activeCategory, setActiveCategory] = useState<InquiryCategory | "All">("All");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [commentInquiryId, setCommentInquiryId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const load = async () => {
    try {
      setInquiries(await fetchManageInquiries());
      setStorageError("");
    } catch {
      setStorageError("Inquiries could not be loaded. Please sign in again or try again.");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial async CMS data load
    void load();
  }, []);

  const counts = useMemo(() => ({
    categories: Object.fromEntries(
      categories.map((category) => [
        category,
        inquiries.filter((inquiry) => inquiry.category === category).length,
      ]),
    ) as Record<InquiryCategory, number>,
  }), [inquiries]);

  const filteredInquiries = activeCategory === "All"
    ? inquiries
    : inquiries.filter((inquiry) => inquiry.category === activeCategory);
  const pendingCount = filteredInquiries.filter((inquiry) => inquiry.status !== "Closed").length;
  const completedCount = filteredInquiries.filter((inquiry) => inquiry.status === "Closed").length;

  async function changeStatus(inquiryId: string, status: InquiryStatus) {
    try {
      const response = await inquiryCmsApi.update(inquiryId, { status });
      if (!response.ok) throw new Error("Could not update status.");
      setInquiries((current) => current.map((inquiry) => inquiry.id === inquiryId ? { ...inquiry, status } : inquiry));
      setStorageError("");
    } catch {
      setStorageError("The status change could not be saved. Please try again.");
    }
  }

  async function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const comment = commentText.trim();
    if (!comment || !commentInquiryId) return;

    const inquiryId = commentInquiryId;
    try {
      const response = await inquiryCmsApi.update(inquiryId, { comment });
      if (!response.ok) throw new Error("Could not save comment.");
      setInquiries((current) => current.map((inquiry) =>
        inquiry.id === inquiryId ? { ...inquiry, comments: [...inquiry.comments, comment] } : inquiry,
      ));
      setCommentText("");
      setCommentInquiryId(null);
      setStorageError("");
    } catch {
      setStorageError("The comment could not be saved. Please try again.");
    }
  }

  const commentInquiry = inquiries.find((inquiry) => inquiry.id === commentInquiryId);
  const detailInquiry = selectedInquiry
    ? inquiries.find((inquiry) => inquiry.id === selectedInquiry.id) ?? selectedInquiry
    : null;

  return (
    <div className="w-full animate-[cms-home-fade_0.35s_cubic-bezier(.2,.7,.2,1)]">
      {storageError && <p className="mt-4 w-full py-3 px-[14px] border-l-[3px] border-l-[#d42a45] rounded-[7px] bg-[#fff1f2] text-[#991b1b] text-[13px] dark:bg-[#3a1420] dark:text-[#ff9aa8] dark:border-l-[#5c2233]" role="alert">{storageError}</p>}

      <section aria-labelledby="inquiry-list-heading" className="mt-6 w-full overflow-hidden border border-cms-line rounded-[14px] bg-cms-card shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <header className="flex min-h-18 items-center justify-between py-[14px] px-5 border-b border-cms-line max-[480px]:px-4">
          <div>
            <h2 id="inquiry-list-heading" className="text-cms-ink text-[16px] font-semibold">All inquiries</h2>
            <p className="mt-[2px] text-cms-muted text-[12px]">{filteredInquiries.length} {filteredInquiries.length === 1 ? "inquiry" : "inquiries"}</p>
            <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "Inquiries" }]} onNavigate={onNavigate} className="mt-3" />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e3a900]/40 bg-[#fff8c2] px-2.5 py-1 text-[11px] font-semibold text-[#796900] dark:border-[#5c4a13] dark:bg-[#3a3413] dark:text-[#f5d76e]">
              Pending <strong className="text-[12px]">{pendingCount}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#12a36a]/30 bg-[#e6f7ef] px-2.5 py-1 text-[11px] font-semibold text-[#087a4e] dark:border-[#205b43] dark:bg-[#12351f] dark:text-[#6ee7a8]">
              Completed <strong className="text-[12px]">{completedCount}</strong>
            </span>
          </div>
        </header>
        <nav aria-label="Filter inquiries by category" className="flex w-full gap-[6px] px-4 py-3 overflow-x-auto border-b border-cms-line [scrollbar-width:thin] max-[480px]:px-3">
          <button suppressHydrationWarning
            aria-pressed={activeCategory === "All"}
            className={`inline-flex min-h-9 flex-none items-center gap-[7px] px-[11px] rounded-lg border text-[12px]! whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cms-primary focus-visible:outline-offset-2 ${activeCategory === "All" ? "border-[#dedcf0] bg-[#f1f0fd] text-cms-primary font-semibold! dark:border-[#2a2e63] dark:bg-[#232755]" : "border-transparent bg-transparent text-cms-muted font-medium! hover:bg-cms-card2 hover:text-cms-ink"}`}
            onClick={() => setActiveCategory("All")}
            type="button"
          >
            All <span className="grid min-w-5 h-5 place-items-center px-[5px] rounded-full bg-[rgba(19,8,122,.07)] text-inherit text-[10px] dark:bg-[rgba(255,255,255,.09)]">{inquiries.length}</span>
          </button>
          {categories.map((category) => (
            <button suppressHydrationWarning
              aria-pressed={activeCategory === category}
              className={`inline-flex min-h-9 flex-none items-center gap-[7px] px-[11px] rounded-lg border text-[12px]! whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cms-primary focus-visible:outline-offset-2 ${activeCategory === category ? "border-[#dedcf0] bg-[#f1f0fd] text-cms-primary font-semibold! dark:border-[#2a2e63] dark:bg-[#232755]" : "border-transparent bg-transparent text-cms-muted font-medium! hover:bg-cms-card2 hover:text-cms-ink"}`}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category} <span className="grid min-w-5 h-5 place-items-center px-[5px] rounded-full bg-[rgba(19,8,122,.07)] text-inherit text-[10px] dark:bg-[rgba(255,255,255,.09)]">{counts.categories[category]}</span>
            </button>
          ))}
        </nav>
        {filteredInquiries.length === 0 ? (
          <div className="flex min-h-[230px] w-full flex-col items-center justify-center p-[30px] text-center max-[480px]:p-5">
            <span aria-hidden="true" className="grid size-13 place-items-center rounded-2xl bg-[#f1f0fd] text-cms-primary text-[24px] dark:bg-[#232755]">✉</span>
            <h3 className="mt-[14px] text-cms-ink text-[15px] font-semibold">{inquiries.length === 0 ? "No inquiries yet" : "No inquiries in this category"}</h3>
            <p className="max-w-[390px] mt-[5px] text-cms-muted text-[12.5px]">{inquiries.length === 0 ? "Inquiries submitted through the website contact forms will appear here." : "Choose another category to see its inquiries."}</p>
          </div>
        ) : (
          <div className="flex w-full flex-col">
            {filteredInquiries.map((inquiry) => (
              <article className="flex w-full items-center justify-between gap-6 py-[18px] px-5 border-b border-cms-line last:border-b-0 max-[760px]:items-stretch max-[760px]:flex-col max-[760px]:gap-[14px] max-[480px]:px-4" key={inquiry.id}>
                <div className="min-w-0 flex-1">
                  <time className="text-cms-muted text-[11.5px]" dateTime={inquiry.createdAt}>
                    {formatDate(inquiry.createdAt)}
                  </time>
                  <h3 className="mt-[2px] text-cms-ink text-[14px] font-semibold">{inquiry.customerName}</h3>
                  <div className="flex flex-wrap gap-y-1 gap-x-[14px] mt-[3px] text-[12px]">
                    {inquiry.email && <a className="text-cms-primary no-underline hover:underline" href={`mailto:${inquiry.email}`}>{inquiry.email}</a>}
                    {inquiry.phone && <a className="text-cms-primary no-underline hover:underline" href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>}
                  </div>
                  <span className="inline-flex mt-2 py-[3px] px-[9px] rounded-full bg-[#f1f0fd] text-cms-ink text-[11px] font-semibold dark:bg-[#232755]">{inquiry.category}</span>
                  <p className="mt-2 text-cms-text text-[13px] leading-[1.5] wrap-anywhere">{inquiry.message}</p>
                </div>
                <div aria-label={`Status for ${inquiry.customerName}`} className="flex flex-wrap justify-end gap-[6px] max-[760px]:justify-start">
                  {statuses.map((status) => (
                    <CmsButton
                      aria-pressed={inquiry.status === status}
                      key={status}
                      onClick={() => changeStatus(inquiry.id, status)}
                      size="sm"
                      variant={inquiry.status === status ? "primary" : "secondary"}
                    >
                      {status}
                    </CmsButton>
                  ))}
                  <CmsButton size="sm" variant="secondary" onClick={() => {
                    setCommentInquiryId(inquiry.id);
                    setCommentText("");
                  }}>Add comment</CmsButton>
                  <CmsButton size="sm" variant="secondary" onClick={() => setSelectedInquiry(inquiry)}>View details</CmsButton>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {commentInquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-[rgba(10,4,70,.48)] backdrop-blur-[3px]" onClick={() => setCommentInquiryId(null)}>
          <section
            aria-labelledby="inquiry-comment-title"
            aria-modal="true"
            className="w-[min(100%,560px)] max-h-[min(85dvh,760px)] p-4 sm:p-[22px] overflow-y-auto rounded-2xl bg-cms-card border border-cms-line shadow-[0_24px_60px_rgba(10,4,70,.22)] dark:shadow-none"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className="flex items-start justify-between gap-4 mb-[18px]">
              <div className="min-w-0">
                <h2 id="inquiry-comment-title" className="text-cms-ink text-[18px] font-semibold">Add a comment</h2>
                <p className="mt-[3px] text-cms-muted text-[12px] wrap-anywhere">For {commentInquiry.customerName}</p>
              </div>
              <CmsButton aria-label="Close" size="icon" variant="secondary" onClick={() => setCommentInquiryId(null)}>×</CmsButton>
            </header>
            <form onSubmit={addComment}>
              <label className="block mb-[6px] text-cms-ink text-[12px] font-semibold" htmlFor="inquiry-comment">Comment</label>
              <textarea suppressHydrationWarning
                autoFocus
                className="w-full py-[10px] px-3 resize-y border border-cms-line rounded-[9px] bg-cms-card text-cms-text text-[13px] placeholder:text-cms-muted focus:border-cms-primary"
                id="inquiry-comment"
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Add an internal note about this inquiry"
                required
                rows={4}
                value={commentText}
              />
              <footer className="flex justify-end gap-2 mt-[18px]">
                <CmsButton variant="secondary" onClick={() => setCommentInquiryId(null)}>Cancel</CmsButton>
                <CmsButton variant="primary" type="submit">Save comment</CmsButton>
              </footer>
            </form>
          </section>
        </div>
      )}
      {detailInquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-[rgba(10,4,70,.48)] backdrop-blur-[3px]" onClick={() => setSelectedInquiry(null)}>
          <section
            aria-labelledby="inquiry-detail-title"
            aria-modal="true"
            className="w-[min(100%,560px)] max-h-[min(85dvh,760px)] p-4 sm:p-[22px] overflow-y-auto rounded-2xl bg-cms-card border border-cms-line shadow-[0_24px_60px_rgba(10,4,70,.22)] dark:shadow-none"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className="flex items-start justify-between gap-4 mb-[18px]">
              <div className="min-w-0">
                <h2 id="inquiry-detail-title" className="text-cms-ink text-[18px] font-semibold">Inquiry details</h2>
                <p className="mt-[3px] text-cms-muted text-[12px] wrap-anywhere">{detailInquiry.category} · {formatDate(detailInquiry.createdAt)}</p>
              </div>
              <CmsButton aria-label="Close" size="icon" variant="secondary" onClick={() => setSelectedInquiry(null)}>×</CmsButton>
            </header>
            <dl className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
              <div className="py-[10px] px-3 rounded-[9px] bg-cms-card2 wrap-anywhere"><dt className="text-cms-muted text-[11px]">Customer</dt><dd className="mt-[3px] text-cms-ink text-[13px] font-medium">{detailInquiry.customerName}</dd></div>
              <div className="py-[10px] px-3 rounded-[9px] bg-cms-card2 wrap-anywhere"><dt className="text-cms-muted text-[11px]">Email</dt><dd className="mt-[3px] text-cms-ink text-[13px] font-medium">{detailInquiry.email || "Not provided"}</dd></div>
              <div className="py-[10px] px-3 rounded-[9px] bg-cms-card2 wrap-anywhere"><dt className="text-cms-muted text-[11px]">Phone</dt><dd className="mt-[3px] text-cms-ink text-[13px] font-medium">{detailInquiry.phone || "Not provided"}</dd></div>
              <div className="py-[10px] px-3 rounded-[9px] bg-cms-card2 wrap-anywhere"><dt className="text-cms-muted text-[11px]">Status</dt><dd className="mt-[3px] text-cms-ink text-[13px] font-medium">{detailInquiry.status}</dd></div>
              <div className="py-[10px] px-3 rounded-[9px] bg-cms-card2 wrap-anywhere col-span-full max-[480px]:col-auto"><dt className="text-cms-muted text-[11px]">Message</dt><dd className="mt-[3px] text-cms-ink text-[13px] font-medium">{detailInquiry.message}</dd></div>
            </dl>
            <div className="mt-[18px]">
              <h3 className="text-cms-ink text-[13px] font-semibold">Comments ({detailInquiry.comments.length})</h3>
              {detailInquiry.comments.length > 0 ? (
                <ul className="grid gap-[7px] mt-2 p-0 list-none">{detailInquiry.comments.map((comment, index) => <li className="py-[9px] px-[11px] border-l-[3px] border-l-cms-primary rounded-[5px] bg-cms-card2 text-cms-text text-[12px] whitespace-pre-wrap" key={`${detailInquiry.id}-${index}`}>{comment}</li>)}</ul>
              ) : <p className="mt-[7px] text-cms-muted text-[12px]">No comments yet.</p>}
            </div>
            <footer className="flex justify-end gap-2 mt-[18px]">
              <CmsButton variant="secondary" onClick={() => setSelectedInquiry(null)}>Close</CmsButton>
              <CmsButton variant="primary" onClick={() => {
                setSelectedInquiry(null);
                setCommentInquiryId(detailInquiry.id);
                setCommentText("");
              }}>Add comment</CmsButton>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
