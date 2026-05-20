"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useClientAuthToken } from "@/hooks/useClientAuthToken";
import type { ProjectInquiryItem } from "@/lib/api/entertab";
import { PROJECT_SERVICES, deleteProjectInquiry, fetchProjectInquiry, updateProjectInquiry } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function ProjectByIdPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const token = useClientAuthToken();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProjectInquiryItem | null>(null);

  const [editName, setEditName] = useState("");
  const [editService, setEditService] = useState<string>(PROJECT_SERVICES[0]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    setError(null);
    try {
      const row = await fetchProjectInquiry(token, id);
      setData(row);
      setEditName(row.name);
      setEditService(row.requiredService);
    } catch (e) {
      setError(getErrorMessage(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !id) return;
    setSaving(true);
    try {
      const res = await updateProjectInquiry(token, id, { name: editName, requiredService: editService });
      setData(res.data);
      setEditName(res.data.name);
      setEditService(res.data.requiredService);
    } catch (err) {
      window.alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!token || !id) return;
    if (!window.confirm("Delete this project inquiry?")) return;
    try {
      await deleteProjectInquiry(token, id);
      router.push("/projects");
    } catch (e) {
      window.alert(getErrorMessage(e));
    }
  }

  const btn: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    cursor: "pointer",
    background: "rgba(255,255,255,0.85)",
    fontWeight: 650
  };

  return (
    <Card title="Project inquiry">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <Link href="/projects" style={{ ...btn, textDecoration: "none", color: "var(--text)" }}>
          Back
        </Link>
        <button type="button" style={{ ...btn, color: "#b91c1c", borderColor: "rgba(185, 28, 28, 0.18)" }} onClick={handleDelete}>
          <Trash2 size={18} /> Delete
        </button>
      </div>

      {loading ? <p style={{ color: "var(--muted)" }}>Loading…</p> : null}
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}

      {data ? (
        <>
          <dl style={{ margin: "0 0 16px", display: "grid", gap: 10, maxWidth: 900 }}>
            <Field label="Name" value={data.name} />
            <Field label="Email" value={data.email} />
            <Field label="Required service" value={data.requiredService} />
            <Field label="Message" value={<div style={{ whiteSpace: "pre-wrap" }}>{data.message}</div>} />
            <Field label="Created" value={formatMaybeDate(data.createdAt)} />
            <Field label="ID" value={<code style={{ fontSize: 12 }}>{data._id}</code>} />
          </dl>

          <form onSubmit={handleSave} style={{ display: "grid", gap: 12, padding: 14, borderRadius: 14, border: "1px solid var(--border)", background: "rgba(255,255,255,0.75)" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Update name</div>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} required style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Required service</div>
              <select value={editService} onChange={(e) => setEditService(e.target.value)} style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)", background: "white" }}>
                {PROJECT_SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={saving || !token}
              style={{ ...btn, border: "none", background: "var(--primary)", color: "#fff", fontWeight: 900, justifyContent: "center" }}
            >
              <Save size={18} />
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </>
      ) : null}
    </Card>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 12, background: "rgba(255,255,255,0.75)" }}>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>{label}</div>
      <div style={{ fontWeight: 650, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function formatMaybeDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}
