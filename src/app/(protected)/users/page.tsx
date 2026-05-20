"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ResourceTable } from "@/components/ui/Table";
import { useClientAuthToken } from "@/hooks/useClientAuthToken";
import { deleteUser, fetchUsers } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function UsersPage() {
  const token = useClientAuthToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Awaited<ReturnType<typeof fetchUsers>>>([]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchUsers(token));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo(
    () =>
      items.map((u) => ({
        id: u._id,
        title: u.name,
        subtitle: u.email,
        status: u.role
      })),
    [items]
  );

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await deleteUser(token, id);
      await load();
    } catch (e) {
      window.alert(getErrorMessage(e));
    }
  }

  return (
    <Card title="Users">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, marginBottom: 12, alignItems: "flex-start" }}>
        <p style={{ margin: 0, color: "var(--muted)" }}>Administrators from your Entertab backend ({items.length})</p>
        <Link
          href="/users/create"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid rgba(31,122,85,0.25)",
            color: "var(--primary)",
            borderRadius: 12,
            padding: "8px 12px",
            fontWeight: 650,
            textDecoration: "none",
            background: "rgba(255,255,255,0.75)"
          }}
        >
          <UserPlus size={18} strokeWidth={1.75} />
          Create
        </Link>
      </div>

      {error ? <p style={{ color: "#b91c1c", marginTop: 0 }}>{error}</p> : null}
      {loading ? <p style={{ color: "var(--muted)" }}>Loading…</p> : <ResourceTable rows={rows} basePath="/users" onDeleteRow={handleDelete} />}
    </Card>
  );
}
