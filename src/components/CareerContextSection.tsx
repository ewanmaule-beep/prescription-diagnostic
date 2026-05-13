"use client";

import { CareerContext } from "@/types";

interface Props {
  context: CareerContext;
  onChange: (context: CareerContext) => void;
  hasCv: boolean;
}

export default function CareerContextSection({ context, onChange, hasCv }: Props) {
  // If a CV is uploaded, we don't need to ask for anything else — the CV covers it.
  if (hasCv) return null;

  function setField<K extends keyof CareerContext>(key: K, value: CareerContext[K]) {
    onChange({ ...context, [key]: value });
  }

  return (
    <div className="mt-6">
      <div
        className="flex items-start gap-3 mb-4 p-4 rounded-lg"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div
          style={{
            width: "3px",
            minHeight: "40px",
            background: "var(--teal)",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        />
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
            Optional: a little context to sharpen your report
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            If you have not uploaded a CV, this helps tailor the seniority and framing of your report.
          </p>
        </div>
      </div>

      <div className="mb-2">
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text)" }}
        >
          Your current job title
        </label>
        <input
          type="text"
          value={context.jobTitle ?? ""}
          onChange={(e) => setField("jobTitle", e.target.value)}
          placeholder="e.g. Lead Pharmacist, Practice Pharmacist, Pharmacy Manager"
          className="w-full px-4 py-2.5 rounded-lg text-sm"
          style={{
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        />
      </div>
    </div>
  );
}
