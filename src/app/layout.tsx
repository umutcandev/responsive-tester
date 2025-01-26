import type { Metadata } from "next";
import { GeistSans } from "geist/font";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Responsive Tester",
  description: "Test your website's responsiveness across different devices and screen sizes",
  authors: [{ name: "Responsive Tester" }],
  keywords: ["responsive", "testing", "web development", "screen sizes", "device testing"],
  metadataBase: new URL('https://responsive-tester.vercel.app'),
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Responsive Tester",
  },
  openGraph: {
    title: "Responsive Tester",
    description: "Test your website's responsiveness across different devices and screen sizes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Responsive Tester",
    description: "Test your website's responsiveness across different devices and screen sizes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", GeistSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
