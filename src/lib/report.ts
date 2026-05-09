import { Answers, Domain, DomainScore, ReportData } from "@/types";
import { calculateDomainScores, getTopDomains, getLowDomains } from "./scoring";

// Pattern text by domain combination
const PATTERNS: Record<Domain, string[]> = {
  complexity: [
    "Your answers suggest you are drawn to work that requires making sense of difficult, layered information. You may have developed a strong instinct for identifying what actually matters in complex situations.",
    "You appear to have built a capacity for translating specialist knowledge into accessible language — often without realising how rare that combination is.",
  ],
  ambiguity: [
    "Your answers suggest you are comfortable operating without a fixed map. You may have developed a tolerance for uncertainty that many organisations actively need but rarely reward.",
    "You appear to work well in environments where the destination is still being worked out. This is not a common skill — it is often mistaken for indecision, but it is actually a form of strategic patience.",
  ],
  influence: [
    "Your answers suggest that much of your real work happens through relationships rather than formal authority. You may have built influence that is harder to put on a CV than a job title.",
    "You appear to operate effectively across organisational boundaries. The ability to bring people with you without relying on hierarchy is highly transferable.",
  ],
  delivery: [
    "Your answers suggest you get energy from seeing things through. You may be particularly effective in roles where implementation and accountability matter more than endless deliberation.",
    "You appear to be oriented toward outcomes and momentum. This can be a significant asset in organisations that struggle to convert good thinking into action.",
  ],
  values: [
    "Your answers suggest that values alignment is not optional for you — it is a working condition. This may limit some options, but it also tends to produce deeper commitment in the roles that do fit.",
    "You appear to have a well-developed sense of what is right in complex situations. Moral clarity in ambiguous environments is a leadership capability, even when it does not feel like one.",
  ],
  energy: [
    "Your answers suggest you have a clear sense of what environments bring out your best. This self-awareness is valuable — many people only discover this after making the wrong move.",
    "You appear to have some clarity about what drains you. Understanding the conditions you need to thrive is often more useful than a list of qualifications.",
  ],
};

const CAPABILITIES: Record<Domain, string[]> = {
  complexity: [
    "Making complex systems legible to non-expert stakeholders",
    "Synthesising information across professional and organisational boundaries",
    "Identifying the real problem underneath the stated problem",
  ],
  ambiguity: [
    "Operating effectively in early-stage, undefined, or changing environments",
    "Creating structure and direction when none exists",
    "Sustaining progress without needing permission at every step",
  ],
  influence: [
    "Building trust and working relationships across diverse groups",
    "Influencing decisions and behaviour without formal authority",
    "Navigating competing agendas to find workable paths forward",
  ],
  delivery: [
    "Moving work from thinking to doing",
    "Maintaining momentum and focus in environments that pull you toward delay",
    "Holding accountability without micromanagement",
  ],
  values: [
    "Holding ethical lines under organisational pressure",
    "Communicating difficult truths to senior decision-makers",
    "Building cultures where quality and integrity are taken seriously",
  ],
  energy: [
    "Identifying the conditions under which you do your best work",
    "Sustaining contribution over time rather than burning out",
    "Recognising when an environment is not working before it becomes a crisis",
  ],
};

const ENERGISING_ENVIRONMENTS: Record<Domain, string[]> = {
  complexity: [
    "Strategy and advisory roles where analysis is central",
    "Environments where you are expected to think, not just execute",
    "Organisations dealing with genuinely difficult, multi-layered challenges",
  ],
  ambiguity: [
    "Start-up and scale-up phases of new organisations or programmes",
    "Consultancy or advisory work with high variety",
    "Roles where the brief evolves and you help shape it",
  ],
  influence: [
    "Cross-functional or cross-sector partnership roles",
    "Stakeholder engagement, policy, or public affairs environments",
    "Leadership development or facilitation roles where relationships are the work",
  ],
  delivery: [
    "Programme and project leadership with clear outcomes",
    "Implementation-focused organisations that measure what they build",
    "Environments where getting things done is valued as much as thinking them",
  ],
  values: [
    "Mission-driven organisations where purpose is explicit",
    "Regulatory or assurance roles where standards matter",
    "Social impact, charity, or public interest environments",
  ],
  energy: [
    "Organisations that invest in how people work, not just what they produce",
    "Roles with some autonomy over how and when you contribute",
    "Teams where intellectual curiosity is welcomed",
  ],
};

const DRAINING_ENVIRONMENTS: Record<Domain, string[]> = {
  complexity: [
    "Roles requiring simple, repetitive execution without analytical challenge",
    "Organisations that penalise nuanced thinking in favour of quick answers",
  ],
  ambiguity: [
    "Highly procedural environments with little room for independent judgement",
    "Roles where everything requires sign-off before you can act",
  ],
  influence: [
    "Organisations that run entirely on hierarchy and formal authority",
    "Roles where relationships are transactional and trust is not valued",
  ],
  delivery: [
    "Environments where ideas circulate but nothing gets built",
    "Organisations that reward strategy but dismiss the people who implement it",
  ],
  values: [
    "Organisations where ethical concerns are treated as obstacles",
    "Roles that require you to present something as better than you know it to be",
  ],
  energy: [
    "Environments where wellbeing is spoken about but not acted on",
    "Roles with no intellectual variety or growth pathway",
  ],
};

const SECTORS_BY_DOMAIN: Record<Domain, string[]> = {
  complexity: [
    "Health technology and digital health",
    "Research and evaluation",
    "Strategy and transformation consultancy",
    "Regulation and assurance",
  ],
  ambiguity: [
    "Innovation networks and emerging health ventures",
    "Consultancy (generalist or sector-specialist)",
    "Portfolio or fractional advisory work",
    "Digital transformation",
  ],
  influence: [
    "Leadership development and facilitation",
    "Public affairs and policy",
    "Organisational development",
    "Professional bodies and membership organisations",
  ],
  delivery: [
    "Programme leadership",
    "Market access and commercial partnerships",
    "Charities and social impact organisations",
    "NHS transformation and improvement",
  ],
  values: [
    "Charities and social impact",
    "Regulation and assurance",
    "Training and facilitation",
    "Public affairs and policy",
  ],
  energy: [
    "Portfolio or fractional advisory work",
    "Training and facilitation",
    "Leadership development",
    "Innovation and social enterprise",
  ],
};

const LANGUAGE_TIPS: Record<Domain, string> = {
  complexity:
    "Outside the NHS, 'medicines optimisation' or 'commissioning' may mean nothing. Instead, try: 'I help organisations make sense of complex clinical and financial information and turn it into decisions people can act on.'",
  ambiguity:
    "Your experience working in undefined, politically complex environments is more unusual than you think. Try: 'I have spent years leading in environments where the rules were unclear, the stakeholders had competing interests, and getting things done required more than formal authority.'",
  influence:
    "Describing your influence is often harder than describing your expertise. Try: 'Much of what I do happens through relationships — building trust with people across different organisations and professions so that, when it matters, they are willing to move with me.'",
  delivery:
    "NHS delivery often gets lost in translation. Try: 'I have led programmes that turned good policy into working services — navigating the gap between what looks good on paper and what actually happens in practice.'",
  values:
    "Your values orientation may sound like idealism to some employers — frame it as a performance characteristic. Try: 'I work best in organisations where the stated mission and the daily decisions are genuinely aligned. I have stayed in difficult environments when that was true, and left when it was not.'",
  energy:
    "Knowing what you need is a sign of maturity, not fussiness. Try: 'I have learned what conditions help me do my best work — and I look for environments that can offer some version of that, rather than burning through goodwill in the wrong place.'",
};

const COACHING_QUESTIONS: Record<Domain, string[]> = {
  complexity: [
    "What is the most complex problem you have worked on in the last two years? What made it complex, and what did you do that others could not?",
    "If someone outside the NHS asked you to explain what you are genuinely good at — in thirty seconds — what would you say?",
  ],
  ambiguity: [
    "Think of a time when you created direction for others in an unclear situation. What did you do, and what would have happened without you?",
    "How much of your current dissatisfaction is about the work itself, and how much is about the environment you are doing it in?",
  ],
  influence: [
    "Who relies on you the most at work — and why? What would they say you provide that is hard to find elsewhere?",
    "Think of a decision that went the way you wanted it to. What did you do to make that happen? Was formal authority involved?",
  ],
  delivery: [
    "What is the last thing you completed — genuinely finished — that you are proud of? What did it take?",
    "What is currently sitting half-done that matters to you? What is getting in the way?",
  ],
  values: [
    "Where is the gap between the work you say you want to do and the work you are actually doing? What is keeping that gap open?",
    "What would have to be true about a future role for you to feel that your values and your work are genuinely aligned?",
  ],
  energy: [
    "When did you last feel truly energised by your work? What was different about that time?",
    "If you imagine yourself in five years feeling genuinely satisfied professionally, what does a typical Tuesday look like?",
  ],
};

export function generateReport(answers: Answers): ReportData {
  const domainScores = calculateDomainScores(answers);
  const topDomains = getTopDomains(domainScores, 3);
  const lowDomains = getLowDomains(domainScores, 2);

  // Patterns — from top 2 domains
  const patterns = topDomains.slice(0, 2).flatMap((d) => PATTERNS[d].slice(0, 1));

  // Capabilities — top 3 domains, 2 each
  const capabilities = topDomains
    .slice(0, 3)
    .flatMap((d) => CAPABILITIES[d].slice(0, 2));

  // Energising environments — top 2 domains
  const energisingEnvironments = topDomains
    .slice(0, 2)
    .flatMap((d) => ENERGISING_ENVIRONMENTS[d].slice(0, 2));

  // Draining environments — low domains + drain answers
  const drainingEnvironments = lowDomains
    .slice(0, 2)
    .flatMap((d) => DRAINING_ENVIRONMENTS[d].slice(0, 1));

  // Sectors — top 3 domains, deduplicated
  const sectorSet = new Set<string>();
  topDomains.slice(0, 3).forEach((d) => {
    SECTORS_BY_DOMAIN[d].forEach((s) => sectorSet.add(s));
  });
  const sectors = Array.from(sectorSet).slice(0, 8);

  // Language tips — top 2 domains
  const languageTips = topDomains.slice(0, 2).map((d) => LANGUAGE_TIPS[d]);

  // Coaching questions — top 2 domains
  const coachingQuestions = topDomains
    .slice(0, 2)
    .flatMap((d) => COACHING_QUESTIONS[d]);

  // Summary sentence
  const topLabel = domainScores.find((s) => s.domain === topDomains[0])?.label;
  const secondLabel = domainScores.find((s) => s.domain === topDomains[1])?.label;
  const summary = `Your answers suggest your strongest patterns are in ${topLabel} and ${secondLabel}. These are not personality types — they are tendencies observed across your responses. Use this as a starting point for reflection or coaching, not a fixed conclusion.`;

  return {
    domainScores,
    topDomains,
    lowDomains,
    answers,
    patterns,
    capabilities,
    energisingEnvironments,
    drainingEnvironments,
    sectors,
    languageTips,
    coachingQuestions,
    summary,
  };
}

export function formatReportAsText(report: ReportData): string {
  const lines: string[] = [
    "THE PRESCRIPTION — CAREER TRANSLATION DIAGNOSTIC",
    "=".repeat(50),
    "",
    "WHAT YOUR ANSWERS SUGGEST",
    "-".repeat(30),
    ...report.patterns,
    "",
    report.summary,
    "",
    "TRANSFERABLE CAPABILITIES YOU MAY BE UNDERESTIMATING",
    "-".repeat(30),
    ...report.capabilities.map((c) => `• ${c}`),
    "",
    "WORK ENVIRONMENTS LIKELY TO ENERGISE YOU",
    "-".repeat(30),
    ...report.energisingEnvironments.map((e) => `• ${e}`),
    "",
    "WORK ENVIRONMENTS LIKELY TO DRAIN YOU",
    "-".repeat(30),
    ...report.drainingEnvironments.map((e) => `• ${e}`),
    "",
    "SECTORS AND ROLE FAMILIES WORTH EXPLORING",
    "-".repeat(30),
    ...report.sectors.map((s) => `• ${s}`),
    "",
    "HOW TO TALK ABOUT YOUR NHS EXPERIENCE OUTSIDE THE NHS",
    "-".repeat(30),
    ...report.languageTips,
    "",
    "COACHING QUESTIONS TO REFLECT ON NEXT",
    "-".repeat(30),
    ...report.coachingQuestions.map((q) => `• ${q}`),
    "",
    "=".repeat(50),
    "DISCLAIMER",
    "This is a reflective tool, not career advice. It does not tell you what job to do, who to work for, or what your personality type is. Use it as a prompt for your own thinking, or as a starting point for a coaching conversation.",
    "",
    "The Prescription — Clarity in complexity",
    "theprescription.co.uk",
  ];

  return lines.join("\n");
}
