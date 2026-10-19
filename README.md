# Let's Fly.lk website

The website for Let's Fly.lk, a travel agency in Sri Lanka. It covers holiday packages, air tickets, visa services, vehicle rentals, projects and a travellers gallery.

Built with [Next.js 16](https://nextjs.org) (App Router), React 19, [Tailwind CSS v4](https://tailwindcss.com) and TypeScript, using the **Ocean & Sun** colour palette.

---

## 1. What you need first

| Tool | Version | How to check | Download |
|---|---|---|---|
| **Node.js** | 20.9 or newer (22 LTS recommended) | `node -v` | https://nodejs.org |
| **npm** | comes with Node.js | `npm -v` | — |
| **Git** | any recent version | `git --version` | https://git-scm.com |

You also need an internet connection the first time you run it, because the fonts (Poppins and Material Symbols) load from Google Fonts.

## 2. Download the project

**With Git (recommended):**

```bash
git clone https://github.com/SuchinthaHettiarachchi/Let-s-Fly.git
cd Let-s-Fly
```

**Without Git:** on the GitHub page, click the green **Code** button, then **Download ZIP**. Unzip it and open a terminal in the unzipped folder.

## 3. Install the packages

Run this once, inside the project folder:

```bash
npm install
```

This creates a `node_modules` folder. It can take a minute or two.

## 4. Run the website

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser. Changes you make to the code show up straight away. To stop the server, press `Ctrl + C` in the terminal.

## 5. Other commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server at http://localhost:3000 |
| `npm run build` | Builds the production version (also checks for type errors) |
| `npm run start` | Runs the production version. Run `npm run build` first |
| `npm run lint` | Checks the code for problems |

---

## Pages

| Page | Address |
|---|---|
| Home | `/` |
| Travel Sri Lanka | `/holidays/sri-lanka` |
| Outbound holidays | `/holidays/outbound` |
| Trains + Cruises | `/holidays/trains-cruises` |
| Package detail | `/packages/dubai-family-escape` |
| Air Tickets | `/air-tickets` |
| Visa Services | `/visa` |
| Visa detail | `/visa/dubai` |
| Rentals | `/rentals` |
| Projects | `/projects` (each project has its own page) |
| Travellers Gallery | `/gallery` |
| About Us | `/about` |
| Contact | `/contact` |

## Project structure

```
public/images/        Photos, logo and flags
src/app/              One folder per page (the folder name is the web address)
src/components/       Reusable pieces: header, footer, buttons, cards, forms
src/data/             All the website content (packages, visas, rentals, etc.)
src/app/globals.css   Colours, fonts and shadows (the Ocean & Sun palette)
```

### Changing content

Most text, prices and lists are in `src/data/`. You can edit them without touching the page layouts. For example:

- **Contact details** (phone, email, address, WhatsApp, socials): `src/data/site.ts`
- **Holiday packages**: `src/data/packages.ts`
- **Visas**: `src/data/visas.ts`
- **Rental vehicles**: `src/data/rentals.ts`
- **Projects**: `src/data/projects.ts`
- **Gallery photos**: `src/data/gallery.ts`

To add a photo, put it in `public/images/...` and set the `image` field to its path, for example `image: "/images/packages/my-photo.jpg"`. Items with no image show a grey "PHOTO" placeholder.

### Colour palette

| Name | Hex | Used for |
|---|---|---|
| Navy | `#0B2545` | Header bar, dark sections, footer |
| Ocean | `#13579B` | Buttons and links (hover `#1B6CC0`) |
| Sun | `#FFEA00` | Highlights only. Never a button, and never white text on it |
| Sand | `#F7F4EC` and up | Alternating section backgrounds and borders |

## Not finished yet

- **Forms** (inquiry, contact, flight search) show a "sent" message but don't send anything yet. They need an email service or backend.
- **Booking portal links** for hotels and flights are not set yet (`bookingPortals` in `src/data/site.ts`).
- **Placeholders:** some photos are missing, and some text is draft copy waiting to be confirmed.
- **Missing pages:** Privacy Policy and Terms are not built yet. Only the Dubai package has a full detail page.

## Deploying

The easiest option is [Vercel](https://vercel.com/new):

1. Sign in with GitHub.
2. Import this repository.
3. Click **Deploy**. No settings need changing.
