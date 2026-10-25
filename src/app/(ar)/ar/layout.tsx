import type { Metadata, Viewport } from "next";
import "../../globals.css";
import { fontVars } from "../../fonts";
import { ar } from "@/content/site";
import { buildMetadata, MOTION_BOOT } from "@/content/meta";

export const metadata: Metadata = buildMetadata(ar);
export const viewport: Viewport = { themeColor: "#f6f7fb", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
