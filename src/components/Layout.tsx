"use client";

import React from "react";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const widthMap = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
};

export default function Layout({ children, maxWidth = "lg" }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Teal top bar — mirrors the logo vertical accent */}
      <div style={{ height: "4px", background: "var(--teal)", width: "100%" }} />

      {/* Header */}
      <header
        className="py-4 px-6 border-b"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <div className={`${widthMap[maxWidth]} mx-auto flex items-center justify-between`}>
          <a href="/" className="flex items-center" style={{ textDecoration: "none" }}>
            <Image
              src="/logo.png"
              alt="The Prescription"
              width={180}
              height={48}
              style={{ objectFit: "contain", height: "38px", width: "auto" }}
              priority
            />
          </a>
          <span className="text-xs hidden sm:block" style={{ color: "var(--text-subtle)" }}>
            Career Translation Diagnostic
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 py-10 px-4 sm:px-6">
        <div className={`${widthMap[maxWidth]} mx-auto`}>{children}</div>
      </div>

      {/* Footer */}
      <footer
        className="py-8 px-6 border-t"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <div className={`${widthMap[maxWidth]} mx-auto flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <div style={{ width: "3px", height: "28px", background: "var(--teal)", borderRadius: "2px", opacity: 0.6 }} />
            <div>
              <p className="font-serif text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text)" }}>
                The Prescription
              </p>
              <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
                for clarity in complexity
              </p>
            </div>
          </div>
          <p className="text-xs" style={{ color: "var(--text-subtle)", opacity: 0.7 }}>
            This tool is for reflection only. It is not career advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
