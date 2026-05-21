import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jeffrey Quemuel — AI Systems Engineer · n8n · Shopee & Lazada",
  description:
    "I build production-grade automation for multi-market e-commerce. 3.4M+ orders synced across Shopee, Lazada, and BigQuery with n8n and Claude AI.",
  metadataBase: new URL("https://jeffreyquemuel.cloud"),
  openGraph: {
    title: "Jeffrey Quemuel — AI Systems Engineer",
    description:
      "No API? I build one. No workflow? I automate it. No prompt? I engineer it. 3.4M+ orders automated across SG/MY/TH.",
    url: "https://jeffreyquemuel.cloud",
    siteName: "Jeffrey Quemuel",
    images: [
      {
        url: "https://jeffreyquemuel.cloud/images/qorex/convergence.jpg",
        width: 2560,
        height: 1440,
        alt: "QoreX AI team convergence artwork from Jeffrey Quemuel's portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeffrey Quemuel - AI Systems Engineer",
    description:
      "No API? I build one. No workflow? I automate it. No prompt? I engineer it. 3.4M+ orders automated across SG/MY/TH.",
    images: ["https://jeffreyquemuel.cloud/images/qorex/convergence.jpg"],
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
    "remote AI systems engineer hire",
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
        className="bg-background text-foreground antialiased min-h-screen pt-16"
        suppressHydrationWarning
      >
        <TopNav />
        {children}
      </body>
    </html>
  );
}
