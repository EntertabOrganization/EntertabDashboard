"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Leaf,
  LogOut,
  Mail,
  Menu,
  Route as RouteIcon,
  Users,
  X
} from "lucide-react";
import { clearSessionToken } from "@/lib/auth/session";
import styles from "./AppShell.module.css";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/contact-us", label: "Contact Us", icon: Mail },
  { href: "/services", label: "Services", icon: BriefcaseBusiness },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/journeys", label: "Journeys", icon: RouteIcon }
];

type AppShellProps = {
  title?: string;
  children: ReactNode;
};

export function AppShell({ title = "Admin Dashboard", children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("entertab_nav_collapsed");
      setCollapsed(saved === "true");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("entertab_nav_collapsed", collapsed ? "true" : "false");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 941px)");
    const handler = () => setMobileOpen(false);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarWidthPx = collapsed && !mobileOpen ? 76 : 266;

  const shellStyle = useMemo(
    () =>
      ({
        "--shell-sidebar-width": `${sidebarWidthPx}px`
      }) as CSSProperties,
    [sidebarWidthPx]
  );

  const showLabels = mobileOpen || !collapsed;

  return (
    <div className={styles.shell} style={shellStyle}>
      {mobileOpen ? (
        <button type="button" className={styles.backdrop} aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
      ) : null}

      <aside className={[styles.sidebar, mobileOpen ? styles.sidebarOpenMobile : ""].filter(Boolean).join(" ")}>
        <div className={styles.brandRow} style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div className={styles.brandBadge} aria-hidden>
              <Leaf size={22} strokeWidth={1.75} />
            </div>
            {showLabels ? (
              <div style={{ minWidth: 0 }}>
                <div className={styles.brandTitle}>Entertab</div>
                <div className={styles.brandMuted}>Admin dashboard</div>
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              className={[styles.desktopOnly, styles.logoutBtn].join(" ")}
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-pressed={collapsed}
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <button type="button" className={[styles.mobileOnly, styles.logoutBtn].join(" ")} onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className={styles.navArea} aria-label="Primary navigation">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            const linkClassNames = [
              styles.navLink,
              collapsed && !mobileOpen ? styles.navLinkCollapsed : "",
              active ? styles.navLinkActive : ""
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <Link key={href} href={href} className={linkClassNames} title={label}>
                <span className={styles.navIcon}>
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                {showLabels ? <span className={styles.navLabel}>{label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={[styles.logoutBtn, styles.iconToggle].join(" ")}
            onClick={() => {
              clearSessionToken();
              router.push("/");
            }}
          >
            <LogOut size={18} />
            {showLabels ? <span>Logout</span> : null}
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={[styles.mobileOnly, styles.logoutBtn].join(" ")}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>

          <div className={styles.topbarDesktop} style={{ width: "100%", alignItems: "center", justifyContent: "space-between" }}>
            <h1 className={styles.topbarDesktopTitle}>{title}</h1>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={() => {
                clearSessionToken();
                router.push("/");
              }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          <div className={styles.mobileOnly} style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 650, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h1>
          </div>

          <button
            type="button"
            className={[styles.mobileOnly, styles.logoutBtn].join(" ")}
            onClick={() => {
              clearSessionToken();
              router.push("/");
            }}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </header>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
