"use client";

import React from "react";

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
  note?: string;
}

export default function ReportSection({ title, children, note }: ReportSectionProps) {
  return (
    <div className="mb-10">
      <div className="report-section">
        <h3
          className="font-serif text-lg sm:text-xl font-normal mb-4"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h3>
        <div>{children}</div>
      </div>
      {note && (
        <p className="text-xs mt-3 pl-5" style={{ color: "var(--text-subtle)" }}>
          {note}
        </p>
      )}
    </div>
  );
}
