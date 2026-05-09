import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — Mini CRM" },
      { name: "description", content: "Sign in or create an account to manage leads in the Mini CRM." },
    ],
  }),
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
  displayName: z.string().trim().max(100).optional(),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ email: "", password: "", displayName: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/crm" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) navigate({ to: "/crm" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/crm`,
          data: { display_name: parsed.data.displayName || undefined },
        },
      });
      setLoading(false);
      if (error) {
        toast.error(error.message.includes("registered") ? "Email already registered. Try signing in." : error.message);
        return;
      }
      toast.success("Account created! Check your email to confirm, then sign in.");
      setMode("signin");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      setLoading(false);
      if (error) {
        toast.error(error.message.includes("Invalid") ? "Invalid email or password." : error.message);
        return;
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-background">
      <div className="w-full max-w-md">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to portfolio</Link>
        <div className="mt-6 p-8 rounded-2xl bg-card border border-border">
          <h1 className="font-display text-3xl mb-2">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
          <p className="text-sm text-muted-foreground mb-8">
            {mode === "signin" ? "Sign in to your CRM dashboard." : "Start managing your client leads."}
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm mb-2">Display name</label>
                <input
                  type="text" value={form.displayName} maxLength={100}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            )}
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email" value={form.email} required maxLength={255}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password" value={form.password} required minLength={6} maxLength={72}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground text-center">
            {mode === "signin" ? "No account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary hover:underline"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </main>
  );
}
