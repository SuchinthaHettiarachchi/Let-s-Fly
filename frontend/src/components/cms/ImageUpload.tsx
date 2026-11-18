"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { cmsButtonClasses } from "@/components/cms/CmsButton";
import { UploadProgressCircle } from "@/components/cms/UploadProgress";

/*
 * Shared CMS image upload - one drag-and-drop field used by every CMS section.
 * The parent keeps ownership of validation, processing/upload and state; this
 * component renders the picker UI, preview, remove/error rows and upload progress.
 */
export type ImageUploadProps = {
  /** Current media URL - empty string when nothing is selected yet. */
  value?: string;
  /** Receives the picked or dropped file; the parent validates and uploads it. */
  onFile: (file: File) => void;
  /** Clears the current selection - renders the "Remove" action. */
  onRemove?: () => void;
  /** True while the parent uploads/processes - blocks picking and shows progress. */
  uploading?: boolean;
  /** 0-100 upload percentage, or -1 for indeterminate while uploading. */
  progress?: number;
  /** Validation or upload error shown under the field. */
  error?: string;
  /** Field label rendered above the drop zone. */
  label?: string;
  /** Helper line under the label / fallback line when nothing is selected. */
  hint?: string;
  /** Accepted file types (default "image/*"). */
  accept?: string;
  /** Drop zone height class (default "h-[150px]"). */
  height?: string;
  /** Extra classes for the root element. */
  className?: string;
  /** Copy shown in the empty zone (default "Choose an Image"). */
  emptyText?: string;
  /** Copy of the pick button (default "Choose Files"). */
  chooseText?: string;
};

const VIDEO_PATTERN = /\.(mp4|webm|ogv|mov|m4v)([?#].*)?$/i;

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      className="text-cms-primary"
      fill="none"
      height="28"
      viewBox="0 0 24 24"
      width="28"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

export function ImageUpload({
  value = "",
  onFile,
  onRemove,
  uploading = false,
  progress,
  error = "",
  label,
  hint,
  accept = "image/*",
  height = "h-[150px]",
  className = "font-normal",
  emptyText = "Drag and drop or click to upload an image",
  chooseText = "Choose Files",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const hasValue = Boolean(value);
  const isVideo = hasValue && VIDEO_PATTERN.test(value);
  const interactive = !isVideo && !uploading;

  function pick() {
    if (uploading) return;
    inputRef.current?.click();
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setDragging(false);
    if (uploading) return;
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!interactive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick();
    }
  }

  const zoneClass = [
    "relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-[10px] border-[1.5px] border-dashed px-4 text-center transition-[border-color,box-shadow,background-color] duration-[180ms] ease-out",
    height,
    dragging
      ? "border-[#6f6e80] bg-[#f5f5f7] shadow-[0_0_0_4px_rgba(110,110,130,.16)] dark:border-[#8a8ab0] dark:bg-[#101435]"
      : isVideo
        ? "border-cms-line bg-black dark:border-[#2a2e63]"
        : hasValue
          ? "border-cms-line bg-white bg-cover bg-center bg-no-repeat dark:border-[#2a2e63] dark:bg-[#171a42]"
          : "border-cms-line bg-white text-cms-muted hover:border-cms-primary hover:text-cms-ink dark:border-[#2a2e63] dark:bg-[#171a42] dark:hover:border-[#41478c]",
    interactive ? "cursor-pointer" : "",
    uploading ? "pointer-events-none opacity-80" : "",
  ].join(" ");

  const showProgress = uploading;

  return (
    <div className={`flex flex-col ${className}`.trim()}>
      {label && <span className="mb-1.5 block text-[12.5px] font-normal text-cms-text">{label}</span>}

      <div
        aria-label={interactive ? `${label ?? "Image"} upload area` : undefined}
        className={zoneClass}
        onClick={interactive ? pick : undefined}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
          setDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          if (!uploading) setDragging(true);
        }}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        role={interactive ? "button" : undefined}
        style={hasValue && !isVideo ? { backgroundImage: `url("${value}")` } : undefined}
        tabIndex={interactive ? 0 : undefined}
      >
        {showProgress ? (
          <span className="flex flex-col items-center gap-2 text-[12.5px] font-semibold text-cms-ink">
            {typeof progress === "number" && progress >= 0 ? (
              <UploadProgressCircle progress={progress} />
            ) : (
              <UploadProgressCircle progress={100} />
            )}
            <span>{typeof progress === "number" && progress >= 0 ? `Uploading ${progress}%` : "Uploading..."}</span>
          </span>
        ) : isVideo ? (
          <video className="h-full w-full bg-black object-contain" controls preload="metadata" src={value} />
        ) : hasValue ? (
          <span className={`${cmsButtonClasses("secondary", "sm")} bg-white/90 shadow-sm dark:bg-[#171a42]/90`}>
            {chooseText}
          </span>
        ) : (
          <>
            <UploadIcon />
            <span className="block text-[13px] font-normal text-cms-ink">{emptyText}</span>
            <span className={cmsButtonClasses("secondary", "sm")}>{chooseText}</span>
          </>
        )}
      </div>

      {(value || hint) && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="min-w-0 flex-1 truncate text-[11.5px] text-cms-muted" title={value || undefined}>
            {value || hint}
          </span>
          <span className="flex items-center gap-2">
            {value && isVideo && !uploading && (
              <button className={cmsButtonClasses("secondary", "sm")} onClick={pick} type="button">
                {chooseText}
              </button>
            )}
            {value && !uploading && onRemove && (
              <button className={cmsButtonClasses("danger", "sm")} onClick={onRemove} type="button">
                Remove
              </button>
            )}
          </span>
        </div>
      )}

      {error && (
        <span className="mt-1.5 block text-[12px] text-[#d42a45] dark:text-[#ff9aa8]" role="alert">
          {error}
        </span>
      )}

      <input
        accept={accept}
        disabled={uploading}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) onFile(file);
        }}
        ref={inputRef}
        type="file"
      />
    </div>
  );
}

export default ImageUpload;
