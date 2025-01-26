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
