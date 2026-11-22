# Email for the website forms (EmailJS)

Every form on the site emails **kasun@letsfly.lk** through [EmailJS](https://www.emailjs.com):

| Form | Email subject |
|---|---|
| Contact form (Contact, Visa, Air Tickets, package pages) | `New enquiry: <subject or service> from <name>` |
| Inquiry popup (Plan My Trip, Inquire Now, visa sidebar) | `New inquiry: <subject or service, destination> from <name>` |
| GDPR request (`/gdpr`) | `GDPR request: amend or delete the data for <email>` |
| Newsletter (above the footer) | `New newsletter subscriber: <email>` |

The site builds the whole email (a branded table of the visitor's answers, the GDPR consent and the page it came from), so EmailJS only needs **one template**. Pressing **Reply** answers the visitor directly.

Until the three keys below are set, the forms show "Sorry, we couldn't send that just now", along with the phone number and email, and nothing is lost silently.

## 1. Create the account (about 10 minutes)

1. Sign up at https://dashboard.emailjs.com/sign-up. Use the office account, not a personal one.
2. **Email Services → Add New Service → Gmail** (or Outlook / another provider). Sign in with the mailbox that should **send** these emails, for example inquiry@letsfly.lk. Copy the **Service ID**, e.g. `service_ab12cd3`.
3. **Email Templates → Create New Template**, then fill it in exactly like this:

   | Field | Value |
   |---|---|
   | Subject | `{{subject}}` |
   | Content | click **Edit Content → Code Editor**, delete everything, and paste `{{{message_html}}}` (three braces on each side) |
   | To Email | `kasun@letsfly.lk` |
   | From Name | `{{from_name}}` |
   | From Email | leave "Use Default Email Address" ticked |
   | Reply To | `{{reply_to}}` |

   Save it, then copy the **Template ID**, e.g. `template_x9y8z7`.

   > Type kasun@letsfly.lk into the template itself. Never use a `{{to_email}}` variable: the keys are public, so anyone could then use the account to send email to any address.

4. **Account → General**: copy the **Public Key**.
5. **Account → Security**:
   - Add `letsfly.lk`, `www.letsfly.lk` and `let-s-fly.vercel.app` to **Allowed Origins**, so no other site can use the keys.
   - Leave "Use Private Key" off. The site sends from the browser and needs only the public key.

## 2. Add the keys

The three values are not secret passwords (they end up in the page), but keep them out of git anyway so they're easy to change.

**Locally:** copy `frontend/.env.example` to `frontend/.env.local`, fill in the three values, then restart `npm run dev`.

**On Vercel:**
1. Go to Project → **Settings → Environment Variables**.
2. Add the same three variables for Production, Preview and Development.
3. Go to **Deployments**, find the latest one, then open **⋯ → Redeploy**. The values are built into the page, so they only take effect after a new build.

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

## 3. Test

Send each form once on the live site and check that kasun@letsfly.lk receives 4 emails. Check spam the first time, and mark the first email "Not spam".

## Limits and notes

- The free EmailJS plan allows **200 emails a month**. If the office expects more, upgrade the plan in the EmailJS dashboard; no code changes are needed.
- Spam protection: every form has a hidden "honeypot" field that bots fill in and people never see. Those submissions are dropped without sending. If spam still gets through, switch on reCAPTCHA in EmailJS (Account → Security).
- The code is in `src/lib/email.ts`. The forms are `ContactForm`, `InquiryForm`, `GdprForm` and `Newsletter`.
