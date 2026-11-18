import { useState } from "react";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const features = [
  {
    icon: "search",
    title: "Follow your curiosity",
    description: "Ask about what interests you and see where it leads.",
  },
  {
    icon: "link",
    title: "See the bigger picture",
    description: "Notice how ideas and topics fit together.",
  },
  {
    icon: "bookmark",
    title: "Save the good bits",
    description: "Keep useful discoveries and return to them with context.",
    tone: "tertiary",
  },
];

function FeatureIcon({ name }) {
  const paths = {
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="5.8" />
        <path d="m15.2 15.2 4.3 4.3" />
      </>
    ),
    link: (
      <>
        <path d="m9.5 14.5 5-5" />
        <path d="m8 16-1.3 1.3a3 3 0 0 1-4.2-4.2l4-4a3 3 0 0 1 4.2 0" />
        <path d="m16 8 1.3-1.3a3 3 0 0 1 4.2 4.2l-4 4a3 3 0 0 1-4.2 0" />
      </>
    ),
    bookmark: (
      <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21V4.8Z" />
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function CuriosityFlow() {
  return (
    <svg
      aria-hidden="true"
      className="curiosity-flow"
      viewBox="0 0 500 760"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="curiosity-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity=".75" />
          <stop offset="72%" stopColor="white" stopOpacity=".85" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="curiosity-mask">
          <rect width="500" height="760" fill="url(#curiosity-fade)" />
        </mask>
      </defs>

      <g mask="url(#curiosity-mask)">
        <g className="curiosity-cluster">
          <path
            className="curiosity-path"
            pathLength="1"
            d="M75 200C82 245 143 240 151 292s-35 77-15 118 82 75 96 110-34 74-62 110 31 90 76 99"
          />
          <path
            className="curiosity-travel-glow"
            pathLength="1"
            d="M75 200C82 245 143 240 151 292s-35 77-15 118 82 75 96 110-34 74-62 110 31 90 76 99"
          />
          <circle className="curiosity-node-halo" cx="75" cy="200" r="7" />
          <circle
            className="curiosity-node"
            style={{ animationDelay: "-2s" }}
            cx="75"
            cy="200"
            r="1.7"
          />
          <circle className="curiosity-node-halo" cx="136" cy="410" r="6" />
          <circle
            className="curiosity-node"
            style={{ animationDelay: "-1s" }}
            cx="136"
            cy="410"
            r="1.5"
          />
          <circle className="curiosity-node-halo" cx="170" cy="630" r="7" />
          <circle
            className="curiosity-node"
            style={{ animationDelay: "-4s" }}
            cx="170"
            cy="630"
            r="1.7"
          />
        </g>

        <g className="curiosity-cluster">
          <path
            className="curiosity-path curiosity-path-branch"
            pathLength="1"
            d="M151 292c-55 27-87 67-83 111s34 42 68 7"
          />
          <path
            className="curiosity-path curiosity-path-branch"
            pathLength="1"
            d="M151 292c67 31 128 23 147 74s-24 96-66 154"
          />
          <circle className="curiosity-node-halo" cx="298" cy="366" r="5.5" />
          <circle
            className="curiosity-node"
            style={{ animationDelay: "-8s" }}
            cx="298"
            cy="366"
            r="1.4"
          />
        </g>

        <g className="curiosity-cluster">
          <path
            className="curiosity-path curiosity-path-branch"
            pathLength="1"
            d="M136 410c-54 42-83 92-58 137 19 34 56 41 92 83"
          />
          <path
            className="curiosity-path curiosity-path-branch"
            pathLength="1"
            d="M232 520c61-31 133-3 130 50-2 37-41 53-80 60s-39 77-36 99"
          />
          <path
            className="curiosity-path curiosity-path-branch"
            pathLength="1"
            d="M170 630c19 29 57 47 76 68 25 27 68 29 108 7"
          />
        </g>
      </g>
    </svg>
  );
}

function AuthPanel({ activeTab, onTabChange }) {
  const isLogin = activeTab === "login";
  const ActiveForm = isLogin ? Login : Register;

  return (
    <div>
      <div
        className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface-dim p-1"
        role="tablist"
        aria-label="Account options"
      >
        <button
          id="login-tab"
          className={`min-h-10 rounded-lg px-4 text-sm font-medium transition-colors duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            isLogin
              ? "bg-card text-primary shadow-sm"
              : "text-muted hover:text-primary"
          }`}
          type="button"
          role="tab"
          aria-selected={isLogin}
          aria-controls="auth-panel"
          onClick={() => onTabChange("login")}
        >
          Login
        </button>
        <button
          id="register-tab"
          className={`min-h-10 rounded-lg px-4 text-sm font-medium transition-colors duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            !isLogin
              ? "bg-card text-primary shadow-sm"
              : "text-muted hover:text-primary"
          }`}
          type="button"
          role="tab"
          aria-selected={!isLogin}
          aria-controls="auth-panel"
          onClick={() => onTabChange("register")}
        >
          Register
        </button>
      </div>

      <div
        className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        id="auth-panel"
        role="tabpanel"
        aria-labelledby={isLogin ? "login-tab" : "register-tab"}
      >
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-1 text-sm leading-5 text-muted">
          {isLogin
            ? "Pick up where your curiosity left off."
            : "Start collecting the questions and ideas you want to come back to."}
        </p>

        <button
          className="mt-5 flex h-11 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-lg border border-border bg-surface-dim text-sm font-medium text-muted opacity-75"
          type="button"
          disabled
          aria-label="Continue with Google (unavailable)"
        >
          <span aria-hidden="true" className="font-bold text-[#4285f4]">
            G
          </span>
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3 text-[10px] font-medium text-muted">
          <span className="h-px flex-1 bg-border" />
          <span>or continue with email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div
          className="animate-auth-enter motion-reduce:animate-none"
          key={activeTab}
        >
          <ActiveForm />
        </div>
      </div>

      <p className="mt-5 text-center text-xs leading-5 text-muted">
        By continuing, you agree to our{" "}
        <a
          className="text-accent underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
          href="/terms.md"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          className="text-accent underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
          href="/privacy.md"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("login");

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (!loading && user) {
    return <Navigate to="/" />;
  }

  return (
    <main className="grid min-h-svh grid-cols-1 bg-canvas font-sans text-primary lg:grid-cols-2">
      <section
        className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-[image:var(--hero-gradient)] px-6 py-8 sm:px-10 lg:min-h-svh lg:px-12 xl:px-20"
        aria-labelledby="hero-title"
      >
        <CuriosityFlow />
        <div className="relative z-10 mx-auto flex min-h-[620px] w-full max-w-[560px] flex-col justify-between lg:min-h-[calc(100svh-6rem)]">
          <a
            className="flex w-fit items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            href="/"
            aria-label="Plexshity home"
          >
            <span className="brand-mark grid size-11 shrink-0 place-items-center rounded-xl">
              <img
                className="size-10 object-contain"
                src="/Plexshity-io.png"
                alt=""
              />
            </span>
            <span className="grid gap-0.5">
              <span className="text-base font-semibold tracking-tight text-primary">
                Plexshity<span className="text-accent">.io</span>
              </span>
              <span className="text-xs text-muted">
                A home for your curiosity
              </span>
            </span>
          </a>

          <div className="my-12">
            <p className="mb-4 text-sm font-medium text-accent">
              Start with a question.
            </p>
            <h1
              className="max-w-[550px] text-[clamp(2.75rem,5vw,4.25rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-primary"
              id="hero-title"
            >
              Connect what you learn.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted sm:text-base">
              Ask questions, explore new ideas, and save what you discover—so
              everything you learn can lead somewhere.
            </p>

            <ul className="mt-7 grid gap-3" aria-label="Plexshity features">
              {features.map((feature) => (
                <li
                  className="flex min-h-[68px] items-center gap-3.5 rounded-xl border border-border bg-card px-3 transition-colors duration-300 ease-out hover:border-accent/20 hover:bg-card-hover"
                  key={feature.title}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-lg ${
                      feature.tone === "tertiary"
                        ? "bg-tertiary-surface text-tertiary"
                        : "bg-icon-surface text-accent"
                    }`}
                  >
                    <FeatureIcon name={feature.icon} />
                  </span>
                  <span className="grid gap-1">
                    <span className="text-sm font-semibold tracking-tight text-primary">
                      {feature.title}
                    </span>
                    <span className="text-xs leading-5 text-muted">
                      {feature.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between gap-5 border-t border-border/70 pt-5">
            <p className="max-w-xs text-sm leading-6 text-muted">
              <span className="font-medium text-primary">
                Good questions rarely stop at one answer.
              </span>
              <br />
              Keep the next idea close by.
            </p>
          </div>
        </div>
      </section>

      <section className="grid min-h-[540px] place-items-center bg-surface px-6 py-10 sm:px-10 lg:min-h-svh lg:px-12">
        <div className="w-full max-w-[440px]">
          <AuthPanel activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </section>
    </main>
  );
}
