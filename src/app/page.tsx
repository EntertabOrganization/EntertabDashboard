"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Leaf, Sparkles, ArrowRight } from "lucide-react";
import { setSessionToken } from "@/lib/auth/session";
import { getPublicBase } from "@/lib/api/client";
import { loginAdmin } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";
import styles from "./page.module.css";

export default function LoginPage() {
  // Prefill the email and password by default to match Swagger Try It Out / Demo Credentials
  const [email, setEmail] = useState("admin@entertab.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const apiBase = getPublicBase();
  const isApiConfigured = !!apiBase;

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

  // Quick autofill function for the demo section
  function handleAutofill() {
    setEmail("admin@entertab.com");
    setPassword("admin123");
    setError("");
  }

  return (
    <div className={styles.container}>
      {/* Ambient background glows */}
      <div className={styles.glowBlob1} aria-hidden="true" />
      <div className={styles.glowBlob2} aria-hidden="true" />

      {/* Glassmorphic card */}
      <main className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoWrapper} aria-hidden="true">
            <Leaf size={24} strokeWidth={2} />
          </div>
          <h1 className={styles.title}>Entertab Admin</h1>
          <p className={styles.subtitle}>
            Sign in to manage service requests, inquiries, and career applications
          </p>
          
          <div className={styles.apiStatus}>
            <span className={`${styles.statusDot} ${!isApiConfigured ? styles.statusDotError : ""}`} />
            <span>API: {apiBase ? apiBase : "Not Configured"}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Error Banner */}
          {error && (
            <div className={styles.errorAlert} role="alert">
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>{error}</div>
            </div>
          )}

          {/* Email input field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="email-input" className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@entertab.com"
                className={styles.inputField}
                disabled={loading}
              />
              <span className={styles.inputIcon}>
                <Mail size={18} strokeWidth={2} />
              </span>
            </div>
          </div>

          {/* Password input field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="password-input" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={styles.inputField}
                disabled={loading}
              />
              <span className={styles.inputIcon}>
                <Lock size={18} strokeWidth={2} />
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Demo Access Helper Panel */}
          <div className={styles.demoSection}>
            <div className={styles.demoHeader}>
              <div className={styles.demoTitle}>
                <Sparkles size={13} />
                <span>Demo Access</span>
              </div>
              <button
                type="button"
                className={styles.autofillButton}
                onClick={handleAutofill}
                title="Autofill credentials"
              >
                Autofill
              </button>
            </div>
            <ul className={styles.demoInfo}>
              <li className={styles.demoInfoItem}>
                <span>Email:</span>
                <span className={styles.demoValue}>admin@entertab.com</span>
              </li>
              <li className={styles.demoInfoItem}>
                <span>Password:</span>
                <span className={styles.demoValue}>admin123</span>
              </li>
            </ul>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                <span>Securing connection...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} className={styles.btnArrow} />
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
