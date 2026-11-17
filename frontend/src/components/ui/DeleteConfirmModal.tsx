"use client";

import { useEffect, useRef } from "react";
import { CmsButton } from "@/components/cms/CmsButton";
import { Icon } from "@/components/ui/Icon";

type Props = {
  open: boolean;
  /** Heading, e.g. "Delete category?" */
  title?: string;
  /** Body copy — include the item name so the admin knows what is affected. */
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Shared destructive-action confirmation dialog. Used before deleting rental
 * categories and vehicle cards (and available to any other CMS section).
 */
export function DeleteConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  busy = false,
  onConfirm,
  onCancel,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    confirmRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-navy-900/55 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!busy) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
        aria-describedby="delete-confirm-message"
        className="w-full max-w-[420px] rounded-2xl bg-white p-6 text-ink-900 shadow-[0_30px_80px_rgba(11,37,69,.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-[#fdecef] text-[#d42a45]">
          <Icon name="delete" size={22} />
        </span>
        <h2 id="delete-confirm-title" className="text-h5">
          {title}
        </h2>
        <p id="delete-confirm-message" className="mt-2 text-small text-ink-600">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-2.5">
          <CmsButton
            disabled={busy}
            onClick={onCancel}
            variant="secondary"
          >
            {cancelLabel}
          </CmsButton>
          <CmsButton
            ref={confirmRef}
            disabled={busy}
            onClick={onConfirm}
            variant="danger"
          >
            {busy ? "Deleting…" : confirmLabel}
          </CmsButton>
        </div>
      </div>
    </div>
  );
}
