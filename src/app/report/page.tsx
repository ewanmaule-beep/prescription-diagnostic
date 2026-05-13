"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import ReportSection from "@/components/ReportSection";
import ResultSummary from "@/components/ResultSummary";
import Button from "@/components/Button";
import { generateReport, formatReportAsText } from "@/lib/report";
import { ReportData, Answers, LanguageBank } from "@/types";

type EnhancedData = {
  summary: string;
  patterns: string[];
  capabilities: string[];
  languageBanks: LanguageBank[];
  coachingQuestions: string[];
};

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [enhanced, setEnhanced] = useState<EnhancedData | null>(null);
  const [cvUsed, setCvUsed] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [freeTexts, setFreeTexts] = useState<string[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem("diagnostic-answers");
    if (!raw) { router.push("/"); return; }

    const answers: Answers = JSON.parse(raw);
    const generated = generateReport(answers);
    setReport(generated);

    // Text questions in the new question set are q3 (judgement) and q8 (influence)
    const textQIds = ["q3", "q8"];
    const texts = textQIds
      .map((id) => answers[id])
      .filter((v): v is string => typeof v === "string" && v.trim().length > 0);
    setFreeTexts(texts);

    // Attempt AI enhancement
    const cvUrl = sessionStorage.getItem("cv-url");
    const cvType = sessionStorage.getItem("cv-type");
    const cvFilename = sessionStorage.getItem("cv-filename");
    const careerContextRaw = sessionStorage.getItem("career-context");

    async function enhance() {
      setAiLoading(true);
      setAiError(null);
      try {
        const fd = new FormData();
        fd.append("answers", raw!);
        fd.append("baseReport", JSON.stringify(generated));

        if (cvUrl && cvType && cvFilename) {
          const resp = await fetch(cvUrl);
          const blob = await resp.blob();
          const file = new File([blob], cvFilename, { type: cvType });
          fd.append("cv", file);
        }

        if (careerContextRaw) {
          fd.append("careerContext", careerContextRaw);
        }

        const res = await fetch("/api/report", { method: "POST", body: fd });
        if (!res.ok) throw new Error("API returned error");
        const data = await res.json();
        setEnhanced(data.enhanced);
        setCvUsed(data.cvUsed);
      } catch {
        setAiError("Could not generate AI-enhanced report — showing your standard report below.");
      } finally {
        setAiLoading(false);
      }
    }

    enhance();
  }, [router]);

  const display = enhanced || null;

  function handleCopy() {
    if (!report) return;
    const text = formatReportAsText(report, enhanced ?? undefined);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleDownload() {
    if (!report) return;
    const text = formatReportAsText(report, enhanced ?? undefined);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prescription-career-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!report || aiLoading) {
    const cvUrlPresent = typeof window !== "undefined" && !!sessionStorage.getItem("cv-url");
    return (
      <Layout maxWidth="md">
        <div className="text-center py-24" style={{ color: "var(--text-muted)" }}>
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="animate-pulse text-2xl" style={{ color: "var(--teal)" }}>●</span>
            <span className="font-serif text-xl" style={{ color: "var(--text)" }}>
              Generating your personalised report
            </span>
          </div>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-subtle)" }}>
            {cvUrlPresent
              ? "Reading your CV and shaping the report around your patterns. This usually takes 20–40 seconds."
              : "Shaping the report around the patterns in your answers. This usually takes 10–20 seconds."}
          </p>
        </div>
      </Layout>
    );
  }

  const patterns = display?.patterns ?? report.patterns;
  const capabilities = display?.capabilities ?? report.capabilities;
  const languageBanks = display?.languageBanks ?? report.languageBanks;
  const coachingQuestions = display?.coachingQuestions ?? report.coachingQuestions;
  const summary = display?.summary ?? report.summary;
  const nextSteps = report.nextSteps;

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
          Skills Translation Report
        </h1>

        {/* AI status indicator */}
        {cvUsed && (
          <div
            className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg text-sm"
            style={{ background: "var(--teal-light)", color: "var(--teal-dark)", border: "1px solid var(--teal)" }}
          >
            <span>✓</span>
            <span>Your CV was used to personalise this report.</span>
          </div>
        )}

        {aiError && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}
          >
            {aiError}
          </div>
        )}

        <p className="text-base" style={{ color: "var(--text-muted)" }}>{summary}</p>

        <div
          className="mt-5 px-5 py-4 rounded-lg border text-sm"
          style={{ borderColor: "var(--border)", background: "var(--teal-light)", color: "var(--teal-dark)" }}
        >
          This is a reflective tool, not career advice. It does not diagnose, categorise,
          or tell you what to do. Use it as a starting point for your own thinking.
        </div>
      </div>

      {/* Skill profile chart */}
      <div className="card p-6 sm:p-8 mb-10">
        <h2 className="font-serif text-xl font-normal mb-6" style={{ color: "var(--text)" }}>
          Your skill patterns
        </h2>
        <ResultSummary scores={report.domainScores} />
      </div>

      {/* Section 1 — Patterns */}
      <ReportSection title="What your answers suggest">
        <div className="space-y-3">
          {patterns.map((p, i) => (
            <p key={i} className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>{p}</p>
          ))}
        </div>
        {freeTexts.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Your own words (from the open questions):
            </p>
            {freeTexts.map((t, i) => (
              <blockquote
                key={i}
                className="pl-4 py-2 text-sm italic leading-relaxed"
                style={{ borderLeft: "2px solid var(--teal)", color: "var(--text-muted)" }}
              >
                {t}
              </blockquote>
            ))}
          </div>
        )}
      </ReportSection>

      {/* Section 2 — Capabilities */}
      <ReportSection
        title="Transferable capabilities you may be underestimating"
        note="These reflect patterns in how you described working — not your job title."
      >
        <ul className="space-y-4">
          {capabilities.map((c, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5" style={{ background: "var(--teal)" }} />
              <span className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>{c}</span>
            </li>
          ))}
        </ul>
      </ReportSection>

      {/* Section 3 — Translation bank */}
      <ReportSection
        title="How to talk about these skills outside the NHS"
        note="Phrasings you can adapt for a CV, LinkedIn, conversation, or interview answer."
      >
        <div className="space-y-6">
          {languageBanks.map((bank, i) => (
            <div
              key={i}
              className="p-5 rounded-lg"
              style={{ background: "var(--teal-light)", border: "1px solid var(--teal)" }}
            >
              <p className="text-sm font-medium mb-4" style={{ color: "var(--teal-dark)" }}>
                {bank.skillName}
              </p>
              <div className="space-y-3">
                {bank.phrasings.map((p, j) => (
                  <div key={j}>
                    <p
                      className="text-xs font-medium uppercase tracking-wide mb-1"
                      style={{ color: "var(--teal-dark)", opacity: 0.7 }}
                    >
                      {p.context}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--teal-dark)" }}>
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Section 4 — Coaching questions */}
      <ReportSection
        title="Coaching questions to reflect on next"
        note="You may want to write your answers down, or bring these into a coaching conversation."
      >
        <ol className="space-y-4">
          {coachingQuestions.map((q, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="flex-shrink-0 font-serif text-lg" style={{ color: "var(--teal)", opacity: 0.5, lineHeight: 1.2 }}>
                {i + 1}.
              </span>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>{q}</p>
            </li>
          ))}
        </ol>
      </ReportSection>

      {/* Section 5 — Next steps */}
      <ReportSection
        title="What to do with this report"
        note="Three small actions to make this useful, not just interesting."
      >
        <ol className="space-y-3">
          {nextSteps.map((step, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span
                className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
                style={{ background: "var(--teal)", color: "white" }}
              >
                {i + 1}
              </span>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>{step}</p>
            </li>
          ))}
        </ol>
      </ReportSection>

      {/* Coaching CTA */}
      <div
        className="card p-6 sm:p-8 mb-10"
        style={{ background: "var(--teal-light)", border: "1.5px solid var(--teal)" }}
      >
        <div className="flex items-start gap-3">
          <div style={{ width: "3px", minHeight: "48px", background: "var(--teal)", borderRadius: "2px", flexShrink: 0 }} />
          <div>
            <h3 className="font-serif text-lg font-normal mb-2" style={{ color: "var(--teal-dark)" }}>
              Take this further
            </h3>
            <p className="text-sm mb-5" style={{ color: "var(--teal-dark)", opacity: 0.8 }}>
              A coaching conversation can help you work through what this report is pointing to.
            </p>
            <a href="#" className="btn-primary inline-flex" style={{ background: "var(--teal-dark)" }}>
              Book a coaching conversation
            </a>
          </div>
        </div>
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
          <p className="text-sm" style={{ color: "var(--teal)" }}>Thank you for the feedback.</p>
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
