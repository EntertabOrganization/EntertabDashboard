"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ResourceTable } from "@/components/ui/Table";
import { useClientAuthToken } from "@/hooks/useClientAuthToken";
import { deleteContactMessage, fetchContactMessages } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function ContactUsPage() {
  const token = useClientAuthToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Awaited<ReturnType<typeof fetchContactMessages>>>([]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchContactMessages(token));
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
      items.map((m) => ({
        id: m._id,
        title: m.name,
        subtitle: `${m.email} · ${m.phoneNumber}`,
        status: m.status ?? "pending"
      })),
    [items]
  );

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm("Delete this contact message?")) return;
    try {
      await deleteContactMessage(token, id);
      await load();
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
    textDecoration: "none",
    background: "rgba(255,255,255,0.85)",
    color: "var(--text)",
    fontWeight: 650
  };

  return (
    <Card title="Contact us">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
        <p style={{ margin: 0, color: "var(--muted)" }}>Public contact submissions ({items.length})</p>
        <Link href="/dashboard" style={btn}>
          <ArrowLeft size={18} /> Dashboard
        </Link>
      </div>

      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {loading ? <p style={{ color: "var(--muted)" }}>Loading…</p> : <ResourceTable rows={rows} basePath="/contact-us" onDeleteRow={handleDelete} />}
    </Card>
  );
}
