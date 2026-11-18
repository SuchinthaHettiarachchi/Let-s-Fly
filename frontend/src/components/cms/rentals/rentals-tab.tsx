"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Breadcrumbs } from "@/components/cms/Breadcrumbs";
import { CmsButton } from "@/components/cms/CmsButton";
import { CmsCheckbox } from "@/components/cms/CmsCheckbox";
import { CmsSelect } from "@/components/cms/CmsSelect";
import { ImageUpload } from "@/components/cms/ImageUpload";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { VehicleIconSelect } from "@/components/rentals/VehicleIconSelect";
import { Icon } from "@/components/ui/Icon";
import { apiUrl } from "@/lib/api-url";
import type { DriveMode, FuelType, RentalCategory, RentalVehicle, Transmission } from "@/lib/rental-api";

const CATEGORIES_API = apiUrl("/rental-categories");
const VEHICLES_API = apiUrl("/rental-vehicles");
const UPLOAD = apiUrl("/upload");

const inputShell = "mt-1.5 h-10 w-full rounded-[9px] border border-[#dcdaf0] bg-white px-3 text-[13px] text-cms-ink outline-none focus:border-cms-primary dark:border-[#2a2e63] dark:bg-[#101435]";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const TRANSMISSIONS: Transmission[] = ["Automatic", "Manual"];
const FUELS: FuelType[] = ["Hybrid", "Diesel", "Petrol"];
const DRIVE_MODES: { id: DriveMode; label: string }[] = [
  { id: "self-drive", label: "Self-drive" },
  { id: "with-driver", label: "With driver" },
];

type CategoryDraft = { name: string; icon: string };
type VehicleDraft = {
  name: string;
  category: string;
  /** number | "" — the input can be completely cleared while typing. */
  seats: number | "";
  transmission: Transmission | "";
  fuel: FuelType | "";
  modes: DriveMode[];
  image: string;
};

const blankCategory = (): CategoryDraft => ({ name: "", icon: "" });
const blankVehicle = (): VehicleDraft => ({
  name: "",
  category: "",
  seats: "",
  transmission: "",
  fuel: "",
  modes: ["self-drive", "with-driver"],
  image: "",
});

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

async function prepareImage(file: File): Promise<string> {
  const original = await readAsDataUrl(file);
  if (file.type === "image/gif") return original;
  const image = await new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(null);
    img.onload = () => resolve(img);
    img.src = original;
  });
  if (!image || image.naturalWidth <= 1600) return original;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = Math.max(1, Math.round(image.naturalHeight * (1600 / image.naturalWidth)));
    const ctx = canvas.getContext("2d");
    if (!ctx) return original;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    if (!blob) return original;
    return await readAsDataUrl(new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" }));
  } catch {
    return original;
  }
}

async function uploadToR2(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image must be 5MB or smaller.");
  const prepared = await prepareImage(file);
  const response = await fetch(UPLOAD, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: prepared, folder: "rentals" }),
  });
  const data: { url?: string; message?: string } = await response.json().catch(() => ({}));
  if (!response.ok || !data.url) throw new Error(data.message ?? "Upload failed.");
  return data.url;
}

type DeleteTarget = { kind: "category" | "vehicle"; id: string; label: string };

export default function RentalsTab({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [categories, setCategories] = useState<RentalCategory[]>([]);
  const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");

  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft>(blankCategory());
  const [categoryEditingId, setCategoryEditingId] = useState<string | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);

  const [vehicleDraft, setVehicleDraft] = useState<VehicleDraft>(blankVehicle());
  const [vehicleEditingId, setVehicleEditingId] = useState<string | null>(null);
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = useCallback(async (): Promise<{ categories: RentalCategory[]; vehicles: RentalVehicle[] }> => {
    const [catRes, vehRes] = await Promise.all([
      fetch(CATEGORIES_API, { credentials: "include" }),
      fetch(`${VEHICLES_API}/manage`, { credentials: "include" }),
    ]);
    if (!catRes.ok || !vehRes.ok) throw new Error("load failed");
    const catData: { categories?: RentalCategory[] } = await catRes.json();
    const vehData: { vehicles?: RentalVehicle[] } = await vehRes.json();
    return {
      categories: Array.isArray(catData.categories) ? catData.categories : [],
      vehicles: Array.isArray(vehData.vehicles) ? vehData.vehicles : [],
    };
  }, []);

  const load = useCallback(async () => {
    try {
      const { categories: catList, vehicles: vehList } = await fetchAll();
      setCategories(catList);
      setVehicles(vehList);
    } catch {
      setNotice("Could not load rentals. Please sign in again or try again.");
    } finally {
      setLoaded(true);
    }
  }, [fetchAll]);

  useEffect(() => {
    let cancelled = false;
    fetchAll()
      .then(({ categories: catList, vehicles: vehList }) => {
        if (cancelled) return;
        setCategories(catList);
        setVehicles(vehList);
      })
      .catch(() => {
        if (cancelled) return;
        setNotice("Could not load rentals. Please sign in again or try again.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchAll]);

  const categoryName = (id: string) => categories.find((c) => c._id === id)?.name ?? "—";

  // —— Categories ————————————————————————————————————————————————

  const categoryValid = categoryDraft.name.trim().length > 0 && categoryDraft.icon.length > 0;

  async function saveCategory() {
    if (!categoryValid) return;
    setSavingCategory(true);
    setNotice("");
    try {
      const response = await fetch(categoryEditingId ? `${CATEGORIES_API}/${categoryEditingId}` : CATEGORIES_API, {
        method: categoryEditingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryDraft.name.trim(), icon: categoryDraft.icon }),
      });
      const data: { message?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Could not save category.");
      setNotice(categoryEditingId ? "Category updated." : "Category created.");
      setCategoryDraft(blankCategory());
      setCategoryEditingId(null);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save category.");
    } finally {
      setSavingCategory(false);
    }
  }

  function editCategory(cat: RentalCategory) {
    setCategoryEditingId(cat._id);
    setCategoryDraft({ name: cat.name, icon: cat.icon });
    setNotice("");
  }

  function resetCategory() {
    setCategoryEditingId(null);
    setCategoryDraft(blankCategory());
  }

  // —— Vehicles ————————————————————————————————————————————————————

  const seatsValid = vehicleDraft.seats !== "" && Number.isInteger(vehicleDraft.seats) && vehicleDraft.seats >= 1;
  const vehicleValid =
    vehicleDraft.name.trim().length > 0 &&
    vehicleDraft.category.length > 0 &&
    seatsValid &&
    vehicleDraft.transmission !== "" &&
    vehicleDraft.fuel !== "" &&
    vehicleDraft.modes.length > 0;

  async function uploadImage(file?: File | null) {
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadToR2(file);
      setVehicleDraft((current) => ({ ...current, image: url }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function saveVehicle() {
    if (!vehicleValid) return;
    setSavingVehicle(true);
    setNotice("");
    try {
      const body = {
        name: vehicleDraft.name.trim(),
        category: vehicleDraft.category,
        seats: vehicleDraft.seats,
        transmission: vehicleDraft.transmission,
        fuel: vehicleDraft.fuel,
        modes: vehicleDraft.modes,
        image: vehicleDraft.image,
      };
      const response = await fetch(vehicleEditingId ? `${VEHICLES_API}/${vehicleEditingId}` : VEHICLES_API, {
        method: vehicleEditingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: { message?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Could not save vehicle.");
      setNotice(vehicleEditingId ? "Vehicle updated." : "Vehicle created.");
      setVehicleDraft(blankVehicle());
      setVehicleEditingId(null);
      setUploadError("");
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save vehicle.");
    } finally {
      setSavingVehicle(false);
    }
  }

  function editVehicle(vehicle: RentalVehicle) {
    setVehicleEditingId(vehicle._id);
    setVehicleDraft({
      name: vehicle.name,
      category: vehicle.category,
      seats: vehicle.seats,
      transmission: vehicle.transmission,
      fuel: vehicle.fuel,
      modes: vehicle.modes.length ? vehicle.modes : ["self-drive", "with-driver"],
      image: vehicle.image ?? "",
    });
    setUploadError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetVehicle() {
    setVehicleEditingId(null);
    setVehicleDraft(blankVehicle());
    setUploadError("");
  }

  // —— Delete (with confirmation modal) ————————————————————————————

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setNotice("");
    try {
      const url = deleteTarget.kind === "category" ? `${CATEGORIES_API}/${deleteTarget.id}` : `${VEHICLES_API}/${deleteTarget.id}`;
      const response = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!response.ok) {
        const data: { message?: string } = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Could not delete.");
      }
      setNotice(deleteTarget.kind === "category" ? "Category deleted." : "Vehicle deleted.");
      if (deleteTarget.kind === "category" && categoryEditingId === deleteTarget.id) resetCategory();
      if (deleteTarget.kind === "vehicle" && vehicleEditingId === deleteTarget.id) resetVehicle();
      setDeleteTarget(null);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-cms-ink">Rental</h1>
          <p className="mt-1 text-[13px] text-cms-muted">Manage rental categories and the vehicle cards shown on the Rentals page.</p>
          <Breadcrumbs items={[{ label: "Home", href: "#home", id: "home" }, { label: "Rental" }]} onNavigate={onNavigate} className="mt-3" />
        </div>
        <span className="text-[12px] text-cms-muted" aria-live="polite">{notice}</span>
      </div>

      {/* —— Categories: form | list —— */}
      <section className="mb-5 rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4">
          <h2 className="text-[16px] font-semibold text-cms-ink">Categories</h2>
          <p className="mt-1 text-[12px] text-cms-muted">Filter chips on the Rentals page. Each category has a name and a vehicle icon.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Left: add / edit form */}
          <div className="rounded-[11px] border border-cms-line bg-cms-bg p-4 dark:bg-[#101435]">
            <h3 className="text-[13px] font-semibold text-cms-ink">{categoryEditingId ? "Edit category" : "Add category"}</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Category name">
                <input
                  className={inputShell}
                  placeholder="Cars"
                  value={categoryDraft.name}
                  onChange={(event) => setCategoryDraft((d) => ({ ...d, name: event.target.value }))}
                />
              </Field>
              <Field label="Vehicle icon">
                <VehicleIconSelect
                  value={categoryDraft.icon}
                  onChange={(icon) => setCategoryDraft((d) => ({ ...d, icon }))}
                  className="mt-1.5"
                />
              </Field>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CmsButton variant="primary" disabled={!categoryValid || savingCategory} onClick={() => void saveCategory()}>
                {savingCategory ? "Saving…" : categoryEditingId ? "Update category" : "Add category"}
              </CmsButton>
              {categoryEditingId && (
                <CmsButton variant="secondary" onClick={resetCategory}>Cancel edit</CmsButton>
              )}
              {!categoryValid && <span className="text-[12px] text-cms-muted">Name and icon are required.</span>}
            </div>
          </div>

          {/* Right: existing categories table */}
          <div className="rounded-[11px] border border-cms-line bg-cms-bg p-4 dark:bg-[#101435]">
            <h3 className="text-[13px] font-semibold text-cms-ink">Existing categories</h3>
            {!loaded ? (
              <p className="mt-3 text-[12.5px] text-cms-muted">Loading…</p>
            ) : !categories.length ? (
              <p className="mt-3 text-[12.5px] text-cms-muted">No categories yet — add one on the left.</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-cms-line text-[11px] font-semibold uppercase tracking-wide text-cms-muted">
                      <th className="pb-2 pr-3">Icon</th>
                      <th className="pb-2 pr-3">Name</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr className="border-b border-cms-line last:border-0" key={cat._id}>
                        <td className="py-2.5 pr-3">
                          <span className="flex items-center gap-2 text-[13px] text-cms-ink">
                            <Icon name={cat.icon} size={18} className="text-cms-primary" />
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 text-[13px] font-medium text-cms-ink">{cat.name}</td>
                        <td className="py-2.5 text-right">
                          <span className="inline-flex gap-1.5">
                            <CmsButton size="sm" variant="secondary" onClick={() => editCategory(cat)}>Edit</CmsButton>
                            <CmsButton
                              size="sm"
                              variant="danger"
                              onClick={() => setDeleteTarget({ kind: "category", id: cat._id, label: cat.name })}
                            >
                              Delete
                            </CmsButton>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* —— Vehicles —— */}
      <section className="mb-5 rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-cms-ink">{vehicleEditingId ? "Edit vehicle" : "Add vehicle"}</h2>
            <p className="mt-1 text-[12px] text-cms-muted">Vehicle cards show the photo, seats, transmission and fuel on the Rentals page.</p>
          </div>
          {vehicleEditingId && <CmsButton variant="secondary" onClick={resetVehicle}>Cancel edit</CmsButton>}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_1px_minmax(280px,340px)]">
          {/* Left: vehicle input fields */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Vehicle title">
              <input
                className={inputShell}
                placeholder="Honda Vezel"
                value={vehicleDraft.name}
                onChange={(event) => setVehicleDraft((d) => ({ ...d, name: event.target.value }))}
              />
            </Field>
            <Field label="Category">
              <CmsSelect
                aria-label="Category"
                className="mt-1.5"
                onChange={(category) => setVehicleDraft((d) => ({ ...d, category }))}
                options={categories.map((cat) => ({ value: cat._id, label: cat.name, icon: cat.icon }))}
                placeholder="Select a category…"
                value={vehicleDraft.category}
              />
            </Field>
            <Field label="Seats">
              <input
                className={inputShell}
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                placeholder="5"
                value={vehicleDraft.seats}
                onChange={(event) => {
                  const raw = event.target.value;
                  // "" clears the field completely; otherwise keep the typed number (may be invalid until corrected).
                  if (raw === "") setVehicleDraft((d) => ({ ...d, seats: "" }));
                  else {
                    const n = Number(raw);
                    setVehicleDraft((d) => ({ ...d, seats: Number.isNaN(n) ? "" : n }));
                  }
                }}
              />
              {!seatsValid && (
                <span className="mt-1 block text-[11.5px] text-[#d42a45] dark:text-[#ff9aa8]">
                  {vehicleDraft.seats === "" ? "Seats are required." : "Seats must be a positive whole number."}
                </span>
              )}
            </Field>
            <Field label="Transmission">
              <CmsSelect
                aria-label="Transmission"
                className="mt-1.5"
                onChange={(transmission) => setVehicleDraft((d) => ({ ...d, transmission: transmission as Transmission | "" }))}
                options={TRANSMISSIONS.map((t) => ({ value: t, label: t }))}
                value={vehicleDraft.transmission}
              />
            </Field>
            <Field label="Fuel type">
              <CmsSelect
                aria-label="Fuel type"
                className="mt-1.5"
                onChange={(fuel) => setVehicleDraft((d) => ({ ...d, fuel: fuel as FuelType | "" }))}
                options={FUELS.map((f) => ({ value: f, label: f }))}
                value={vehicleDraft.fuel}
              />
            </Field>
            <fieldset className="sm:col-span-2">
              <legend className="text-[12.5px] font-semibold text-cms-text">Drive modes</legend>
              <div className="mt-2 flex flex-wrap gap-4">
                {DRIVE_MODES.map((mode) => {
                  const checked = vehicleDraft.modes.includes(mode.id);
                  return (
                    <CmsCheckbox
                      key={mode.id}
                      checked={checked}
                      onChange={() =>
                        setVehicleDraft((d) => {
                          const next = checked ? d.modes.filter((m) => m !== mode.id) : [...d.modes, mode.id];
                          return { ...d, modes: next.length ? next : d.modes };
                        })
                      }
                      label={mode.label}
                      labelClassName="text-[12px] font-normal text-cms-text"
                    />
                  );
                })}
              </div>
              {!vehicleDraft.modes.length && <span className="mt-1 block text-[11.5px] text-[#d42a45] dark:text-[#ff9aa8]">Select at least one drive mode.</span>}
            </fieldset>
          </div>

          <div aria-hidden className="hidden self-stretch bg-gradient-to-b from-transparent via-gray-300/80 to-transparent dark:via-[#2a2e63] lg:block" />

          {/* Right: shared vehicle image upload */}
          <div className="rounded-[11px] border border-cms-line bg-cms-bg p-4 dark:bg-[#101435] lg:self-start">
            <h3 className="text-[13px] font-semibold text-cms-ink">Vehicle image</h3>
            <p className="mt-1 text-[12px] text-cms-muted">Shown on the vehicle card on the Rentals page.</p>
            <ImageUpload
              accept="image/*"
              className="mt-3"
              error={uploadError}
              height="h-[170px]"
              hint="JPEG, PNG, WebP or GIF · up to 5MB"
              onFile={(file) => void uploadImage(file)}
              onRemove={() => {
                setVehicleDraft((d) => ({ ...d, image: "" }));
                setUploadError("");
              }}
              uploading={uploading}
              value={vehicleDraft.image}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          {!vehicleValid && <span className="mr-auto text-[12px] text-cms-muted">Fill in all required fields to save.</span>}
          <CmsButton variant="primary" disabled={!vehicleValid || savingVehicle || uploading} onClick={() => void saveVehicle()}>
            {savingVehicle ? "Saving…" : vehicleEditingId ? "Update vehicle" : "Add vehicle"}
          </CmsButton>
        </div>
      </section>

      {/* —— Vehicle listing —— */}
      <section className="rounded-[14px] border border-cms-line bg-cms-card p-5 shadow-[0_1px_3px_rgba(16,10,80,0.06)] dark:shadow-none">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-cms-ink">Vehicles ({vehicles.length})</h2>
          <CmsButton variant="secondary" onClick={() => void load()}>Refresh</CmsButton>
        </div>
        {!loaded ? (
          <p className="text-[13px] text-cms-muted">Loading vehicles…</p>
        ) : !vehicles.length ? (
          <p className="text-[13px] text-cms-muted">No vehicles yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {vehicles.map((vehicle) => (
              <article className="flex overflow-hidden rounded-[11px] border border-cms-line" key={vehicle._id}>
                <div
                  className="min-h-[96px] w-24 flex-none border-r border-cms-line bg-cms-bg bg-cover bg-center bg-no-repeat sm:w-28"
                  style={vehicle.image ? { backgroundImage: `url("${vehicle.image}")` } : undefined}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-cms-ink">{vehicle.name}</h3>
                      <p className="mt-1 text-[12px] text-cms-muted">
                        {categoryName(vehicle.category)} · {vehicle.seats} seats · {vehicle.transmission} · {vehicle.fuel}
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-cms-muted">
                        {vehicle.modes.map((m) => (m === "self-drive" ? "Self-drive" : "With driver")).join(" · ")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <CmsButton size="sm" variant="secondary" onClick={() => editVehicle(vehicle)}>Edit</CmsButton>
                    <CmsButton
                      size="sm"
                      variant="danger"
                      onClick={() => setDeleteTarget({ kind: "vehicle", id: vehicle._id, label: vehicle.name })}
                    >
                      Delete
                    </CmsButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <DeleteConfirmModal
        open={deleteTarget !== null}
        title={deleteTarget?.kind === "category" ? "Delete category?" : "Delete vehicle?"}
        message={
          deleteTarget
            ? deleteTarget.kind === "category"
              ? `“${deleteTarget.label}” will be removed. Vehicles using it must be reassigned first, and nothing else is affected.`
              : `“${deleteTarget.label}” will be permanently deleted. Its image is removed from Cloudflare only if no other page uses it.`
            : ""
        }
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[12.5px] font-semibold text-cms-text">{label}{children}</label>;
}
