"use client";

import React from "react";

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
      {/* Header */}
      <header className="py-5 px-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className={`${widthMap[maxWidth]} mx-auto flex items-center justify-between`}>
          <div>
            <span
              className="font-serif text-sm font-normal tracking-wide"
              style={{ color: "var(--teal)" }}
            >
              The Prescription
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
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
        className="py-8 px-6 border-t text-center"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="font-serif text-sm italic" style={{ color: "var(--text-subtle)" }}>
          The Prescription — Clarity in complexity
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-subtle)", opacity: 0.6 }}>
          This tool is for reflection only. It is not career advice.
        </p>
      </footer>
    </div>
  );
}
