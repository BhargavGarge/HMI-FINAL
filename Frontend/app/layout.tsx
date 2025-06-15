import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DIW Data Narrator",
  description:
    "Transform complex economic data into engaging visuals and audio narratives",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set initial theme class for server render.
  // You can enhance this by reading user preference from cookies or headers.
  const initialTheme = "light"; // or "dark" or "system" — but for SSR use "light" or "dark"

  return (
    <html
      lang="en"
      className={initialTheme}
      style={{ colorScheme: initialTheme }}
    >
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme={initialTheme}
          enableSystem={false} // false to avoid mismatch; toggle this if you want system-based theme
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Navbar />
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
