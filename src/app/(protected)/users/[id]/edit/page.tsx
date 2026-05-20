"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";
import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { useClientAuthToken } from "@/hooks/useClientAuthToken";
import { fetchUser, updateUser } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const token = useClientAuthToken();
  const id = params.id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    setError(null);
    try {
      const u = await fetchUser(token, id);
      setName(u.name);
      setEmail(u.email);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !id) return;
    setSaving(true);
    setError(null);
    try {
      await updateUser(token, id, { name, email });
      router.push(`/users/${id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const ghostBtn: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    cursor: "pointer",
    background: "rgba(255,255,255,0.85)",
    fontWeight: 650,
    textDecoration: "none",
    color: "var(--text)"
  };

  return (
    <Card title="Edit user">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <Link href={`/users/${id}`} style={ghostBtn}>
          Cancel
        </Link>
      </div>

      {loading ? <p style={{ color: "var(--muted)" }}>Loading…</p> : null}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <div>
          <label style={{ fontSize: 13, color: "var(--muted)" }}>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading || saving}
            style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, color: "var(--muted)" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || saving}
            style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </div>

        {error ? <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p> : null}

        <button
          type="submit"
          disabled={loading || saving || !token}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 12,
            borderRadius: 12,
            border: "none",
            background: "var(--primary)",
            color: "#fff",
            fontWeight: 800,
            cursor: saving ? "progress" : "pointer"
          }}
        >
          <Save size={18} />
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </Card>
  );
}
