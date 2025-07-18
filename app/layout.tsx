import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/sidebar/sidebar";
import { MobileNav } from "@/components/sidebar/mobile-nav";
import { SidebarOverlay } from "@/components/sidebar-overlay";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turinhub Atomix - 常用网页模组网站",
  description: "常用网页模组网站，仅供内部开发使用。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          defer
          src="https://umami.loongtales.com/script.js"
          data-website-id="1ce18bfe-d08d-442d-9fd3-cd62909f817d"
        />
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <MobileNav />
            <SidebarOverlay />
            <div className="flex h-screen w-full">
              <Sidebar />
              <SidebarInset className="flex-1">
                <main className="h-full w-full overflow-y-auto bg-background flex flex-col">
                  <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-1 md:pt-8 pt-16">
                    {children}
                  </div>
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
