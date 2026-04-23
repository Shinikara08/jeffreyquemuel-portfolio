import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jeffrey Quemuel — AI Automation Engineer · n8n · Shopee & Lazada",
  description:
    "I build production-grade automation for multi-market e-commerce. 3.4M+ orders synced across Shopee, Lazada, and BigQuery with n8n and Claude AI.",
  metadataBase: new URL("https://jeffreyquemuel.cloud"),
  openGraph: {
    title: "Jeffrey Quemuel — AI Automation Engineer",
    description:
      "No API? I build one. No workflow? I automate it. No prompt? I engineer it. 3.4M+ orders automated across SG/MY/TH.",
    url: "https://jeffreyquemuel.cloud",
    siteName: "Jeffrey Quemuel",
    type: "website",
  },
  keywords: [
    "n8n automation engineer Philippines",
    "Shopee Lazada API integration developer",
    "AI workflow automation freelancer",
    "e-commerce automation n8n specialist",
    "BigQuery automation engineer",
    "Claude AI workflow integration",
    "HMAC SHA256 API signing developer",
    "OAuth2 token refresh automation",
    "order sync automation Shopee Lazada",
    "remote AI automation engineer hire",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-background text-foreground antialiased min-h-screen"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
