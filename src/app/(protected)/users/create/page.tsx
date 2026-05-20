"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useClientAuthToken } from "@/hooks/useClientAuthToken";
import { createUser } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function CreateUserPage() {
  const router = useRouter();
  const token = useClientAuthToken();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      await createUser(token, {
        name,
        email,
        password,
        role: "admin"
      });
      router.push("/users");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Create user">
      {!token ? <p style={{ color: "var(--muted)" }}>Initializing session…</p> : null}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <div>
          <label style={{ fontSize: 13, color: "var(--muted)" }}>Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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
            style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, color: "var(--muted)" }}>Temporary password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            style={{ width: "100%", marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </div>

        {error ? <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p> : null}

        <button
          type="submit"
          disabled={loading || !token}
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            padding: 12,
            borderRadius: 12,
            border: "none",
            background: "var(--primary)",
            color: "#fff",
            fontWeight: 700,
            cursor: loading ? "progress" : "pointer"
          }}
        >
          <Save size={18} />
          {loading ? "Saving…" : "Create user"}
        </button>
      </form>
    </Card>
  );
}
