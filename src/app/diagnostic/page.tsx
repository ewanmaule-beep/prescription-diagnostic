"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import Button from "@/components/Button";
import CVUpload from "@/components/CVUpload";
import CareerContextSection from "@/components/CareerContextSection";
import { questions } from "@/data/questions";
import { Answers, AnswerValue, CareerContext } from "@/types";

export default function DiagnosticPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string | null>(null);
  const [showRestart, setShowRestart] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [careerContext, setCareerContext] = useState<CareerContext>({});

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const answer = answers[current.id];

  function handleChange(value: AnswerValue) {
    setError(null);
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function isAnswered() {
    if (!current.required) return true;
    if (current.type === "text") return true;
    if (answer === undefined || answer === null) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  }

  async function handleNext() {
    if (!isAnswered()) {
      setError("Please select an answer before continuing.");
      return;
    }
    setError(null);

    if (isLast) {
      sessionStorage.setItem("diagnostic-answers", JSON.stringify(answers));
      if (cvFile) {
        // Store CV name so the report page knows one was uploaded
        sessionStorage.setItem("cv-filename", cvFile.name);
        // Store the file temporarily using a URL object
        const url = URL.createObjectURL(cvFile);
        sessionStorage.setItem("cv-url", url);
        sessionStorage.setItem("cv-type", cvFile.type);
        sessionStorage.setItem("cv-size", String(cvFile.size));
      } else {
        sessionStorage.removeItem("cv-filename");
        sessionStorage.removeItem("cv-url");
      }
      // Persist career context (if any of it was provided)
      const cleaned: CareerContext = {};
      if (careerContext.jobTitle && careerContext.jobTitle.trim()) {
        cleaned.jobTitle = careerContext.jobTitle.trim();
      }
      if (Object.keys(cleaned).length > 0) {
        sessionStorage.setItem("career-context", JSON.stringify(cleaned));
      } else {
        sessionStorage.removeItem("career-context");
      }
      router.push("/report");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handlePrev() {
    setError(null);
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  function handleRestart() {
    setAnswers({});
    setCurrentIndex(0);
    setError(null);
    setCvFile(null);
    setCareerContext({});
    setShowRestart(false);
  }

  return (
    <Layout maxWidth="md">
      <ProgressBar current={currentIndex + 1} total={questions.length} />

      <QuestionCard
        key={current.id}
        question={current}
        questionNumber={currentIndex + 1}
        answer={answer}
        onChange={handleChange}
      />

      {/* CV upload appears on last question */}
      {isLast && (
        <>
          <CVUpload
            onUpload={(f) => setCvFile(f)}
            onClear={() => setCvFile(null)}
            uploaded={cvFile}
          />
          <CareerContextSection
            context={careerContext}
            onChange={setCareerContext}
            hasCv={!!cvFile}
          />
        </>
      )}

      {error && (
        <p className="mt-3 text-sm" style={{ color: "var(--amber)" }}>
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← Previous
        </Button>

        <div className="flex items-center gap-3">
          <button
            className="btn-ghost text-xs"
            onClick={() => setShowRestart(true)}
            style={{ color: "var(--text-subtle)" }}
          >
            Restart
          </button>
          <Button onClick={handleNext}>
            {isLast ? "View your report →" : "Next →"}
          </Button>
        </div>
      </div>

      {current.type === "text" && (
        <p className="text-xs text-center mt-4" style={{ color: "var(--text-subtle)" }}>
          This question is optional. You can leave it blank and continue.
        </p>
      )}

      {/* Restart confirm */}
      {showRestart && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: "rgba(28,28,26,0.5)" }}
        >
          <div className="card p-8 max-w-sm w-full text-center">
            <h3 className="font-serif text-lg mb-3" style={{ color: "var(--text)" }}>
              Start again?
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Your current answers will be cleared.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setShowRestart(false)}>
                Cancel
              </Button>
              <Button onClick={handleRestart}>Yes, restart</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
