"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { CmsButton } from "@/components/cms/CmsButton";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { fetchSubscribers, newsletterCmsApi, type NewsletterSubscriber } from "@/lib/newsletter-api";

export default function NewsletterTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setSubscribers(await fetchSubscribers());
      setNotice("");
    } catch {
      setNotice("Could not load subscribers. Please sign in again or try again.");
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial async CMS data load
    void load();
  }, []);

  const allEmails = subscribers.map((subscriber) => subscriber.email);
  const filtered = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(query.trim().toLowerCase()),
  );

  async function copyAll() {
    if (!allEmails.length) return;
    try {
      await navigator.clipboard.writeText(allEmails.join(", "));
      setNotice(`Copied ${allEmails.length} email${allEmails.length === 1 ? "" : "s"} to the clipboard.`);
    } catch {
      setNotice("Clipboard access was blocked. Copy the addresses from the list instead.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await newsletterCmsApi.remove(deleteTarget.id);
      if (!response.ok) throw new Error("Could not delete subscriber.");
      setSubscribers((current) => current.filter((subscriber) => subscriber.id !== deleteTarget.id));
      setNotice("Subscriber removed.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete subscriber.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-cms-ink">Newsletter</h1>
          <p className="mt-1 text-[13px] text-cms-muted">Emails submitted through the website newsletter form are added here automatically.</p>
          <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "Newsletter" }]} onNavigate={onNavigate} className="mt-3" />
        </div>
        <span className="text-[12px] text-cms-muted" aria-live="polite">{notice || (loaded ? "All changes saved" : "Loading...")}</span>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div>
          <h2 className="text-[16px] font-semibold text-cms-ink">Subscribers ({subscribers.length})</h2>
          <p className="mt-1 text-[12px] text-cms-muted">Copy all addresses at once for your mailing list.</p>
        </div>
        <CmsButton variant="primary" disabled={!subscribers.length} onClick={() => void copyAll()}>
          Copy all emails
        </CmsButton>
      </div>

      <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-cms-ink">Subscriber list</h2>
          <div className="flex flex-wrap items-center gap-2">
            <input
              aria-label="Search subscribers"
              className="h-9 w-56 rounded-[8px] border border-cms-line bg-cms-bg px-3 text-[12px] text-cms-ink outline-none focus:border-cms-primary"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search email…"
              type="search"
              value={query}
            />
            <CmsButton variant="secondary" onClick={() => void load()}>Refresh</CmsButton>
          </div>
        </div>
        {!loaded ? (
          <p className="text-[13px] text-cms-muted">Loading subscribers…</p>
        ) : !filtered.length ? (
          <p className="text-[13px] text-cms-muted">{query ? "No subscribers match your search." : "No subscribers yet."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-cms-line text-[11px] font-semibold uppercase tracking-wide text-cms-muted">
                  <th className="pb-2 pr-3">Email</th>
                  <th className="pb-2 pr-3">Source</th>
                  <th className="pb-2 pr-3">Subscribed</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((subscriber) => (
                  <tr className="border-b border-cms-line last:border-0" key={subscriber.id}>
                    <td className="py-2.5 pr-3 text-[13px] font-medium text-cms-ink">{subscriber.email}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">{subscriber.source || "website"}</td>
                    <td className="py-2.5 pr-3 text-[12px] text-cms-muted">
                      {subscriber.createdAt ? new Date(subscriber.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-2.5 text-right">
                      <CmsButton size="sm" variant="danger" onClick={() => setDeleteTarget(subscriber)}>Delete</CmsButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <DeleteConfirmModal
        open={deleteTarget !== null}
        title="Delete subscriber?"
        message={deleteTarget ? `“${deleteTarget.email}” will be removed from the subscriber list.` : ""}
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
