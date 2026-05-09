"use client";

import { DomainScore } from "@/types";

interface ResultSummaryProps {
  scores: DomainScore[];
}

export default function ResultSummary({ scores }: ResultSummaryProps) {
  const sorted = [...scores].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="space-y-4">
      {sorted.map((s) => (
        <div key={s.domain}>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {s.label}
            </span>
            <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
              {s.percentage}%
            </span>
          </div>
          <div className="domain-bar-track">
            <div className="domain-bar-fill" style={{ width: `${s.percentage}%` }} />
          </div>
        </div>
      ))}
      <p className="text-xs pt-2" style={{ color: "var(--text-subtle)" }}>
        These scores reflect patterns in your answers, not fixed traits. They are a starting point for reflection.
      </p>
    </div>
  );
}
