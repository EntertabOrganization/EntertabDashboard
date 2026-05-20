"use client";

import { useEffect, useState } from "react";
import { getSessionToken } from "@/lib/auth/session";

/**
 * Hydrates the JWT after mount (localStorage isn't available during SSR paint).
 */
export function useClientAuthToken(): string | null {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getSessionToken());
  }, []);

  return token;
}
