"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { CmsButton } from "@/components/cms/CmsButton";
import { CmsCheckbox } from "@/components/cms/CmsCheckbox";
import { CollapsiblePanel } from "@/components/cms/CollapsiblePanel";
import { CmsIconSelect } from "@/components/cms/CmsIconSelect";
import { CmsSelect } from "@/components/cms/CmsSelect";
import { CmsViewModal } from "@/components/cms/CmsViewModal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import {
  blankJob,
  fetchJobSettings,
  fetchManageJobs,
  jobCmsApi,
  type Job,
  type JobStatus,
} from "@/lib/job-api";

const inputShell =
  "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[13px] text-cms-ink outline-none focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";
const areaShell = `${inputShell} min-h-[88px] py-2.5 leading-[1.55] resize-y`;
const subcard = "rounded-[11px] border border-cms-line bg-cms-bg p-4 dark:bg-[#101435]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-[12.5px] font-semibold text-cms-text">{label}{children}</label>;
}

export default function ContactTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [draft, setDraft] = useState<Job>(blankJob());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewTarget, setViewTarget] = useState<Job | null>(null);
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      const [list, settings] = await Promise.all([fetchManageJobs(), fetchJobSettings()]);
      setJobs(list);
      setSectionVisible(settings.sectionVisible);
      setNotice("");
    } catch {
      setNotice("Could not load job postings. Please sign in again or try again.");
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial async CMS data load
    void load();
  }, []);

  function resetForm() {
    setEditingId(null);
    setDraft(blankJob());
  }

  function editJob(job: Job) {
    setEditingId(job.id);
    setDraft({ ...job });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveJob() {
    if (!draft.title.trim()) {
      setNotice("Title is required.");
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      const response = await jobCmsApi.save(draft, editingId ?? undefined);
      const data = (await response.json().catch(() => ({}))) as { job?: Job; message?: string };
      if (!response.ok || !data.job) throw new Error(data.message || "Could not save job posting.");
      const saved = data.job;
      setJobs((current) => editingId
        ? current.map((job) => (job.id === saved.id ? saved : job))
        : [saved, ...current]);
      resetForm();
      setFormOpen(false);
      setNotice("Job posting saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save job posting.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await jobCmsApi.remove(deleteTarget.id);
      if (!response.ok) throw new Error("Could not delete job posting.");
      setJobs((current) => current.filter((job) => job.id !== deleteTarget.id));
      if (editingId === deleteTarget.id) resetForm();
      setNotice("Job posting deleted.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete job posting.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function toggleSection(next: boolean) {
    setSectionVisible(next);
    try {
      const response = await jobCmsApi.saveSettings(next);
      if (!response.ok) throw new Error("Could not update visibility.");
      setNotice(next ? "Job Postings section is visible on the Contact page." : "Job Postings section is hidden on the Contact page.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update visibility.");
    }
  }

  return (
    <div className="w-full">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-cms-ink">Contact</h1>
          <p className="mt-1 text-[13px] text-cms-muted">Manage the job postings shown in the Careers section of the visitor Contact page.</p>
          <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "Contact" }]} onNavigate={onNavigate} className="mt-3" />
        </div>
        <span className="text-[12px] text-cms-muted" aria-live="polite">{notice || (loaded ? "All changes saved" : "Loading...")}</span>
      </div>

      <div className="mb-5 rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <CmsCheckbox checked={sectionVisible} label="Show the Job Postings section on the Contact page" onChange={toggleSection} />
      </div>

      <CollapsiblePanel
        headerExtra={editingId ? <CmsButton variant="secondary" onClick={resetForm}>Cancel edit</CmsButton> : undefined}
        onToggle={() => setFormOpen((current) => !current)}
        open={formOpen}
        subtitle="Add or edit a job posting card. Only visible postings appear on the Contact page."
        title={editingId ? "Edit Job Posting" : "Add Job Posting"}
      >
        <div className={`${subcard} grid grid-cols-1 gap-4 sm:grid-cols-2`}>
          <Field label="Title *"><input className={inputShell} placeholder="Travel Consultant" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} /></Field>
          <Field label="Status">
            <CmsSelect
              onChange={(status) => setDraft((d) => ({ ...d, status: status as JobStatus }))}
              options={[{ value: "Hiring", label: "Hiring" }, { value: "Soon", label: "Soon" }, { value: "Open", label: "Open" }]}
              value={draft.status}
            />
          </Field>
          <Field label="Employment type"><input className={inputShell} placeholder="Full-time" value={draft.employment} onChange={(e) => setDraft((d) => ({ ...d, employment: e.target.value }))} /></Field>
          <Field label="Location"><input className={inputShell} placeholder="Rajagiriya" value={draft.location} onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} /></Field>
          <Field label="Experience"><input className={inputShell} placeholder="1 to 3 yrs" value={draft.experience} onChange={(e) => setDraft((d) => ({ ...d, experience: e.target.value }))} /></Field>
          <Field label="Posted label"><input className={inputShell} placeholder="Posted 3 days ago" value={draft.posted} onChange={(e) => setDraft((d) => ({ ...d, posted: e.target.value }))} /></Field>
          <Field label="Icon">
            <CmsIconSelect kind="highlight" onChange={(icon) => setDraft((d) => ({ ...d, icon }))} value={draft.icon} />
          </Field>
          <Field label="Sort order"><input className={inputShell} min="0" type="number" value={draft.sortOrder} onChange={(e) => setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) || 0 }))} /></Field>
          <div className="sm:col-span-2"><Field label="Description"><textarea className={areaShell} rows={3} placeholder="What the role involves…" value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} /></Field></div>
          <div className="sm:col-span-2">
            <CmsCheckbox checked={draft.visible} label="Show this posting on the Contact page" onChange={(visible) => setDraft((d) => ({ ...d, visible }))} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CmsButton variant="primary" disabled={saving} onClick={() => void saveJob()}>{saving ? "Saving…" : editingId ? "Update job posting" : "Add job posting"}</CmsButton>
          {!draft.title.trim() && <span className="text-[12px] text-cms-muted">Title is required.</span>}
        </div>
      </CollapsiblePanel>

      <section className="mt-5 rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-cms-ink">Job postings ({jobs.length})</h2>
          <CmsButton variant="secondary" onClick={() => void load()}>Refresh</CmsButton>
        </div>
        {!loaded ? (
          <p className="text-[13px] text-cms-muted">Loading job postings…</p>
        ) : !jobs.length ? (
          <p className="text-[13px] text-cms-muted">No job postings yet. Add one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-cms-line text-[11px] font-semibold uppercase tracking-wide text-cms-muted">
                  <th className="pb-2 pr-3">Title</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2 pr-3">Employment</th>
                  <th className="pb-2 pr-3">Location</th>
                  <th className="pb-2 pr-3">Visible</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr className="border-b border-cms-line last:border-0" key={job.id}>
                    <td className="py-2.5 pr-3 text-[13px] font-medium text-cms-ink">{job.title}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">{job.status}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">{job.employment || "—"}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">{job.location || "—"}</td>
                    <td className="py-2.5 pr-3 text-[13px] text-cms-muted">{job.visible ? "Yes" : "No"}</td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex gap-1.5">
                        <CmsButton size="sm" variant="secondary" onClick={() => setViewTarget(job)}>View</CmsButton>
                        <CmsButton size="sm" variant="secondary" onClick={() => editJob(job)}>Edit</CmsButton>
                        <CmsButton size="sm" variant="danger" onClick={() => setDeleteTarget(job)}>Delete</CmsButton>
                      </span>
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
        title="Delete job posting?"
        message={deleteTarget ? `“${deleteTarget.title}” will be permanently removed.` : ""}
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />

      <CmsViewModal
        open={viewTarget !== null}
        title={viewTarget?.title ?? ""}
        subtitle={viewTarget?.status}
        sections={viewTarget ? [{
          title: "Job posting",
          fields: [
            { label: "Status", value: viewTarget.status },
            { label: "Employment type", value: viewTarget.employment || "—" },
            { label: "Location", value: viewTarget.location || "—" },
            { label: "Experience", value: viewTarget.experience || "—" },
            { label: "Posted label", value: viewTarget.posted || "—" },
            { label: "Visible on Contact page", value: viewTarget.visible ? "Yes" : "No" },
            { label: "Description", value: viewTarget.description || "—", wide: true },
            { label: "Record ID", value: viewTarget.id },
          ],
        }] : []}
        onClose={() => setViewTarget(null)}
      />
    </div>
  );
}
