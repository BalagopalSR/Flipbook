"use client";

import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="lg:pl-64">{children}</main>
    </div>
  );
}
