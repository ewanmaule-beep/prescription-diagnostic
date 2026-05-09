"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          Question {current} of {total}
        </span>
        <span className="text-sm" style={{ color: "var(--text-subtle)" }}>
          {pct}% complete
        </span>
      </div>
      <div className="domain-bar-track">
        <div
          className="domain-bar-fill progress-bar-inner"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
