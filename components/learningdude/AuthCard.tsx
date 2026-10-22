
"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GOOGLE_AUTH_URL, submitAuth, type AuthMode } from "./auth-service";

type Values = { name: string; email: string; password: string; confirm: string; remember: boolean };
type Field = "name" | "email" | "password" | "confirm";
type Errors = Partial<Record<Field, string>>;
type Status = { kind: "info" | "error" | "success"; text: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY: Values = { name: "", email: "", password: "", confirm: "", remember: false };

function validate(mode: AuthMode, v: Values): Errors {
  const e: Errors = {};
  if (mode === "signup" && v.name.trim().length < 2) e.name = "Enter your full name.";
  if (!v.email.trim()) e.email = "Email is required.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!v.password) e.password = "Password is required.";
  else if (mode === "signup" && v.password.length < 8) e.password = "Use at least 8 characters.";
  if (mode === "signup") {
    if (!v.confirm) e.confirm = "Confirm your password.";
    else if (v.confirm !== v.password) e.confirm = "Passwords do not match.";
  }
  return e;
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.1C6.22 6.88 8.87 4.77 12 4.77z" />
    </svg>
  );
}

type InputProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
  password?: boolean;
};

function TextField({ id, label, type = "text", value, onChange, onBlur, error, autoComplete, placeholder, disabled, password }: InputProps) {
  const [show, setShow] = useState(false);
  const errId = `${id}-err`;
  return (
    <div className="ld-field">
      <label htmlFor={id}>{label}</label>
      <div className="ld-input-wrap">
        <input
          id={id}
          name={id}
          className={`ld-input${password ? " ld-input--pw" : ""}`}
          type={password ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
        />
        {password && (
          <button type="button" className="ld-eye-btn" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
            <EyeIcon off={show} />
          </button>
        )}
      </div>
      {error && <p id={errId} className="ld-err">{error}</p>}
    </div>
  );
}

export default function AuthCard() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const errors = useMemo(() => validate(mode, values), [mode, values]);
  const visible = (f: Field) => (touched[f] || attempted ? errors[f] : undefined);
  const set = <K extends keyof Values>(k: K, v: Values[K]) => setValues((p) => ({ ...p, [k]: v }));
  const blur = (f: Field) => () => setTouched((t) => ({ ...t, [f]: true }));

  function switchMode(next: AuthMode) {
    if (next === mode) return;
    setMode(next);
    setTouched({});
    setAttempted(false);
    setStatus(null);
    setValues((p) => ({ ...EMPTY, email: p.email }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setAttempted(true);
    setStatus(null);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const payload: Record<string, string | boolean> =
      mode === "login"
        ? { email: values.email.trim(), password: values.password, remember: values.remember }
        : { name: values.name.trim(), email: values.email.trim(), password: values.password };

    try {
      const result = await submitAuth(mode, payload);
      if (result.ok) {
        setStatus({ kind: "success", text: result.message });
        if (mode === "login") {
          router.push("/dashboard");
          router.refresh();
        } else if (result.message.includes("check your email")) {
          setMode("login");
          setValues({ ...EMPTY, email: values.email.trim() });
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        setStatus({ kind: result.reason === "not-configured" ? "info" : "error", text: result.message });
      }
    } catch {
      setStatus({ kind: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    if (GOOGLE_AUTH_URL) {
      window.location.assign(GOOGLE_AUTH_URL);
      return;
    }
    setStatus({
      kind: "info",
      text: "Google sign-in is not configured yet. Configure Google as a provider in Supabase to enable it.",
    });
  }

  const isLogin = mode === "login";

  return (
    <div className="ld-card">
      <div className="ld-tabs" role="tablist" aria-label="Authentication">
        {(["login", "signup"] as const).map((m) => (
          <button key={m} id={`tab-${m}`} type="button" role="tab" className="ld-tab" aria-selected={mode === m} aria-controls="auth-panel" onClick={() => switchMode(m)}>
            {m === "login" ? "Login" : "Sign Up"}
          </button>
        ))}
      </div>
      <form id="auth-panel" className="ld-form" role="tabpanel" aria-labelledby={`tab-${mode}`} noValidate onSubmit={onSubmit}>
        <div>
          <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="ld-sub">{isLogin ? "Sign in to continue your career journey." : "Start building your tech career path."}</p>
        </div>
        {!isLogin && <TextField id="name" label="Full name" value={values.name} onChange={(v) => set("name", v)} onBlur={blur("name")} error={visible("name")} autoComplete="name" placeholder="Your full name" disabled={loading} />}
        <TextField id="email" label="Email address" type="email" value={values.email} onChange={(v) => set("email", v)} onBlur={blur("email")} error={visible("email")} autoComplete="email" placeholder="you@example.com" disabled={loading} />
        <TextField id="password" label="Password" password value={values.password} onChange={(v) => set("password", v)} onBlur={blur("password")} error={visible("password")} autoComplete={isLogin ? "current-password" : "new-password"} placeholder={isLogin ? "Enter your password" : "At least 8 characters"} disabled={loading} />
        {!isLogin && <TextField id="confirm" label="Confirm password" password value={values.confirm} onChange={(v) => set("confirm", v)} onBlur={blur("confirm")} error={visible("confirm")} autoComplete="new-password" placeholder="Re-enter your password" disabled={loading} />}
        {isLogin && (
          <div className="ld-row">
            <label className="ld-check">
              <input type="checkbox" checked={values.remember} onChange={(e) => set("remember", e.target.checked)} disabled={loading} />
              Remember me
            </label>
            <button type="button" className="ld-link" onClick={() => setStatus({ kind: "info", text: "Password reset isn't connected yet." })}>
              Forgot password?
            </button>
          </div>
        )}
        {status && <div className={`ld-alert ld-alert--${status.kind}`} role={status.kind === "error" ? "alert" : "status"}>{status.text}</div>}
        <button type="submit" className="ld-btn ld-btn--primary" disabled={loading} aria-busy={loading}>
          {loading && <span className="ld-spinner" aria-hidden="true" />}
          {loading ? (isLogin ? "Signing in…" : "Creating account…") : isLogin ? "Sign In" : "Create Account"}
        </button>
        {isLogin && (
          <>
            <div className="ld-divider" role="separator" aria-label="or">OR</div>
            <button type="button" className="ld-btn ld-btn--ghost" onClick={onGoogle} disabled={loading}>
              <GoogleIcon />
              Continue with Google
              {!GOOGLE_AUTH_URL && <span className="ld-tag">Setup needed</span>}
            </button>
          </>
        )}
        <p className="ld-switch">
          {isLogin ? "New to LearningDude AI? " : "Already have an account? "}
          <button type="button" className="ld-link" onClick={() => switchMode(isLogin ? "signup" : "login")}>
            {isLogin ? "Create an account" : "Back to Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
