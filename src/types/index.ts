export type QuestionType = "single" | "multi" | "rating" | "text";

export type Domain =
  | "judgement"
  | "translation"
  | "influence"
  | "delivery"
  | "systems"
  | "development"
  | "data"
  | "operations";

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

export interface CareerContext {
  jobTitle?: string;
}

export interface TranslationPhrase {
  context: string; // e.g. "CV bullet", "LinkedIn one-liner", "In conversation", "Interview fragment"
  text: string;
}

export interface LanguageBank {
  skillName: string;
  phrasings: TranslationPhrase[];
}

export interface ReportData {
  domainScores: DomainScore[];
  topDomains: Domain[];
  lowDomains: Domain[];
  answers: Answers;
  patterns: string[];
  capabilities: string[];
  languageBanks: LanguageBank[];
  coachingQuestions: string[];
  nextSteps: string[];
  summary: string;
}
