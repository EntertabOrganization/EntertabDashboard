import Link from "next/link";
import type { CSSProperties } from "react";
import { Eye, Trash2 } from "lucide-react";

export type ResourceTableRow = {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
};

const actionBtn: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.8)",
  padding: "6px 10px",
  cursor: "pointer",
  color: "var(--text)",
  fontSize: 13
};

const dangerBtn: CSSProperties = {
  ...actionBtn,
  color: "#b91c1c",
  borderColor: "rgba(185, 28, 28, 0.18)"
};

const linkBtn: CSSProperties = {
  ...actionBtn,
  borderColor: "rgba(31,122,85,0.25)",
  color: "var(--primary)",
  textDecoration: "none"
};

export function ResourceTable({
  rows,
  basePath,
  onDeleteRow,
  emptyText = "No records yet."
}: {
  rows: ResourceTableRow[];
  basePath: string;
  onDeleteRow?: (id: string) => void | Promise<void>;
  emptyText?: string;
}) {
  if (rows.length === 0) {
    return <p style={{ color: "var(--muted)" }}>{emptyText}</p>;
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", paddingBottom: 10, fontSize: 12, letterSpacing: 0.02, color: "var(--muted)" }}>ID</th>
            <th style={{ textAlign: "left", paddingBottom: 10, fontSize: 12, letterSpacing: 0.02, color: "var(--muted)" }}>Name</th>
            <th style={{ textAlign: "left", paddingBottom: 10, fontSize: 12, letterSpacing: 0.02, color: "var(--muted)" }}>Details</th>
            <th style={{ textAlign: "left", paddingBottom: 10, fontSize: 12, letterSpacing: 0.02, color: "var(--muted)" }}>Status</th>
            <th style={{ textAlign: "right", paddingBottom: 10, fontSize: 12, letterSpacing: 0.02, color: "var(--muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} style={{ borderTop: "1px solid var(--border)" }}>
              <td style={{ padding: "11px 0", fontVariantNumeric: "tabular-nums" }}>
                <code style={{ fontSize: 12, color: "var(--muted)" }}>{shortId(row.id)}</code>
              </td>
              <td style={{ fontWeight: 600 }}>{row.title}</td>
              <td style={{ color: "var(--muted)", maxWidth: 360 }}>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.subtitle ?? "—"}</div>
              </td>
              <td style={{ color: "var(--muted)" }}>{row.status ?? "—"}</td>
              <td style={{ padding: "10px 0", textAlign: "right" }}>
                <div style={{ display: "inline-flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <Link href={`${basePath}/${row.id}`} style={linkBtn} title="View details">
                    <Eye size={16} /> View
                  </Link>
                  {onDeleteRow ? (
                    <button
                      type="button"
                      style={dangerBtn}
                      onClick={() => onDeleteRow(row.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function shortId(id: string) {
  if (id.length <= 10) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}
