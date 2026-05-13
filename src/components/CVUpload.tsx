"use client";

import { useState, useRef } from "react";

interface CVUploadProps {
  onUpload: (file: File) => void;
  onClear: () => void;
  uploaded: File | null;
}

const ACCEPTED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_MB = 5;

export default function CVUpload({ onUpload, onClear, uploaded }: CVUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function validate(file: File): string | null {
    if (!ACCEPTED.includes(file.type)) {
      return "Please upload a PDF or Word document (.pdf, .doc, .docx).";
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return `File must be under ${MAX_MB}MB.`;
    }
    return null;
  }

  function handleFile(file: File) {
    const err = validate(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onUpload(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="mt-8">
      <div
        className="flex items-start gap-3 mb-4 p-4 rounded-lg"
        style={{ background: "var(--teal-light)", border: "1px solid var(--teal)" }}
      >
        <div
          style={{
            width: "3px",
            height: "100%",
            minHeight: "40px",
            background: "var(--teal)",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        />
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--teal-dark)" }}>
            Optional: upload your CV
          </p>
          <p className="text-sm" style={{ color: "var(--teal-dark)", opacity: 0.8 }}>
            If you upload your CV, your report will include specific references to your
            qualifications, career history, and any relevant experience — rather than
            general suggestions. Your CV is not stored. It is used only to generate
            your report.
          </p>
        </div>
      </div>

      {!uploaded ? (
        <div
          className="rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-all"
          style={{
            borderColor: dragging ? "var(--teal)" : "var(--border)",
            background: dragging ? "var(--teal-light)" : "transparent",
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
            Drop your CV here, or click to browse
          </p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            PDF or Word — up to 5MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg"
          style={{ background: "var(--teal-light)", border: "1px solid var(--teal)" }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: "var(--teal)", fontSize: "1.2rem" }}>✓</span>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--teal-dark)" }}>
                {uploaded.name}
              </p>
              <p className="text-xs" style={{ color: "var(--teal-dark)", opacity: 0.7 }}>
                {(uploaded.size / 1024).toFixed(0)} KB — will be used in your report
              </p>
            </div>
          </div>
          <button
            className="text-xs underline"
            style={{ color: "var(--text-subtle)" }}
            onClick={onClear}
          >
            Remove
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm mt-2" style={{ color: "var(--amber)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
