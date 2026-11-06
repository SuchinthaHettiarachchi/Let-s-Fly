# Backend

This folder is for the backend developer. It is empty so far: the stack (language, framework, database, hosting) is your choice.

## What the website needs from the backend

Right now the forms on the site check what people type but **don't send it anywhere**. These need somewhere to go:

| Form | Where it is in the frontend | Where it shows |
|---|---|---|
| Contact form ("How can we help?") | `frontend/src/components/contact/ContactForm.tsx` | Contact page, Visa, Air Tickets, package pages |
| Inquiry form (popup) | `frontend/src/components/inquiry/InquiryForm.tsx` | "Plan My Trip", "Inquire Now" and service buttons |
| Newsletter sign-up | `frontend/src/components/layout/Newsletter.tsx` | Footer area on every page |
| GDPR / data request form | `frontend/src/components/legal/GdprForm.tsx` | `/gdpr` page |

Each form's fields are in its file (look for the `name="..."` attributes). Every form except the newsletter has a GDPR consent tick box, which should be stored with the submission.

Once an endpoint is ready, share its URL and the JSON it expects, and the frontend will be wired to call it.

## Rules for this repo

- Keep backend code inside `backend/`. Don't edit `frontend/` (and the frontend won't touch `backend/`).
- Never commit secrets: put API keys and passwords in `.env` files, which are ignored by git.
