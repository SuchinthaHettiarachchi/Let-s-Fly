"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/auth-api";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const nextErrors: RegisterErrors = {};
    if (!name.trim()) nextErrors.name = "Please enter your name.";
    else if (name.trim().length > 50) nextErrors.name = "Name must be 50 characters or fewer.";
    if (!EMAIL_RE.test(email.trim())) nextErrors.email = "Please enter a valid email address.";
    if (!PASSWORD_RE.test(password))
      nextErrors.password = "Must be 8-72 characters with uppercase, lowercase and a number.";
    if (confirm !== password) nextErrors.confirm = "Passwords do not match.";
    setErrors(nextErrors);
    setNotice("");
    if (Object.keys(nextErrors).length > 0) {
      nameRef.current?.focus();
      return;
    }

    setBusy(true);
    const result = await authApi.register(name.trim(), email.trim(), password);
    if (result.ok) {
      setNotice("Account created. Opening the CMS…");
      router.replace("/cms");
      return;
    }
    setNotice(result.message || "Registration failed. Please try again.");
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
          <h1>Create your account</h1>
          <p>Register to access the Management Portal.</p>
        </header>

        <div className="stack">
          <section className="cms" aria-labelledby="register-title">
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M19 8v6M22 11h-6" />
                </svg>
              </div>
              <h2 id="register-title">
                Create Account<span>New</span>
              </h2>
            </div>
            <p>Set up your credentials to manage website content and travel products.</p>

            <form noValidate onSubmit={handleSubmit}>
              <div className={`field${errors.name ? " invalid" : ""}`}>
                <label htmlFor="name">Full name</label>
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
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                  </svg>
                  <input suppressHydrationWarning
                    autoComplete="name"
                    id="name"
                    name="name"
                    onChange={(event) => {
                      setName(event.target.value);
                      setErrors((current) => ({ ...current, name: undefined }));
                    }}
                    placeholder="Jane Perera"
                    ref={nameRef}
                    required
                    type="text"
                    value={name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby="name-err"
                  />
                </div>
                <span className="err-msg" id="name-err">
                  {errors.name ?? "Please enter your name."}
                </span>
              </div>

              <div className={`field${errors.email ? " invalid" : ""}`}>
                <label htmlFor="reg-email">Email</label>
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
                    id="reg-email"
                    name="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setErrors((current) => ({ ...current, email: undefined }));
                    }}
                    placeholder="you@letsfly.lk"
                    required
                    type="email"
                    value={email}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby="reg-email-err"
                  />
                </div>
                <span className="err-msg" id="reg-email-err">
                  {errors.email ?? "Please enter a valid email address."}
                </span>
              </div>

              <div className={`field${errors.password ? " invalid" : ""}`}>
                <label htmlFor="reg-pass">Password</label>
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
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <input suppressHydrationWarning
                    autoComplete="new-password"
                    id="reg-pass"
                    name="password"
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setErrors((current) => ({ ...current, password: undefined }));
                    }}
                    placeholder="Min. 8 chars, upper, lower & number"
                    required
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby="reg-pass-err"
                  />
                  <button suppressHydrationWarning
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                    aria-pressed={passwordVisible}
                    className="toggle-pw"
                    onClick={() => setPasswordVisible((visible) => !visible)}
                    type="button"
                  >
                    <svg
                      className="show"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <svg
                      className="hide"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.1-5.9M9.9 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a18.6 18.6 0 0 1-2.2 3.2M14.1 14.1a3 3 0 1 1-4.2-4.2M2 2l20 20" />
                    </svg>
                  </button>
                </div>
                <span className="err-msg" id="reg-pass-err">
                  {errors.password ?? "Must be 8-72 characters with uppercase, lowercase and a number."}
                </span>
              </div>

              <div className={`field${errors.confirm ? " invalid" : ""}`}>
                <label htmlFor="reg-confirm">Confirm password</label>
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
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <input suppressHydrationWarning
                    autoComplete="new-password"
                    id="reg-confirm"
                    name="confirm"
                    onChange={(event) => {
                      setConfirm(event.target.value);
                      setErrors((current) => ({ ...current, confirm: undefined }));
                    }}
                    placeholder="Re-enter your password"
                    required
                    type={passwordVisible ? "text" : "password"}
                    value={confirm}
                    aria-invalid={Boolean(errors.confirm)}
                    aria-describedby="reg-confirm-err"
                  />
                </div>
                <span className="err-msg" id="reg-confirm-err">
                  {errors.confirm ?? "Please confirm your password."}
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
                    <span>Creating account…</span>
                  </>
                ) : (
                  <>
                    <span className="lbl">Create Account</span>
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
                Already have an account? Sign in
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