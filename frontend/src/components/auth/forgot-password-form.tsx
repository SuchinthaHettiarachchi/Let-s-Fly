"use client";

import { useRef, useState, type FormEvent } from "react";
import { authApi } from "@/lib/auth-api";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function ForgotPasswordForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    if (!EMAIL_RE.test(email.trim())) {
      setInvalid(true);
      setNotice("");
      emailRef.current?.focus();
      return;
    }

    setBusy(true);
    const result = await authApi.forgotPassword(email.trim());
    if (result.ok) {
      setNotice(result.message || "If an account exists for that email, a reset link has been sent.");
      setEmail("");
    } else {
      setNotice(result.message || "Could not process your request. Please try again.");
    }
    setBusy(false);
  }

  return (
    <>
      <div className="bg" aria-hidden="true" />
      <main className="page auth-page">
        <header className="brand">
          <div className="logo" aria-label="Let's Fly.lk">
            Let&apos;sFly
          </div>
          <span className="tag">Staff Gateway</span>
          <h1>Reset your password</h1>
          <p>We&apos;ll send a secure reset link to your registered email.</p>
        </header>

        <div className="stack">
          <section className="cms" aria-labelledby="forgot-title">
            <div className="cms-head">
              <div className="cms-ic" aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 id="forgot-title">
                Forgot Password<span>Reset</span>
              </h2>
            </div>
            <p>Enter the email you registered with and we&apos;ll email you a link to set a new password.</p>

            <form noValidate onSubmit={handleSubmit}>
              <div className={`field${invalid ? " invalid" : ""}`}>
                <label htmlFor="forgot-email">Email</label>
                <div className="control">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  <input suppressHydrationWarning
                    autoComplete="email"
                    id="forgot-email"
                    name="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setInvalid(false);
                    }}
                    placeholder="you@letsfly.lk"
                    ref={emailRef}
                    required
                    type="email"
                    value={email}
                    aria-invalid={invalid}
                    aria-describedby="forgot-email-err"
                  />
                </div>
                <span className="err-msg" id="forgot-email-err">
                  Please enter a valid email address.
                </span>
              </div>

              <button suppressHydrationWarning
                className={`btn-signin${busy ? " loading" : ""}`}
                disabled={busy}
                type="submit"
              >
                {busy ? (
                  <>
                    <span className="spinner" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <span className="lbl">Send Reset Link</span>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>

              <a className="forgot" href="/login">
                Back to sign in
              </a>
            </form>

            <div
              className={`notice${notice ? " show" : ""}`}
              role="status"
              aria-live="polite"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16h.01" />
              </svg>
              <span>{notice}</span>
            </div>

            <div className="secure">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Authorised Let&apos;s Fly staff only
            </div>
          </section>
        </div>

        <footer className="foot">
          <span>© 2026 Let&apos;s Fly.lk · Internal use only</span>
          <span className="dot" />
          <a href="https://letsfly.lk">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back to website
          </a>
        </footer>
      </main>
    </>
  );
}