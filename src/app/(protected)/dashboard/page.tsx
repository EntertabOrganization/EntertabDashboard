"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Users, Mail, BriefcaseBusiness, FolderKanban, Route } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ChartPanel } from "@/components/ui/ChartPanel";
import { useClientAuthToken } from "@/hooks/useClientAuthToken";
import { fetchContactMessages, fetchJourneys, fetchProjectInquiries, fetchServiceRequests, fetchUsers } from "@/lib/api/entertab";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function DashboardPage() {
  const token = useClientAuthToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({ users: 0, contact: 0, services: 0, projects: 0, journeys: 0 });

  const quickLinks = useMemo(
    () => [
      { href: "/users", label: "Users", icon: Users },
      { href: "/contact-us", label: "Contact Us", icon: Mail },
      { href: "/services", label: "Services", icon: BriefcaseBusiness },
      { href: "/projects", label: "Projects", icon: FolderKanban },
      { href: "/journeys", label: "Journeys", icon: Route }
    ],
    []
  );

  useEffect(() => {
    if (!token) return;
    const authToken = token;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [users, contact, services, projects, journeys] = await Promise.all([
          fetchUsers(authToken),
          fetchContactMessages(authToken),
          fetchServiceRequests(authToken),
          fetchProjectInquiries(authToken),
          fetchJourneys(authToken)
        ]);

        if (cancelled) return;
        setCounts({
          users: users.length,
          contact: contact.length,
          services: services.length,
          projects: projects.length,
          journeys: journeys.length
        });
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {error ? (
        <div style={{ border: "1px solid rgba(185,28,28,0.25)", background: "rgba(185,28,28,0.05)", padding: 12, borderRadius: 12 }}>{error}</div>
      ) : null}

      <section
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
        }}
      >
        <Card title="Total users">{loading ? "…" : counts.users}</Card>
        <Card title="Contact messages">{loading ? "…" : counts.contact}</Card>
        <Card title="Service requests">{loading ? "…" : counts.services}</Card>
        <Card title="Project inquiries">{loading ? "…" : counts.projects}</Card>
        <Card title="Career applications">{loading ? "…" : counts.journeys}</Card>
      </section>

      <Card title="Monthly activity (sample)">
        <ChartPanel />
      </Card>

      <Card title="Quick actions">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--surface)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontWeight: 600
              }}
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
              <ArrowUpRight size={16} style={{ opacity: 0.55 }} />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
