'use client'
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import Footer from "@/components/footer";
import Sidebar from "@/components/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Fix: Add a type assertion for ThemeProvider
const ThemeProvider = dynamic(() => import("@/components/theme-provider").then((mod) => mod.default), { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              
            >
            
                {/* Sidebar */}
                <div className="flex">
                <div className="flex">
                <Sidebar />

                </div>
                <main id="__next" className="flex-grow p-6 sm:ml-40 w-full top-0 left-64 mb-10 sm:left-72 h-screen overflow-auto">
                  {children}
                </main>
                </div>
              <Footer />
            </ThemeProvider>
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
