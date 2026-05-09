import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type Status = Database["public"]["Enums"]["lead_status"];

export const Route = createFileRoute("/crm")({
  component: CrmPage,
  head: () => ({
    meta: [
      { title: "Mini CRM — Client Lead Management" },
      { name: "description", content: "Manage your client leads: track status, value, and notes in one dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const STATUSES: Status[] = ["new", "contacted", "qualified", "won", "lost"];

const statusStyles: Record<Status, string> = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  contacted: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  qualified: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  won: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  lost: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(120).optional(),
  source: z.string().trim().max(80).optional(),
  status: z.enum(["new", "contacted", "qualified", "won", "lost"]),
  value: z.coerce.number().min(0).max(999999999).optional(),
  notes: z.string().trim().max(2000).optional(),
});

const emptyForm = {
  name: "", email: "", phone: "", company: "", source: "",
  status: "new" as Status, value: "" as string | number, notes: "",
};

function CrmPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUserId(session?.user?.id ?? null);
      if (!session) navigate({ to: "/auth" });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
      } else {
        setUserId(data.session.user.id);
      }
      setAuthChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const loadLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Could not load leads");
      return;
    }
    setLeads(data ?? []);
  };

  useEffect(() => {
    if (userId) loadLeads();
  }, [userId]);

  const stats = useMemo(() => {
    const total = leads.length;
    const won = leads.filter((l) => l.status === "won");
    const pipeline = leads
      .filter((l) => l.status !== "lost" && l.status !== "won")
      .reduce((s, l) => s + Number(l.value ?? 0), 0);
    const wonValue = won.reduce((s, l) => s + Number(l.value ?? 0), 0);
    return { total, won: won.length, pipeline, wonValue };
  }, [leads]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          l.name.toLowerCase().includes(q) ||
          (l.email ?? "").toLowerCase().includes(q) ||
          (l.company ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, filter, search]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (lead: Lead) => {
    setEditing(lead);
    setForm({
      name: lead.name,
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      company: lead.company ?? "",
      source: lead.source ?? "",
      status: lead.status,
      value: lead.value ?? "",
      notes: lead.notes ?? "",
    });
    setShowForm(true);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    const parsed = leadSchema.safeParse({
      ...form,
      value: form.value === "" ? undefined : form.value,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setSaving(true);
    const payload = {
      user_id: userId,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      source: parsed.data.source || null,
      status: parsed.data.status,
      value: parsed.data.value ?? 0,
      notes: parsed.data.notes || null,
    };
    const { error } = editing
      ? await supabase.from("leads").update(payload).eq("id", editing.id)
      : await supabase.from("leads").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Save failed");
      return;
    }
    toast.success(editing ? "Lead updated" : "Lead added");
    setShowForm(false);
    loadLeads();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Lead deleted");
    loadLeads();
  };

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-lg tracking-tight">
              Abrham<span className="text-primary">.</span>
            </Link>
            <span className="text-sm text-muted-foreground hidden sm:inline">Mini CRM</span>
          </div>
          <button onClick={onSignOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Dashboard</p>
            <h1 className="font-display text-4xl">Client Leads</h1>
          </div>
          <button
            onClick={openNew}
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            + Add lead
          </button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total leads" value={stats.total.toString()} />
          <StatCard label="Won" value={stats.won.toString()} />
          <StatCard label="Pipeline value" value={`$${stats.pipeline.toLocaleString()}`} />
          <StatCard label="Won value" value={`$${stats.wonValue.toLocaleString()}`} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            type="text" placeholder="Search name, email, company…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg bg-card border border-border focus:outline-none focus:border-primary text-sm"
          />
          <div className="flex gap-1 flex-wrap">
            {(["all", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs capitalize border transition-colors ${
                  filter === s
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading leads…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground mb-4">No leads {search || filter !== "all" ? "match your filters" : "yet"}.</p>
            {!search && filter === "all" && (
              <button onClick={openNew} className="text-primary hover:underline text-sm">Add your first lead →</button>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((l) => (
              <article key={l.id} className="p-5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-medium text-lg">{l.name}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border capitalize ${statusStyles[l.status]}`}>
                        {l.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      {l.company && <span>{l.company}</span>}
                      {l.email && <a href={`mailto:${l.email}`} className="hover:text-foreground">{l.email}</a>}
                      {l.phone && <span>{l.phone}</span>}
                      {l.source && <span className="text-xs">via {l.source}</span>}
                    </div>
                    {l.notes && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{l.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    {Number(l.value) > 0 && (
                      <span className="font-display text-lg">${Number(l.value).toLocaleString()}</span>
                    )}
                    <button onClick={() => openEdit(l)} className="text-sm text-muted-foreground hover:text-foreground">Edit</button>
                    <button onClick={() => onDelete(l.id)} className="text-sm text-muted-foreground hover:text-rose-500">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">{editing ? "Edit lead" : "New lead"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={onSave} className="space-y-4">
              <Field label="Name *">
                <input required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email">
                  <input type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Phone">
                  <input maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Company">
                  <input maxLength={120} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Source">
                  <input maxLength={80} placeholder="e.g. Referral" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className={inputCls} />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Status">
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className={inputCls}>
                    {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </Field>
                <Field label="Deal value ($)">
                  <input type="number" min="0" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={inputCls} />
                </Field>
              </div>
              <Field label="Notes">
                <textarea rows={3} maxLength={2000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputCls} resize-none`} />
              </Field>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60">
                  {saving ? "Saving…" : editing ? "Save changes" : "Add lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toaster position="top-center" richColors />
    </main>
  );
}

const inputCls = "w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</p>
      <p className="font-display text-2xl">{value}</p>
    </div>
  );
}
