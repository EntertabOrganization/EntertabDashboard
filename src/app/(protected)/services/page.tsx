"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ResourceTable } from "@/components/ui/Table";
import { useClientAuthToken } from "@/hooks/useClientAuthToken";
import { deleteServiceRequest, fetchServiceRequests } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function ServicesPage() {
  const token = useClientAuthToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Awaited<ReturnType<typeof fetchServiceRequests>>>([]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchServiceRequests(token));
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
      items.map((s) => ({
        id: s._id,
        title: s.name,
        subtitle: `${s.email} · ${s.serviceType}`,
        status: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"
      })),
    [items]
  );

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm("Delete this service request?")) return;
    try {
      await deleteServiceRequest(token, id);
      await load();
    } catch (e) {
      window.alert(getErrorMessage(e));
    }
  }

  return (
    <Card title="Services">
      <p style={{ marginTop: 0, color: "var(--muted)" }}>Inbound service requests ({items.length})</p>
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {loading ? <p style={{ color: "var(--muted)" }}>Loading…</p> : <ResourceTable rows={rows} basePath="/services" onDeleteRow={handleDelete} />}
    </Card>
  );
}
