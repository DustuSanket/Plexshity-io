import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-border bg-surface-dim px-3.5 py-3 text-sm text-primary outline-none transition-all duration-200 ease-out placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/20";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const { registerHandler } = useAuth();
  const navigate = useNavigate();

  const payload = {
    fullName,
    email,
    password,
  };

  async function submitHandler(e) {
    e.preventDefault();

    setSubmitMessage("");
    const result = await registerHandler(payload);

    if (!result.success) {
      setSubmitMessage(result.message);
      return;
    }

    navigate("/verify-email", {
      state: { email, reason: "registration" },
    });
  }

  return (
    <form className="grid gap-3.5" onSubmit={submitHandler}>
      <label
        className="block text-xs font-medium text-primary"
        htmlFor="register-full-name"
      >
        Full Name
        <input
          autoComplete="name"
          className={inputClassName}
          id="register-full-name"
          name="fullName"
          onChange={(event) => {
            setFullName(event.target.value);
            setSubmitMessage("");
          }}
          placeholder="Your full name"
          required
          type="text"
          value={fullName}
        />
      </label>

      <label
        className="block text-xs font-medium text-primary"
        htmlFor="register-email"
      >
        Email address
        <input
          autoComplete="email"
          className={inputClassName}
          id="register-email"
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
        htmlFor="register-password"
      >
        Create Password
        <input
          autoComplete="new-password"
          className={inputClassName}
          id="register-password"
          minLength={8}
          name="password"
          onChange={(e) => {
            setPassword(e.target.value);
            setSubmitMessage("");
          }}
          placeholder="At least 8 characters"
          required
          type="password"
          value={password}
        />
      </label>

      <button
        className="mt-1 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition duration-200 ease-out hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        type="submit"
      >
        Create account
        <span aria-hidden="true">→</span>
      </button>

      <p className="min-h-5 text-xs leading-5 text-accent" role="status">
        {submitMessage}
      </p>
    </form>
  );
}
