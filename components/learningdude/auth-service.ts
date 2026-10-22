
import { createClient } from "@/lib/superbase/client";

export type AuthMode = "login" | "signup";

export type AuthResult =
  | { ok: true; message: string }
  | {
      ok: false;
      reason: "not-configured" | "failed";
      message: string;
    };

export const GOOGLE_AUTH_URL: string | undefined = undefined;

export async function submitAuth(
  mode: AuthMode,
  payload: Record<string, string | boolean>,
): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const email =
      typeof payload.email === "string" ? payload.email.trim() : "";
    const password =
      typeof payload.password === "string" ? payload.password : "";

    if (!email || !password) {
      return {
        ok: false,
        reason: "failed",
        message: "Please enter your email and password.",
      };
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Supabase signup error:", error.message);
        return { ok: false, reason: "failed", message: error.message };
      }

      return {
        ok: true,
        message: data.session
          ? "Account created successfully. You are signed in."
          : "Account created! Please check your email to confirm your account.",
      };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase login error:", error.message);
      return { ok: false, reason: "failed", message: error.message };
    }

    return { ok: true, message: "Signed in successfully." };
  } catch (error) {
    console.error("Authentication error:", error);

    return {
      ok: false,
      reason: "failed",
      message:
        "Unable to connect to Supabase. Please check your project URL and publishable key.",
    };
  }
}
    