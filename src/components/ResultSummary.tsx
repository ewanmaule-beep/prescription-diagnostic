"use client";

import { DomainScore } from "@/types";
import { domainDescriptors } from "@/data/questions";

interface ResultSummaryProps {
  scores: DomainScore[];
}

export default function ResultSummary({ scores }: ResultSummaryProps) {
  const sorted = [...scores].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        Each bar shows how strongly a pattern appeared across your answers, as a proportion of the maximum possible.
        A higher percentage means the pattern came up more often or more strongly. These are tendencies, not test scores.
      </p>
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
            {domainDescriptors[s.domain] && (
              <p className="text-xs mt-1.5" style={{ color: "var(--text-subtle)" }}>
                {domainDescriptors[s.domain]}
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs pt-2" style={{ color: "var(--text-subtle)" }}>
        These scores reflect patterns in your answers, not fixed traits. They are a starting point for reflection.
      </p>
    </div>
  );
}
