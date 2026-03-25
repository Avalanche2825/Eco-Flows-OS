"use client";

import React from "react";
import { Header } from "./header";

export function EcoLayout({ children }: { children: React.ReactNode }) {
  // We're forcing a dark theme design per user's pristine HTML layout
  return (
    <div className="dark antialiased">
      <Header />
      {/* We removed the sidebar entirely since the new nav is top-horizontal */}
      <main className="page-container mt-16 pb-20">
        {children}
      </main>
    </div>
  );
}
