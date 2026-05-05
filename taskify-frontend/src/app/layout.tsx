import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Taskify - Team Task Management",
  description: "Manage your team tasks efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--bg-elevated)',
                color: 'var(--text-main)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              },
            }}
          />
          <div className="app-shell">
            <Navbar />
            <main className="main-content container">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
