import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";

export default function VerifyEmail() {
  const { state } = useLocation();
  const { resendVerificationHandler } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const email = state?.email ?? "";
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!email) {
    return <Navigate to="/home" replace />;
  }

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  async function resendHandler(event) {
    event.preventDefault();
    setIsSending(true);
    setMessage("");
    setErrorMessage("");

    try {
      const result = await resendVerificationHandler(email);
      if (result.success) {
        setMessage(result.data.message);
      } else {
        setErrorMessage(result.message);
      }
    } finally {
      setIsSending(false);
    }
  }

  const isLoginAttempt = state?.reason === "login";

  return (
    <main className="min-h-svh bg-canvas px-5 py-8 text-primary sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-[500px]">
        <header className="mb-10 flex items-center justify-between">
          <Link
            className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            to="/home"
            aria-label="Plexshity"
          >
            <span className="brand-mark grid size-11 shrink-0 place-items-center rounded-xl">
              <img
                className="size-10 object-contain"
                src="/Plexshity-io.png"
                alt=""
              />
            </span>
            <span className="text-base font-semibold tracking-tight">
              Plexshity<span className="text-accent">.io</span>
            </span>
          </Link>

          <Link
            className="rounded-lg border border-border px-3.5 py-2 text-sm text-muted transition-colors hover:bg-card-hover hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            to="/home"
          >
            ← Back
          </Link>
        </header>

        <section className="rounded-2xl border border-border bg-card px-6 py-8 shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:px-10 sm:py-10">
          <div className="mx-auto mb-6 grid size-14 place-items-center rounded-2xl border border-accent/15 bg-accent/10 text-accent">
            <svg
              aria-hidden="true"
              className="size-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="m4 7 8 6 8-6" />
              <path d="M18 3v4m-2-2h4" />
            </svg>
          </div>

          <div className="text-center">
            <p className="mb-3 text-xs font-medium tracking-[0.12em] text-accent">
              ONE LAST LITTLE STEP
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
              Check your inbox
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
              {isLoginAttempt
                ? "This email address still needs to be verified. Open the link we sent to finish setting up your account."
                : "We sent you a link to verify your email and finish setting up your account."}
            </p>
            {email && (
              <p className="mt-2 break-all text-sm font-medium text-primary">
                {email}
              </p>
            )}
            <p className="mx-auto mt-3 max-w-sm text-xs leading-5 text-muted">
              Your verification link is valid for 1 hour. If it expires, you can
              request a new one below.
            </p>
          </div>

          <Link
            className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition duration-200 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            to="/home"
          >
            Back to login
            <span aria-hidden="true">→</span>
          </Link>

          <form className="mt-5 text-center" onSubmit={resendHandler}>
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm text-muted underline decoration-border underline-offset-4 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60"
              type="submit"
              disabled={isSending}
            >
              {isSending ? "Sending…" : "Resend verification email"}
            </button>
            <p
              className="mt-2 min-h-5 text-xs leading-5 text-accent"
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
            {errorMessage && (
              <p className="auth-error mt-2 text-xs leading-5" role="alert">
                {errorMessage}
              </p>
            )}
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-muted">
            No email yet? Check your spam folder, or try sending it again.
          </p>
        </section>
      </div>
    </main>
  );
}
