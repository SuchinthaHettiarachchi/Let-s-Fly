"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";

const INQUIRIES_STORAGE_KEY = "lf_inquiries";

const statuses = ["New", "In Progress", "Closed"] as const;
type InquiryStatus = (typeof statuses)[number];

const categories = [
  "Outbound Travel",
  "Travel Sri Lanka",
  "Hotel Bookings",
  "Trains",
  "Cruises",
] as const;
type InquiryCategory = (typeof categories)[number];

interface Inquiry {
  id: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  category: InquiryCategory;
  message: string;
  status: InquiryStatus;
  comments: string[];
}

const demoInquiries: Inquiry[] = [
  {
    id: "demo-outbound-1",
    createdAt: "2026-10-21T09:35:00.000Z",
    customerName: "Amelia Perera",
    email: "amelia.perera@example.com",
    phone: "+94 77 123 4567",
    category: "Outbound Travel",
    message: "We are planning a family holiday to Japan for two adults and two children in December. Could you share package options and estimated costs?",
    status: "New",
    comments: [],
  },
  {
    id: "demo-srilanka-1",
    createdAt: "2026-10-20T13:10:00.000Z",
    customerName: "Daniel Fernando",
    email: "daniel.fernando@example.com",
    phone: "+94 71 234 5678",
    category: "Travel Sri Lanka",
    message: "Looking for a 5-day cultural tour covering Kandy, Sigiriya, and Anuradhapura for three guests.",
    status: "In Progress",
    comments: ["Asked the customer to confirm preferred travel dates."],
  },
  {
    id: "demo-hotel-1",
    createdAt: "2026-10-19T07:45:00.000Z",
    customerName: "Nisha Jayawardena",
    email: "nisha.j@example.com",
    phone: "+94 76 345 6789",
    category: "Hotel Bookings",
    message: "Please check availability for a double room in Galle from 12 to 15 November, including breakfast.",
    status: "New",
    comments: [],
  },
  {
    id: "demo-train-1",
    createdAt: "2026-10-18T11:20:00.000Z",
    customerName: "Oliver Smith",
    email: "oliver.smith@example.com",
    phone: "+44 7700 900123",
    category: "Trains",
    message: "Can you arrange two reserved seats on the scenic train from Kandy to Ella on 8 December?",
    status: "Closed",
    comments: ["Train seats confirmed and details sent to the customer."],
  },
  {
    id: "demo-cruise-1",
    createdAt: "2026-10-17T15:05:00.000Z",
    customerName: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    phone: "+91 98765 43210",
    category: "Cruises",
    message: "Interested in a Maldives cruise in January. Please send itinerary and cabin pricing for two people.",
    status: "In Progress",
    comments: [],
  },
  {
    id: "demo-outbound-2",
    createdAt: "2026-10-16T08:15:00.000Z",
    customerName: "Sophie Martin",
    email: "sophie.martin@example.com",
    phone: "+33 6 12 34 56 78",
    category: "Outbound Travel",
    message: "I would like to know whether you offer a guided group tour to Vietnam in March next year.",
    status: "New",
    comments: [],
  },
];

function normalizeInquiry(value: unknown): Inquiry | null {
  if (typeof value !== "object" || value === null) return null;
  const inquiry = value as Record<string, unknown>;
  const status = inquiry.status ?? "New";
  if (
    typeof inquiry.id !== "string" ||
    typeof inquiry.createdAt !== "string" ||
    typeof inquiry.customerName !== "string" ||
    (inquiry.email !== undefined && typeof inquiry.email !== "string") ||
    (inquiry.phone !== undefined && typeof inquiry.phone !== "string") ||
    !categories.includes(inquiry.category as InquiryCategory) ||
    typeof inquiry.message !== "string" ||
    !statuses.includes(status as InquiryStatus) ||
    (inquiry.comments !== undefined &&
      (!Array.isArray(inquiry.comments) ||
        !inquiry.comments.every((comment) => typeof comment === "string")))
  ) {
    return null;
  }

  return {
    id: inquiry.id,
    createdAt: inquiry.createdAt,
    customerName: inquiry.customerName,
    email: typeof inquiry.email === "string" ? inquiry.email : "",
    phone: typeof inquiry.phone === "string" ? inquiry.phone : "",
    category: inquiry.category as InquiryCategory,
    message: inquiry.message,
    status: status as InquiryStatus,
    comments: Array.isArray(inquiry.comments) ? inquiry.comments : [],
  };
}

function readInquiries(): Inquiry[] {
  const stored = localStorage.getItem(INQUIRIES_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(demoInquiries));
    return demoInquiries;
  }

  const records: unknown = JSON.parse(stored);
  if (!Array.isArray(records)) {
    throw new Error("Saved inquiry data has an invalid format.");
  }
  const normalized: Inquiry[] = [];
  for (const record of records) {
    const inquiry = normalizeInquiry(record);
    if (!inquiry) throw new Error("Saved inquiry data has an invalid format.");
    normalized.push(inquiry);
  }
  return normalized;
}

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

  useEffect(() => {
    function load() {
      try {
        setInquiries(readInquiries());
        setStorageError("");
      } catch (error) {
        console.error("Could not load inquiries.", error);
        setStorageError("Inquiries could not be loaded from browser storage.");
      }
    }
    function handleStorage(event: StorageEvent) {
      if (event.key === INQUIRIES_STORAGE_KEY) load();
    }

    load();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
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

  function changeStatus(inquiryId: string, status: InquiryStatus) {
    const updated = inquiries.map((inquiry) =>
      inquiry.id === inquiryId ? { ...inquiry, status } : inquiry,
    );

    try {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      setInquiries(updated);
      setStorageError("");
    } catch (error) {
      console.error("Could not update inquiry status.", error);
      setStorageError("The status change could not be saved. Please try again.");
    }
  }

  function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const comment = commentText.trim();
    if (!comment || !commentInquiryId) return;

    const updated = inquiries.map((inquiry) =>
      inquiry.id === commentInquiryId
        ? { ...inquiry, comments: [...inquiry.comments, comment] }
        : inquiry,
    );
    try {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      setInquiries(updated);
      setCommentText("");
      setCommentInquiryId(null);
      setStorageError("");
    } catch (error) {
      console.error("Could not save inquiry comment.", error);
      setStorageError("The comment could not be saved. Please try again.");
    }
  }

  const commentInquiry = inquiries.find((inquiry) => inquiry.id === commentInquiryId);
  const detailInquiry = selectedInquiry
    ? inquiries.find((inquiry) => inquiry.id === selectedInquiry.id) ?? selectedInquiry
    : null;

  return (
    <div className="w-full animate-[cms-home-fade_0.35s_cubic-bezier(.2,.7,.2,1)]">
      <section aria-label="Inquiry totals" className="grid w-full grid-cols-1 gap-[10px] sm:grid-cols-2 sm:gap-[14px] lg:grid-cols-3">
        <article className="flex min-h-24 flex-col justify-between gap-2 py-4 px-[18px] border border-cms-line border-t-[3px] border-t-cms-primary rounded-[14px] bg-cms-card shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
          <span className="text-cms-muted text-[12px] font-medium leading-[1.35]">Total inquiries</span>
          <strong className="text-cms-ink text-[22px] font-bold leading-none sm:text-[25px]">{filteredInquiries.length}</strong>
        </article>
        <article className="flex min-h-24 flex-col justify-between gap-2 py-4 px-[18px] border border-cms-line border-t-[3px] border-t-[#e3a900] rounded-[14px] bg-cms-card shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
          <span className="text-cms-muted text-[12px] font-medium leading-[1.35]">Pending</span>
          <strong className="text-cms-ink text-[22px] font-bold leading-none sm:text-[25px]">{pendingCount}</strong>
        </article>
        <article className="flex min-h-24 flex-col justify-between gap-2 py-4 px-[18px] border border-cms-line border-t-[3px] border-t-[#12a36a] rounded-[14px] bg-cms-card shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
          <span className="text-cms-muted text-[12px] font-medium leading-[1.35]">Completed</span>
          <strong className="text-cms-ink text-[22px] font-bold leading-none sm:text-[25px]">{completedCount}</strong>
        </article>
      </section>

      {storageError && <p className="mt-4 w-full py-3 px-[14px] border-l-[3px] border-l-[#d42a45] rounded-[7px] bg-[#fff1f2] text-[#991b1b] text-[13px] dark:bg-[#3a1420] dark:text-[#ff9aa8] dark:border-l-[#5c2233]" role="alert">{storageError}</p>}

      <section aria-labelledby="inquiry-list-heading" className="mt-6 w-full overflow-hidden border border-cms-line rounded-[14px] bg-cms-card shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <header className="flex min-h-18 items-center justify-between py-[14px] px-5 border-b border-cms-line max-[480px]:px-4">
          <div>
            <h2 id="inquiry-list-heading" className="text-cms-ink text-[16px] font-semibold">All inquiries</h2>
            <p className="mt-[2px] text-cms-muted text-[12px]">{filteredInquiries.length} {filteredInquiries.length === 1 ? "inquiry" : "inquiries"}</p>
            <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "Inquiries" }]} onNavigate={onNavigate} className="mt-3" />
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
                    <button suppressHydrationWarning
                      aria-pressed={inquiry.status === status}
                      className={`min-h-[34px] px-[10px] border rounded-lg text-[11px]! font-semibold! transition-colors duration-200 ease-[ease] focus-visible:outline-2 focus-visible:outline-cms-primary focus-visible:outline-offset-2 ${inquiry.status === status ? "border-cms-primary bg-cms-primary text-white" : "border-cms-line bg-cms-card text-cms-muted hover:border-[#cfcce8] hover:text-cms-ink dark:hover:border-[#41478c]"}`}
                      key={status}
                      onClick={() => changeStatus(inquiry.id, status)}
                      type="button"
                    >
                      {status}
                    </button>
                  ))}
                  <button suppressHydrationWarning className="min-h-[34px] px-[10px] border border-cms-line rounded-lg bg-cms-card text-cms-ink text-[11px]! font-semibold! whitespace-nowrap hover:border-[#cfcce8] hover:bg-cms-card2 dark:hover:border-[#41478c] focus-visible:outline-2 focus-visible:outline-cms-primary focus-visible:outline-offset-2" onClick={() => {
                    setCommentInquiryId(inquiry.id);
                    setCommentText("");
                  }} type="button">Add comment</button>
                  <button suppressHydrationWarning className="min-h-[34px] px-[10px] border border-cms-line rounded-lg bg-cms-card text-cms-ink text-[11px]! font-semibold! whitespace-nowrap hover:border-[#cfcce8] hover:bg-cms-card2 dark:hover:border-[#41478c] focus-visible:outline-2 focus-visible:outline-cms-primary focus-visible:outline-offset-2" onClick={() => setSelectedInquiry(inquiry)} type="button">View details</button>
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
              <button suppressHydrationWarning aria-label="Close" className="grid size-[34px] flex-none place-items-center border border-cms-line rounded-lg bg-cms-card text-cms-muted text-[22px]! focus-visible:outline-2 focus-visible:outline-cms-primary focus-visible:outline-offset-2" onClick={() => setCommentInquiryId(null)} type="button">×</button>
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
                <button suppressHydrationWarning className="min-h-[34px] px-[10px] border border-cms-line rounded-lg bg-cms-card text-cms-ink text-[11px]! font-semibold! whitespace-nowrap hover:border-[#cfcce8] hover:bg-cms-card2 dark:hover:border-[#41478c] focus-visible:outline-2 focus-visible:outline-cms-primary focus-visible:outline-offset-2" onClick={() => setCommentInquiryId(null)} type="button">Cancel</button>
                <button suppressHydrationWarning className="min-h-9 px-[13px] border-0 rounded-lg bg-cms-primary text-white text-[12px]! font-semibold! hover:bg-[#1408b0] dark:hover:bg-[#7d74ff] focus-visible:outline-2 focus-visible:outline-cms-primary focus-visible:outline-offset-2" type="submit">Save comment</button>
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
              <button suppressHydrationWarning aria-label="Close" className="grid size-[34px] flex-none place-items-center border border-cms-line rounded-lg bg-cms-card text-cms-muted text-[22px]! focus-visible:outline-2 focus-visible:outline-cms-primary focus-visible:outline-offset-2" onClick={() => setSelectedInquiry(null)} type="button">×</button>
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
              <button suppressHydrationWarning className="min-h-[34px] px-[10px] border border-cms-line rounded-lg bg-cms-card text-cms-ink text-[11px]! font-semibold! whitespace-nowrap hover:border-[#cfcce8] hover:bg-cms-card2 dark:hover:border-[#41478c] focus-visible:outline-2 focus-visible:outline-cms-primary focus-visible:outline-offset-2" onClick={() => setSelectedInquiry(null)} type="button">Close</button>
              <button suppressHydrationWarning className="min-h-9 px-[13px] border-0 rounded-lg bg-cms-primary text-white text-[12px]! font-semibold! hover:bg-[#1408b0] dark:hover:bg-[#7d74ff] focus-visible:outline-2 focus-visible:outline-cms-primary focus-visible:outline-offset-2" onClick={() => {
                setSelectedInquiry(null);
                setCommentInquiryId(detailInquiry.id);
                setCommentText("");
              }} type="button">Add comment</button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
