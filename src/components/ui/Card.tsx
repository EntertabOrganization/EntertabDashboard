import { ReactNode } from "react";

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        padding: 18
      }}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>{title}</h3>
      {children}
    </section>
  );
}
