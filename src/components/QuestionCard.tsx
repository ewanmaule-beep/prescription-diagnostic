"use client";

import { Question, AnswerValue } from "@/types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  answer: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  answer,
  onChange,
}: QuestionCardProps) {
  const domainColours: Record<string, string> = {
    complexity: "#27766a",
    ambiguity: "#5c554a",
    influence: "#359282",
    delivery: "#d97706",
    values: "#1e4c46",
    energy: "#72695a",
  };

  const domainLabels: Record<string, string> = {
    complexity: "Complexity Translation",
    ambiguity: "Ambiguity and Autonomy",
    influence: "Relationship-led Influence",
    delivery: "Delivery and Momentum",
    values: "Values Alignment",
    energy: "Energy and Environment",
  };

  return (
    <div className="card p-7 sm:p-9 question-enter">
      {/* Domain tag */}
      <div className="mb-5">
        <span
          className="inline-block text-xs font-medium tracking-wide uppercase px-3 py-1 rounded-full"
          style={{
            background: `${domainColours[question.domain]}15`,
            color: domainColours[question.domain],
          }}
        >
          {domainLabels[question.domain]}
        </span>
      </div>

      {/* Question text */}
      <h2
        className="font-serif text-xl sm:text-2xl font-normal leading-snug mb-2"
        style={{ color: "var(--text)" }}
      >
        {questionNumber}. {question.text}
      </h2>

      {question.subtext && (
        <p className="text-sm mb-6" style={{ color: "var(--text-subtle)" }}>
          {question.subtext}
        </p>
      )}

      {!question.subtext && <div className="mb-6" />}

      {/* Single choice */}
      {question.type === "single" && question.options && (
        <div className="space-y-2">
          {question.options.map((opt) => (
            <label
              key={opt.value}
              className={`option-label ${answer === opt.value ? "selected" : ""}`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={answer === opt.value}
                onChange={() => onChange(opt.value)}
              />
              <span style={{ color: "var(--text)" }}>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Multi select */}
      {question.type === "multi" && question.options && (
        <div className="space-y-2">
          {question.options.map((opt) => {
            const checked = Array.isArray(answer) && answer.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`option-label ${checked ? "selected" : ""}`}
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={checked}
                  onChange={(e) => {
                    const current = Array.isArray(answer) ? answer : [];
                    if (e.target.checked) {
                      onChange([...current, opt.value]);
                    } else {
                      onChange(current.filter((v) => v !== opt.value));
                    }
                  }}
                />
                <span style={{ color: "var(--text)" }}>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}

      {/* Rating scale */}
      {question.type === "rating" && (
        <div>
          <div className="flex gap-2 mb-3 flex-wrap">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`rating-btn ${answer === n ? "selected" : ""}`}
                onClick={() => onChange(n)}
              >
                {n}
              </button>
            ))}
          </div>
          {question.ratingLabels && (
            <div
              className="flex justify-between text-xs mt-1"
              style={{ color: "var(--text-subtle)" }}
            >
              <span className="max-w-[45%]">1 — {question.ratingLabels.low}</span>
              <span className="max-w-[45%] text-right">
                5 — {question.ratingLabels.high}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Free text */}
      {question.type === "text" && (
        <textarea
          rows={4}
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your answer here…"
        />
      )}
    </div>
  );
}
