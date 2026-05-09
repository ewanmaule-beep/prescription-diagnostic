"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import ReportSection from "@/components/ReportSection";
import ResultSummary from "@/components/ResultSummary";
import Button from "@/components/Button";
import { generateReport, formatReportAsText } from "@/lib/report";
import { ReportData, Answers } from "@/types";

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [freeTexts, setFreeTexts] = useState<string[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem("diagnostic-answers");
    if (!raw) {
      router.push("/");
      return;
    }
    const answers: Answers = JSON.parse(raw);
    const generated = generateReport(answers);
    setReport(generated);

    // Collect non-empty free-text answers
    const textQIds = ["q6", "q12", "q18", "q19"];
    const texts = textQIds
      .map((id) => answers[id])
      .filter((v): v is string => typeof v === "string" && v.trim().length > 0);
    setFreeTexts(texts);
  }, [router]);

  function handleCopy() {
    if (!report) return;
    const text = formatReportAsText(report);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleDownload() {
    if (!report) return;
    const text = formatReportAsText(report);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prescription-career-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!report) {
    return (
      <Layout maxWidth="md">
        <div className="text-center py-20" style={{ color: "var(--text-subtle)" }}>
          Generating your report…
        </div>
      </Layout>
    );
  }

  return (
    <Layout maxWidth="lg">
      {/* Report header */}
      <div className="mb-10">
        <span
          className="inline-block text-xs font-medium tracking-widest uppercase mb-4"
          style={{ color: "var(--teal)" }}
        >
          Your report
        </span>
        <h1
          className="font-serif text-3xl sm:text-4xl font-normal mb-4 leading-snug"
          style={{ color: "var(--text)" }}
        >
          Career Translation Report
        </h1>
        <p className="text-base" style={{ color: "var(--text-muted)" }}>
          {report.summary}
        </p>

        {/* Disclaimer */}
        <div
          className="mt-5 px-5 py-4 rounded-lg border text-sm"
          style={{
            borderColor: "var(--border)",
            background: "var(--teal-light)",
            color: "var(--teal-dark)",
          }}
        >
          This is a reflective tool, not career advice. It does not diagnose, categorise,
          or tell you what to do. Use it as a starting point for your own thinking.
        </div>
      </div>

      {/* Domain score chart */}
      <div className="card p-6 sm:p-8 mb-10">
        <h2
          className="font-serif text-xl font-normal mb-6"
          style={{ color: "var(--text)" }}
        >
          Your pattern profile
        </h2>
        <ResultSummary scores={report.domainScores} />
      </div>

      {/* Section 1: What your answers suggest */}
      <ReportSection title="What your answers suggest">
        <div className="space-y-3">
          {report.patterns.map((p, i) => (
            <p key={i} className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {p}
            </p>
          ))}
        </div>

        {/* Free-text answers, if any */}
        {freeTexts.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Your own words (from the open questions):
            </p>
            {freeTexts.map((t, i) => (
              <blockquote
                key={i}
                className="pl-4 py-2 text-sm italic leading-relaxed"
                style={{
                  borderLeft: "2px solid var(--teal)",
                  color: "var(--text-muted)",
                }}
              >
                {t}
              </blockquote>
            ))}
          </div>
        )}
      </ReportSection>

      {/* Section 2: Transferable capabilities */}
      <ReportSection
        title="Transferable capabilities you may be underestimating"
        note="These are not based on your job title. They reflect patterns in how you described working."
      >
        <ul className="space-y-2">
          {report.capabilities.map((c, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                style={{ background: "var(--teal)" }}
              />
              <span className="text-base" style={{ color: "var(--text-muted)" }}>
                {c}
              </span>
            </li>
          ))}
        </ul>
      </ReportSection>

      {/* Section 3: Energising environments */}
      <ReportSection title="Work environments likely to energise you">
        <ul className="space-y-2">
          {report.energisingEnvironments.map((e, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                style={{ background: "var(--teal)" }}
              />
              <span className="text-base" style={{ color: "var(--text-muted)" }}>
                {e}
              </span>
            </li>
          ))}
        </ul>
      </ReportSection>

      {/* Section 4: Draining environments */}
      <ReportSection title="Work environments likely to drain you">
        <ul className="space-y-2">
          {report.drainingEnvironments.map((e, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                style={{ background: "var(--amber)", opacity: 0.7 }}
              />
              <span className="text-base" style={{ color: "var(--text-muted)" }}>
                {e}
              </span>
            </li>
          ))}
        </ul>
      </ReportSection>

      {/* Section 5: Sectors */}
      <ReportSection
        title="Sectors and role families worth exploring"
        note="These suggestions are based on the patterns in your answers — not a fixed shortlist."
      >
        <div className="flex flex-wrap gap-2">
          {report.sectors.map((s, i) => (
            <span
              key={i}
              className="inline-block text-sm px-3 py-1.5 rounded-lg"
              style={{
                background: "var(--teal-light)",
                color: "var(--teal-dark)",
                border: "1px solid",
                borderColor: "var(--teal)",
                opacity: 0.85,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </ReportSection>

      {/* Section 6: Language tips */}
      <ReportSection title="How to talk about your NHS experience outside the NHS">
        <div className="space-y-6">
          {report.languageTips.map((tip, i) => (
            <div
              key={i}
              className="p-5 rounded-lg"
              style={{ background: "#f0f9f6", border: "1px solid var(--teal-light)" }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {tip}
              </p>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Section 7: Coaching questions */}
      <ReportSection
        title="Coaching questions to reflect on next"
        note="You may want to write your answers down, or bring these into a coaching conversation."
      >
        <ol className="space-y-4">
          {report.coachingQuestions.map((q, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span
                className="flex-shrink-0 font-serif text-lg"
                style={{ color: "var(--teal)", opacity: 0.5, lineHeight: 1.2 }}
              >
                {i + 1}.
              </span>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {q}
              </p>
            </li>
          ))}
        </ol>
      </ReportSection>

      {/* Actions */}
      <div
        className="card p-6 sm:p-8 mb-10"
        style={{ background: "var(--teal-light)", border: "1.5px solid var(--teal)" }}
      >
        <h3
          className="font-serif text-lg font-normal mb-2"
          style={{ color: "var(--teal-dark)" }}
        >
          Take this further
        </h3>
        <p className="text-sm mb-5" style={{ color: "var(--teal-dark)", opacity: 0.8 }}>
          A coaching conversation can help you work through what this report is pointing to.
        </p>
        <a
          href="#"
          className="btn-primary inline-flex"
          style={{ background: "var(--teal-dark)" }}
        >
          Book a coaching conversation
        </a>
      </div>

      {/* Export */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Button variant="secondary" onClick={handleCopy}>
          {copied ? "Copied ✓" : "Copy report"}
        </Button>
        <Button variant="secondary" onClick={handleDownload}>
          Download as .txt
        </Button>
        <Button variant="ghost" onClick={() => router.push("/")}>
          ← Start again
        </Button>
      </div>

      {/* Feedback */}
      <div className="card p-6 mb-4">
        <p className="text-sm font-medium mb-4" style={{ color: "var(--text)" }}>
          Did this help you see your experience differently?
        </p>
        {feedback ? (
          <p className="text-sm" style={{ color: "var(--teal)" }}>
            Thank you for the feedback.
          </p>
        ) : (
          <div className="flex gap-3 flex-wrap">
            {["Yes", "Somewhat", "Not yet"].map((label) => (
              <button
                key={label}
                className="btn-secondary text-sm px-4 py-2"
                onClick={() => setFeedback(label)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
