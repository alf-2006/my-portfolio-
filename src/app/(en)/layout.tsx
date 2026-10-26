import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontVars } from "../fonts";
import { en } from "@/content/site";
import { buildMetadata, MOTION_BOOT } from "@/content/meta";

export const metadata: Metadata = buildMetadata(en);
export const viewport: Viewport = { themeColor: "#f6f7fb", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
