"use client";

const TOKEN_KEY = "entertab_token";

export function setSessionToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `entertab_token=${token}; path=/; max-age=86400; samesite=lax`;
}

export function getSessionToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSessionToken() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = "entertab_token=; path=/; max-age=0; samesite=lax";
}
