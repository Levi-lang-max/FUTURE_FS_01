import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Please enter a message").max(2000),
});

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(result.data);
    setLoading(false);
    if (error) {
      toast.error("Could not send your message. Please try again.");
      return;
    }
    toast.success("Thanks! Your message has been sent.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-28 px-6 border-t border-border/60">
      <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Contact
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-6">
            Let's build something together.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Have a project, opportunity, or just want to say hello? Drop a
            message — I'll get back to you soon.
          </p>
          <a
            href="mailto:abresh45belay@gmail.com"
            className="inline-block font-display text-xl text-primary hover:underline underline-offset-4"
          >
            abresh45belay@gmail.com
          </a>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-7 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm mb-2">Name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary transition-colors"
              maxLength={100}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary transition-colors"
              maxLength={255}
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm mb-2">Message</label>
            <textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary transition-colors resize-none"
              maxLength={2000}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
