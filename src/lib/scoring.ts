import { Answers, Domain, DomainScore } from "@/types";
import { questions, domainLabels } from "@/data/questions";

const DOMAIN_MAX_SCORES: Record<Domain, number> = {
  judgement: 8,
  translation: 9,
  influence: 8,
  delivery: 8,
  systems: 9,
  development: 8,
  data: 10,
  operations: 10,
};

export function calculateDomainScores(answers: Answers): DomainScore[] {
  const rawScores: Record<Domain, number> = {
    judgement: 0,
    translation: 0,
    influence: 0,
    delivery: 0,
    systems: 0,
    development: 0,
    data: 0,
    operations: 0,
  };

  questions.forEach((q) => {
    const answer = answers[q.id];
    if (!answer) return;

    if (q.type === "rating" && typeof answer === "number") {
      // Rating 1-5 maps to domain score 0-2
      const normalised = ((answer - 1) / 4) * 2;
      rawScores[q.domain] = (rawScores[q.domain] || 0) + normalised;
    } else if (q.type === "single" && typeof answer === "string") {
      const option = q.options?.find((o) => o.value === answer);
      if (option?.scores) {
        (Object.entries(option.scores) as [Domain, number][]).forEach(
          ([domain, score]) => {
            rawScores[domain] = (rawScores[domain] || 0) + score;
          }
        );
      }
    } else if (q.type === "multi" && Array.isArray(answer)) {
      answer.forEach((val) => {
        const option = q.options?.find((o) => o.value === val);
        if (option?.scores) {
          (Object.entries(option.scores) as [Domain, number][]).forEach(
            ([domain, score]) => {
              rawScores[domain] = (rawScores[domain] || 0) + score;
            }
          );
        }
      });
    }
    // text answers don't contribute to scores
  });

  // Clamp and normalise
  return (Object.keys(rawScores) as Domain[]).map((domain) => {
    const max = DOMAIN_MAX_SCORES[domain];
    const raw = Math.max(0, rawScores[domain]);
    const clamped = Math.min(raw, max);
    return {
      domain,
      score: clamped,
      maxScore: max,
      percentage: Math.round((clamped / max) * 100),
      label: domainLabels[domain],
    };
  });
}

export function getTopDomains(scores: DomainScore[], n = 2): Domain[] {
  return [...scores]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, n)
    .map((s) => s.domain);
}

export function getLowDomains(scores: DomainScore[], n = 2): Domain[] {
  return [...scores]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, n)
    .map((s) => s.domain);
}
