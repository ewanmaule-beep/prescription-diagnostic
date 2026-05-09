export type QuestionType = "single" | "multi" | "rating" | "text";

export type Domain =
  | "complexity"
  | "ambiguity"
  | "influence"
  | "delivery"
  | "values"
  | "energy";

export interface Option {
  value: string;
  label: string;
  scores?: Partial<Record<Domain, number>>;
}

export interface Question {
  id: string;
  domain: Domain;
  type: QuestionType;
  text: string;
  subtext?: string;
  options?: Option[];
  ratingLabels?: { low: string; high: string };
  required?: boolean;
}

export type AnswerValue = string | string[] | number;

export interface Answers {
  [questionId: string]: AnswerValue;
}

export interface DomainScore {
  domain: Domain;
  score: number;
  maxScore: number;
  percentage: number;
  label: string;
}

export interface ReportData {
  domainScores: DomainScore[];
  topDomains: Domain[];
  lowDomains: Domain[];
  answers: Answers;
  patterns: string[];
  capabilities: string[];
  energisingEnvironments: string[];
  drainingEnvironments: string[];
  sectors: string[];
  languageTips: string[];
  coachingQuestions: string[];
  summary: string;
}
