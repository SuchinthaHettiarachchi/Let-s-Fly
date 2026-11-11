# Let's Fly.lk

The website for Let's Fly.lk, a travel agency in Rajagiriya, Sri Lanka.

## Folders

| Folder | What it is | Who works on it |
|---|---|---|
| [`frontend/`](frontend/) | The website: Next.js 16, React 19, Tailwind CSS v4, TypeScript. Setup steps are in [frontend/README.md](frontend/README.md). | Frontend developer |
| [`backend/`](backend/) | The server side: form handling, emails, bookings and anything else the site needs to store or send. See [backend/README.md](backend/README.md). | Backend developer |

Keep changes inside your own folder so the two sides don't conflict. If something has to change on both sides (for example a new form field), agree on it first.

## Deploying

The site is deployed on Vercel. Its **Root Directory** setting must be `frontend`.

## CMS Build Checklist

> **All tabs must be completed by 12 November 2026.** Once the CMS is completed, the chatbot will be integrated as the next phase.
>
> Legend: `[x]` completed · `[ ]` pending

### Home

- [x] **Hero Slider** — Admin can add, edit, reorder and delete hero image slots.
  - Each slot has two uploads: Desktop version and Mobile version.
  - Each upload field label shows the required aspect ratio (taken from the live website) and the format: WEBP.
- [ ] **Latest Packages** — Automatically retrieves the latest packages across all categories combined.
  - Shows up to 12 packages, newest first.
- [ ] **Who We Are Video** — One video slot only.
  - Field label shows aspect ratio 16:9 (1920 × 1080) and the accepted file format.
  - Video plays unmuted on the website.
- [ ] **Car & Bike Rental** — 4 image slots, one per category, each showing its aspect ratio and format on the field.
  - Each slot has 2 text input fields for the two text lines that overlap the image.

### Travel Sri Lanka

- [ ] **Categories & Cards** — Match the existing listing card and category layout on the website.
  - Categories are dynamic: admin can create, view, edit and delete (CRUD) categories.
- [ ] **Package Form** — Fields: Package Name, Days, Nights, Category, Gallery (multiple images).
- [ ] **Overview (sub-tab)** — Paragraph text field.
  - Cards that can be added easily with a + button (and removed).
- [ ] **Itinerary (sub-tab)** — Repeatable day entries, each with: Day, Eyebrow, Heading, Description.
- [ ] **Inclusions & Exclusions** — Two bullet-point lists; admin can add and remove items.
- [ ] **Payment Methods** — Payment methods section editable per package, as shown on the product detail page.

### Travel Overseas

- [ ] **Categories & Cards** — Match the existing listing card and category layout on the website.
  - Categories are dynamic (CRUD).
  - Each category also has an image.
- [ ] **Package Form** — Fields: Package Name, Days, Nights, Category, Gallery (multiple images).
- [ ] **Overview (sub-tab)** — Paragraph text field.
  - Cards that can be added easily with a + button (and removed).
- [ ] **Itinerary (sub-tab)** — Repeatable day entries, each with: Day, Eyebrow, Heading, Description.
- [ ] **Inclusions & Exclusions** — Two bullet-point lists; admin can add and remove items.
- [ ] **Payment Methods** — Payment methods section editable per package, as shown on the product detail page.

### Trains & Cruises

- [ ] **Type** — Admin first selects Train or Cruise.
- [ ] **Card Fields** — Form fields match every component shown in the UI card on the website.
- [ ] **Route** — Admin enters a Starting Point, then adds multiple Stops with a + button (can remove and reorder).
  - The card shows the route in order: Place 1 → Place 2 → … → Place X.

### Projects

- [x] **Categories** — Project categories are fixed (not editable by admin).
- [x] **Project Card & Detail** — Match the existing project card on the website.
  - Fields: Images, Heading, Date, 2–3 Paragraphs.

### Gallery

- [ ] **Gallery Items** — Admin can upload both images and videos; the website shows them shuffled together.
  - Each item has a text/caption field.

### Abroad Visa

- [ ] **Categories & Countries** — Categories and countries are dynamic (CRUD).
  - Only categories and countries that have been added appear in the website's filter dropdowns.
- [ ] **Visa Detail Page** — Follows the same structure as the travel package product detail page.

### Air Tickets

- [ ] **Ticket Cards** — Fields per card: Image, Start Location, End Location, Price per Person.
  - CTA button opens WhatsApp.

### Car & Bike Rental

- [ ] **Rental Cards** — Cards only; no product detail page.

### Contact Page

- [ ] **Job Postings** — Admin can add, edit and delete job posting cards.
  - Cards only; no detail page. Each card's CTA directs the applicant to email.
  - A tick box (show/hide) lets the client turn the entire Job Postings section on or off. When unticked, the section does not appear on the Contact page at all.

### Newsletter Subscribers

- [ ] Emails submitted through the website's newsletter form are added to the subscriber list automatically.
- [ ] Option to copy all email addresses at once.

### Inquiries

- [ ] **Inquiries Tab** — Mockup already developed (demo data). This is the final tab to build.
  - Call Uvindu before starting; he will guide the implementation.

### Special Notes

- **Existing code** — Newsletter, Projects and other modules have existing code to reuse from the JL Racing project. Ask Sumuditha about it. Ask for credentials if needed.
- **Frontend coordination** — Suchintha is doing frontend work. Check with him before working on a page so no merge conflicts appear.
