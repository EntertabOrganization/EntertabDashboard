"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ResourceTable } from "@/components/ui/Table";
import { useClientAuthToken } from "@/hooks/useClientAuthToken";
import { deleteJourney, fetchJourneys } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function JourneysPage() {
  const token = useClientAuthToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Awaited<ReturnType<typeof fetchJourneys>>>([]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchJourneys(token));
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
      items.map((j) => ({
        id: j._id,
        title: j.name,
        subtitle: `${j.positionOrSpecialisation} · ${j.typeOfEmployment}`,
        status: `${j.yearsOfExperience ?? 0} yrs`
      })),
    [items]
  );

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm("Delete this career application?")) return;
    try {
      await deleteJourney(token, id);
      await load();
    } catch (e) {
      window.alert(getErrorMessage(e));
    }
  }

  return (
    <Card title="Journeys">
      <p style={{ marginTop: 0, color: "var(--muted)" }}>Career applications ({items.length})</p>
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {loading ? <p style={{ color: "var(--muted)" }}>Loading…</p> : <ResourceTable rows={rows} basePath="/journeys" onDeleteRow={handleDelete} />}
    </Card>
  );
}
