"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { ExternalLink, FileText, Save, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useClientAuthToken } from "@/hooks/useClientAuthToken";
import { getPublicBase } from "@/lib/api/client";
import type { JourneyApplication } from "@/lib/api/entertab";
import { deleteJourney, fetchJourney, updateJourney } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function JourneyByIdPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const token = useClientAuthToken();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<JourneyApplication | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [positionOrSpecialisation, setPositionOrSpecialisation] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [typeOfEmployment, setTypeOfEmployment] = useState("");
  const [message, setMessage] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    setError(null);
    try {
      const row = await fetchJourney(token, id);
      setData(row);
      setName(row.name);
      setEmail(row.email);
      setPositionOrSpecialisation(row.positionOrSpecialisation);
      setYearsOfExperience(row.yearsOfExperience);
      setTypeOfEmployment(row.typeOfEmployment);
      setMessage(row.message);
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
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("positionOrSpecialisation", positionOrSpecialisation);
      form.append("yearsOfExperience", String(yearsOfExperience));
      form.append("typeOfEmployment", typeOfEmployment);
      form.append("message", message);
      if (cvFile) form.append("cvUpload", cvFile);

      const res = await updateJourney(token, id, form);
      setData(res.data);
      setCvFile(null);
    } catch (err) {
      window.alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!token || !id) return;
    if (!window.confirm("Delete this career application?")) return;
    try {
      await deleteJourney(token, id);
      router.push("/journeys");
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

  const cvHref = data?.cvUpload ? buildAssetUrl(data.cvUpload) : null;

  return (
    <Card title="Career application">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <Link href="/journeys" style={{ ...btn, textDecoration: "none", color: "var(--text)" }}>
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
            <Field label="Position / specialisation" value={data.positionOrSpecialisation} />
            <Field label="Years of experience" value={String(data.yearsOfExperience)} />
            <Field label="Employment type" value={data.typeOfEmployment} />
            <Field label="Message" value={<div style={{ whiteSpace: "pre-wrap" }}>{data.message}</div>} />
            <Field
              label="CV"
              value={
                cvHref ? (
                  <a href={cvHref} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--primary)", fontWeight: 800 }}>
                    <FileText size={18} /> Open CV <ExternalLink size={16} style={{ opacity: 0.7 }} />
                  </a>
                ) : (
                  "—"
                )
              }
            />
            <Field label="Created" value={formatMaybeDate(data.createdAt)} />
            <Field label="ID" value={<code style={{ fontSize: 12 }}>{data._id}</code>} />
          </dl>

          <form onSubmit={handleSave} style={{ display: "grid", gap: 12, padding: 14, borderRadius: 14, border: "1px solid var(--border)", background: "rgba(255,255,255,0.75)" }}>
            <div style={{ fontSize: 13, fontWeight: 750 }}>Update application (multipart)</div>

            <div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Name</div>
              <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Email</div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Position / specialisation</div>
              <input value={positionOrSpecialisation} onChange={(e) => setPositionOrSpecialisation(e.target.value)} required style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Years of experience</div>
              <input
                type="number"
                min={0}
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                required
                style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)" }}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Employment type</div>
              <input value={typeOfEmployment} onChange={(e) => setTypeOfEmployment(e.target.value)} required style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Message</div>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)", resize: "vertical" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Optional new CV (.pdf)</div>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files?.[0] ?? null)} style={{ marginTop: 6 }} />
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

function buildAssetUrl(cvUpload: string) {
  if (cvUpload.startsWith("http")) return cvUpload;
  const base = getPublicBase();
  const path = cvUpload.startsWith("/") ? cvUpload : `/${cvUpload}`;
  return `${base}${path}`;
}
