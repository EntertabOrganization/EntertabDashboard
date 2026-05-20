import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Entertab Dashboard",
  description: "Minimal professional admin dashboard"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
