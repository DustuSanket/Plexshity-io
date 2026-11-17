import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-border bg-surface-dim px-3.5 py-3 text-sm text-primary outline-none transition-all duration-200 ease-out placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/20";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const { loginHandler } = useAuth();
  const navigate = useNavigate();

  const payload = {
    email,
    password,
  };

  async function submitHandler(e) {
    e.preventDefault();

    setSubmitMessage("");
    const result = await loginHandler(payload);

    if (result.success) {
      navigate("/");
      return;
    }

    if (
      result.status === 401 ||
      /verify your email/i.test(result.message)
    ) {
      navigate("/verify-email", {
        state: { email, reason: "login" },
      });
      return;
    }

    setSubmitMessage(result.message);
  }

  return (
    <form className="grid gap-3.5" onSubmit={submitHandler}>
      <label
        className="block text-xs font-medium text-primary"
        htmlFor="login-email"
      >
        Email address
        <input
          autoComplete="email"
          className={inputClassName}
          id="login-email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setSubmitMessage("");
          }}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </label>

      <label
        className="block text-xs font-medium text-primary"
        htmlFor="login-password"
      >
        Password
        <input
          autoComplete="current-password"
          className={inputClassName}
          id="login-password"
          name="password"
          onChange={(e) => {
            setPassword(e.target.value);
            setSubmitMessage("");
          }}
          placeholder="Enter your password"
          required
          type="password"
          value={password}
        />
      </label>

      <button
        className="mt-1 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition duration-200 ease-out hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        type="submit"
      >
        Continue
        <span aria-hidden="true">→</span>
      </button>

      <p className="min-h-5 text-xs leading-5 text-accent" role="status">
        {submitMessage}
      </p>
    </form>
  );
}
