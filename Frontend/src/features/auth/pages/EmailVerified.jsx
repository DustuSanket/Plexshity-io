import { Link, useSearchParams } from "react-router";

export default function EmailVerified() {
  const [searchParams] = useSearchParams();
  const alreadyVerified = searchParams.get("status") === "already-verified";

  return (
    <main className="min-h-svh bg-canvas px-5 py-8 text-primary sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-[500px]">
        <header className="mb-10">
          <Link
            className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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
        </header>

        <section
          className="rounded-2xl border border-border bg-card px-6 py-8 shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:px-10 sm:py-10"
          aria-labelledby="email-verified-title"
        >
          <div className="mx-auto mb-6 grid size-14 place-items-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
            <svg
              aria-hidden="true"
              className="size-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>

          <div className="text-center">
            <p className="mb-3 text-xs font-medium tracking-[0.12em] text-accent">
              {alreadyVerified ? "ALREADY VERIFIED" : "YOU’RE ALL SET"}
            </p>
            <h1
              className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]"
              id="email-verified-title"
            >
              {alreadyVerified
                ? "Your email is already verified"
                : "Thanks for verifying your email"}
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
              {alreadyVerified
                ? "Your account is ready. Go to Plexshity.io to log in and start exploring."
                : "Your email is confirmed. You can close this page and return to Plexshity to log in, or continue with the button below."}
            </p>
          </div>

          <Link
            className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition duration-200 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            to="/home"
          >
            {alreadyVerified ? "Go to Plexshity.io" : "Go to login"}
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
