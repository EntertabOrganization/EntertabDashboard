"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { setSessionToken } from "@/lib/auth/session";
import { getPublicBase } from "@/lib/api/client";
import { loginAdmin } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginAdmin(email, password);
      setSessionToken(res.token);
      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow)",
          padding: 24
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: "var(--primary-soft)",
              color: "var(--primary)"
            }}
          >
            <LogIn size={22} strokeWidth={1.75} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>Welcome back</h1>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>Sign in with your admin account</p>
          </div>
        </div>

        <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 0 }}>API: {getPublicBase() || "not configured"}</p>

        <label style={{ fontSize: 13, color: "var(--muted)" }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          autoComplete="email"
          style={{ width: "100%", margin: "6px 0 14px", padding: 12, borderRadius: 10, border: "1px solid var(--border)" }}
        />

        <label style={{ fontSize: 13, color: "var(--muted)" }}>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          autoComplete="current-password"
          style={{ width: "100%", margin: "6px 0 14px", padding: 12, borderRadius: 10, border: "1px solid var(--border)" }}
        />

        {error ? <p style={{ color: "#b91c1c", fontSize: 14 }}>{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            border: "none",
            background: "var(--primary)",
            color: "#fff",
            borderRadius: 10,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontWeight: 600
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
