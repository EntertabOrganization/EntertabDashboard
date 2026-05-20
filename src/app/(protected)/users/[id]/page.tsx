"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useClientAuthToken } from "@/hooks/useClientAuthToken";
import { deleteUser, fetchUser } from "@/lib/api/entertab";
import type { User } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function UserByIdPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const token = useClientAuthToken();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const load = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    setError(null);
    try {
      setUser(await fetchUser(token, id));
    } catch (e) {
      setError(getErrorMessage(e));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete() {
    if (!token || !id) return;
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await deleteUser(token, id);
      router.push("/users");
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

  const danger: CSSProperties = {
    ...btn,
    color: "#b91c1c",
    borderColor: "rgba(185, 28, 28, 0.18)"
  };

  const primary: CSSProperties = {
    ...btn,
    borderColor: "rgba(31,122,85,0.25)",
    color: "var(--primary)"
  };

  return (
    <Card title="User detail">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <Link href="/users" style={{ ...btn, textDecoration: "none", color: "var(--text)" }}>
          Back to list
        </Link>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href={`/users/${id}/edit`} style={{ ...primary, textDecoration: "none" }}>
            <Pencil size={18} /> Edit
          </Link>
          <button type="button" style={danger} onClick={handleDelete}>
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      {loading ? <p style={{ color: "var(--muted)" }}>Loading…</p> : null}
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}

      {!loading && user ? (
        <dl style={{ margin: 0, display: "grid", gap: 10, maxWidth: 720 }}>
          <Field label="Name" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Role" value={user.role} />
          <Field label="Created" value={formatMaybeDate(user.createdAt)} />
          <Field label="Updated" value={formatMaybeDate(user.updatedAt)} />
          <Field label="ID" value={<code style={{ fontSize: 12 }}>{user._id}</code>} />
        </dl>
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
