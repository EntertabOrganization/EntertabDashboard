"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ResourceTable } from "@/components/ui/Table";
import { useClientAuthToken } from "@/hooks/useClientAuthToken";
import { deleteProjectInquiry, fetchProjectInquiries } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function ProjectsPage() {
  const token = useClientAuthToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Awaited<ReturnType<typeof fetchProjectInquiries>>>([]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchProjectInquiries(token));
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
      items.map((p) => ({
        id: p._id,
        title: p.name,
        subtitle: `${p.email} · ${p.requiredService}`,
        status: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"
      })),
    [items]
  );

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm("Delete this project inquiry?")) return;
    try {
      await deleteProjectInquiry(token, id);
      await load();
    } catch (e) {
      window.alert(getErrorMessage(e));
    }
  }

  return (
    <Card title="Projects">
      <p style={{ marginTop: 0, color: "var(--muted)" }}>Project inquiries ({items.length})</p>
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {loading ? <p style={{ color: "var(--muted)" }}>Loading…</p> : <ResourceTable rows={rows} basePath="/projects" onDeleteRow={handleDelete} />}
    </Card>
  );
}
