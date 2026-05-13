import { Answers, Domain, LanguageBank, ReportData } from "@/types";
import { calculateDomainScores, getTopDomains, getLowDomains } from "./scoring";
import { domainLabels } from "@/data/questions";

// Pattern text by domain — what the user's strong pattern suggests about how they work
const PATTERNS: Record<Domain, string[]> = {
  judgement: [
    "Your answers suggest you regularly make professional decisions in territory the guidance does not cover. You may have built a confidence in your own judgement that is hard to see in a job description.",
    "You appear to be comfortable taking responsibility when the answer is not pre-written. That ability to act well under uncertainty is rarer than most pharmacy roles credit.",
  ],
  translation: [
    "Your answers suggest you spend much of your work turning specialist information into something other people can use. That capability is often invisible in pharmacy job descriptions.",
    "You appear to adapt your communication across very different audiences. That is harder than it sounds, and it travels well into roles beyond clinical practice.",
  ],
  influence: [
    "Your answers suggest much of your real work happens through relationships rather than authority. You may have built influence that is harder to put on a CV than a job title.",
    "You appear to operate effectively across professional and organisational boundaries. Bringing people with you without hierarchy is a leadership skill, even when it is not framed that way.",
  ],
  delivery: [
    "Your answers suggest you get energy from finishing things. In organisations that struggle to convert good thinking into action, that is an asset, not a default.",
    "You appear to be the person who takes plans and turns them into something that actually works. That is a different skill from designing the plan in the first place.",
  ],
  systems: [
    "Your answers suggest you tend to spot the wider pattern behind individual cases. Most colleagues respond to what is in front of them. You may be designing for what comes next.",
    "You appear to think in systems rather than tasks. That is the foundation of quality improvement, service redesign, and governance work, even if you do not call it that.",
  ],
  development: [
    "Your answers suggest people regularly learn from you, often without you noticing. Quiet development of others is one of the most under-recognised forms of leadership in NHS pharmacy.",
    "You appear to take responsibility for how others around you grow. That builds organisational capability over time and translates well into education, leadership, and operational roles.",
  ],
  data: [
    "Your answers suggest you can interpret evidence and data and turn it into something useful. Many pharmacy professionals undersell this. It is more transferable than 'pharmacy knowledge' alone.",
    "You appear to be the person others ask when the numbers need a careful read. That capability translates directly into commissioning, market access, research, and policy work.",
  ],
  operations: [
    "Your answers suggest your role is largely about keeping services running reliably. That work is often invisible until it stops, and people who can do it consistently are harder to find than the system credits.",
    "You appear to think operationally as well as clinically. The combination of clinical credibility and operational competence is rare and highly valued outside the immediate NHS context.",
  ],
};

// Capabilities now expanded with context — what each capability looks like and why it matters
const CAPABILITIES: Record<Domain, string[]> = {
  judgement: [
    "Making well-judged decisions when guidance is incomplete, contested, or absent. Outside NHS pharmacy this is described as 'professional judgement under uncertainty' — a quality regulators, commissioners, and clinical leadership functions actively look for.",
    "Weighing competing risks and being able to explain the reasoning afterwards. The 'showing your working' part is what separates this from intuition, and it is what makes you credible to people who were not in the room.",
    "Knowing when to act and when to hold for more information. In pharmacy this looks like everyday clinical practice. In other contexts it is strategic patience — a recognised leadership capability.",
  ],
  translation: [
    "Turning specialist information into language different audiences can actually use. This is one of the most valuable transferable capabilities in pharmacy, and one of the most consistently underclaimed.",
    "Reading what an audience needs and adjusting depth, language, and emphasis accordingly. In policy, commissioning, or commercial settings this is described as 'stakeholder communication' — a senior-level skill.",
    "Briefing senior decision-makers so they can act with confidence. The work is often invisible. People only notice if they are missing something or got something wrong.",
  ],
  influence: [
    "Getting cross-professional or cross-organisational work moving when no one is in charge of everything. Outside pharmacy this is described as 'cross-functional leadership' or 'system leadership'.",
    "Building trust with people whose priorities, language, or incentives differ from yours. Most professionals do not develop this until much later in their careers.",
    "Holding difficult conversations with senior people in a way that keeps the relationship intact. In commercial or political contexts this is called 'speaking truth to power' — rare enough to be highly valued.",
  ],
  delivery: [
    "Turning a strategy, plan, or idea into something that runs in the real world. Many organisations are good at thinking and poor at delivery. This is the gap you close.",
    "Holding momentum on work that crosses teams or organisations. Without this, complex change initiatives stall — which is why programme leadership roles exist as their own discipline.",
    "Knowing what 'finished' looks like and holding people to it without breaking the relationship. That is craft, not management theory.",
  ],
  systems: [
    "Spotting patterns across cases or incidents that point to a wider system issue. In quality improvement, governance, and patient safety, this is the foundation skill.",
    "Designing controls, processes, or pathways that prevent problems rather than catch them late. Most NHS work fixes individual issues. Systems thinking changes the conditions.",
    "Translating individual cases into improvements that change practice for everyone. Outside the NHS this looks like organisational design or operational excellence.",
  ],
  development: [
    "Developing the capability of trainees, juniors, and peers through teaching, supervision, and modelling. This is leadership work even when it does not have 'leader' in the title.",
    "Supporting colleagues through difficult professional situations without losing your own footing. Hard to teach. Easy to undervalue.",
    "Designing learning that actually changes practice, not just learning that fills a session. Most training fills time. Yours seems to land.",
  ],
  data: [
    "Interpreting clinical evidence, prescribing data, or service activity data with rigour. In commissioning, market access, and policy roles this is core — and pharmacy professionals often have more of this than they credit themselves for.",
    "Spotting trends, outliers, or what the data is not saying. Many roles produce data. Fewer can read it.",
    "Turning data into a decision or recommendation people can act on. The bridge from analysis to action — usually missing from teams that 'have lots of data but no insight'.",
  ],
  operations: [
    "Keeping a clinical or operational service running reliably under shifting demand. Almost everyone takes this for granted until it fails.",
    "Managing rotas, capacity, resources, and budgets so the team can actually do the work. In other sectors this is described as 'operational leadership' — a well-paid function.",
    "Setting standards and holding the line on quality when operational pressure is high. This is the work that prevents drift, and it is surprisingly rare to find consistently.",
  ],
};

// Translation bank — four context-specific phrasings per domain
const LANGUAGE_BANKS: Record<Domain, LanguageBank> = {
  judgement: {
    skillName: "Judgement when there is no obvious answer",
    phrasings: [
      { context: "CV bullet", text: "Routinely make professional decisions in territory the guidance does not directly cover, with clear reasoning that stands up to scrutiny." },
      { context: "LinkedIn one-liner", text: "I work in clinical and organisational territory where the rulebook only takes you so far." },
      { context: "In conversation", text: "Quite a lot of my work involves making the judgement call when the answer is not pre-written." },
      { context: "Interview fragment", text: "A recent example would be a situation where there was no clear guidance. What I weighed was..." },
    ],
  },
  translation: {
    skillName: "Explaining complex things clearly",
    phrasings: [
      { context: "CV bullet", text: "Translate complex clinical and medicines information into language that clinicians, commissioners, and senior leaders can act on." },
      { context: "LinkedIn one-liner", text: "I turn specialist information into something other people can actually use." },
      { context: "In conversation", text: "A lot of what I do is helping non-pharmacy people understand what matters and what to do next." },
      { context: "Interview fragment", text: "When I am explaining something specialist to a board or to a non-clinical manager, what I tend to do is..." },
    ],
  },
  influence: {
    skillName: "Influencing people you do not manage",
    phrasings: [
      { context: "CV bullet", text: "Lead cross-organisational and cross-professional work that depends on building agreement with people I do not manage." },
      { context: "LinkedIn one-liner", text: "Most of what I get done depends on people choosing to come with me, not on authority." },
      { context: "In conversation", text: "I work across a lot of organisational and professional boundaries, so building trust is half the job." },
      { context: "Interview fragment", text: "There was a piece of work that needed the GPs, the commissioners, and the hospital teams to agree. What I did was..." },
    ],
  },
  delivery: {
    skillName: "Making things happen",
    phrasings: [
      { context: "CV bullet", text: "Take strategies, plans, and proposals through to delivered services and changed practice on the ground." },
      { context: "LinkedIn one-liner", text: "I am typically the person who turns plans into working reality." },
      { context: "In conversation", text: "My role is essentially making sure the thing actually happens, not just that it has been agreed." },
      { context: "Interview fragment", text: "When I was leading [project], the gap was between agreement and delivery. What I did was..." },
    ],
  },
  systems: {
    skillName: "Seeing the system, not just the task",
    phrasings: [
      { context: "CV bullet", text: "Spot patterns in clinical and operational data that point to wider system issues, and design responses that prevent recurrence." },
      { context: "LinkedIn one-liner", text: "I tend to see the system behind individual incidents and design accordingly." },
      { context: "In conversation", text: "Where most people see a problem, I am often thinking about what the conditions were that allowed it to happen." },
      { context: "Interview fragment", text: "We had a series of incidents that looked unrelated until I mapped them. What that pointed to was..." },
    ],
  },
  development: {
    skillName: "Helping other people develop",
    phrasings: [
      { context: "CV bullet", text: "Develop the capability of trainees, peers, and clinical staff through teaching, supervision, mentoring, and modelling." },
      { context: "LinkedIn one-liner", text: "People in my orbit tend to get better at their jobs because of how I work with them." },
      { context: "In conversation", text: "I have been involved in how a number of colleagues have grown. That is not in my job title, but it is most of what I am asked to do informally." },
      { context: "Interview fragment", text: "One of the people I supervised went from [start point] to [outcome]. What I did was..." },
    ],
  },
  data: {
    skillName: "Making sense of evidence and data",
    phrasings: [
      { context: "CV bullet", text: "Interpret clinical, prescribing, and service activity data; turn findings into actionable recommendations for clinical and operational decision-makers." },
      { context: "LinkedIn one-liner", text: "I make sense of evidence and data and turn it into decisions." },
      { context: "In conversation", text: "I am comfortable with data, but more importantly I am the person who translates it into what to actually do." },
      { context: "Interview fragment", text: "There was a piece of prescribing data that looked routine until I checked the variation. What I found was..." },
    ],
  },
  operations: {
    skillName: "Running services well",
    phrasings: [
      { context: "CV bullet", text: "Operationally accountable for a clinical service: balancing clinical quality, financial performance, and team capacity day to day." },
      { context: "LinkedIn one-liner", text: "I run a service. Day to day. Reliably, including when it is under pressure." },
      { context: "In conversation", text: "My role is essentially keeping a complex thing running well, which means balancing clinical, financial, and people work continuously." },
      { context: "Interview fragment", text: "When the service hit [pressure point], what I did was reprioritise based on..." },
    ],
  },
};

const COACHING_QUESTIONS: Record<Domain, string[]> = {
  judgement: [
    "What was the last decision you made where the right answer was not already documented? What did you weigh?",
    "Where in your work is your professional judgement most relied on, and where is it most invisible?",
  ],
  translation: [
    "Who relies on you to translate something complex into something usable? What do they get from you that they could not get elsewhere?",
    "When you have had to explain something specialist to a senior or non-clinical audience, what made it land?",
  ],
  influence: [
    "Think of a decision that went the way you wanted in the last year. What did you do to make that happen? Was formal authority involved?",
    "Who in your network depends on you to get something done that they could not get done themselves? Why?",
  ],
  delivery: [
    "What is the last thing you delivered end-to-end that you are proud of? What did it take?",
    "What is currently sitting half-done in your work that you wish was finished? What is in the way?",
  ],
  systems: [
    "Think of a problem you saw repeating across different cases. What did you do with that pattern?",
    "Where in your work are you the person who sees the system, and where are you stuck dealing with individual symptoms?",
  ],
  development: [
    "Who has grown professionally because of something you did? What did you do?",
    "Where in your current role is the development of others valued, and where is it taken for granted?",
  ],
  data: [
    "What is the last piece of data or evidence you turned into a real decision or change? What did you do?",
    "Where in your work is your ability to interpret evidence most useful, and where is it under-used?",
  ],
  operations: [
    "What does your service look like on a quiet day, and what does it look like when it is under pressure? What do you do differently?",
    "Where in your operational work are you most relied on, and where is your contribution invisible until it breaks?",
  ],
};

// Static "what to do with this report" actions
const NEXT_STEPS: string[] = [
  "Pick three lines on your CV or LinkedIn profile and rewrite them using the phrasings above. See if they sound more like you.",
  "Choose one coaching question and bring it into a conversation — a 1-to-1, a peer chat, or a coaching session. Notice what comes up.",
  "Try one of the phrases in a real conversation this week. Pay attention to how it lands, and how it feels saying it.",
];

export function generateReport(answers: Answers): ReportData {
  const domainScores = calculateDomainScores(answers);
  const topDomains = getTopDomains(domainScores, 3);
  const lowDomains = getLowDomains(domainScores, 2);

  // Patterns — top 2 domains, one pattern each
  const patterns = topDomains.slice(0, 2).flatMap((d) => PATTERNS[d].slice(0, 1));

  // Capabilities — top 3 domains, 2 each
  const capabilities = topDomains
    .slice(0, 3)
    .flatMap((d) => CAPABILITIES[d].slice(0, 2));

  // Language banks — top 3 domains
  const languageBanks = topDomains.slice(0, 3).map((d) => LANGUAGE_BANKS[d]);

  // Coaching questions — top 2 domains
  const coachingQuestions = topDomains
    .slice(0, 2)
    .flatMap((d) => COACHING_QUESTIONS[d]);

  // Summary sentence
  const topLabel = domainLabels[topDomains[0]];
  const secondLabel = domainLabels[topDomains[1]];
  const summary = `Your answers suggest your strongest skill patterns are in ${topLabel} and ${secondLabel}. These are not personality types — they are tendencies observed across your responses. Use this as a starting point for articulating what you do, not a fixed conclusion.`;

  return {
    domainScores,
    topDomains,
    lowDomains,
    answers,
    patterns,
    capabilities,
    languageBanks,
    coachingQuestions,
    nextSteps: NEXT_STEPS,
    summary,
  };
}

type EnhancedData = {
  summary?: string;
  patterns?: string[];
  capabilities?: string[];
  languageBanks?: LanguageBank[];
  coachingQuestions?: string[];
};

export function formatReportAsText(report: ReportData, enhanced?: EnhancedData): string {
  const patterns = enhanced?.patterns ?? report.patterns;
  const capabilities = enhanced?.capabilities ?? report.capabilities;
  const languageBanks = enhanced?.languageBanks ?? report.languageBanks;
  const coachingQuestions = enhanced?.coachingQuestions ?? report.coachingQuestions;
  const summary = enhanced?.summary ?? report.summary;

  const languageLines: string[] = [];
  languageBanks.forEach((bank) => {
    languageLines.push("");
    languageLines.push(bank.skillName);
    languageLines.push("-".repeat(Math.max(10, bank.skillName.length)));
    bank.phrasings.forEach((p) => {
      languageLines.push(`${p.context}:`);
      languageLines.push(`  ${p.text}`);
    });
  });

  const lines: string[] = [
    "THE PRESCRIPTION — SKILLS TRANSLATION REPORT",
    "=".repeat(50),
    "",
    "WHAT YOUR ANSWERS SUGGEST",
    "-".repeat(30),
    ...patterns,
    "",
    summary,
    "",
    "TRANSFERABLE CAPABILITIES YOU MAY BE UNDERESTIMATING",
    "-".repeat(30),
    ...capabilities.map((c) => `• ${c}`),
    "",
    "HOW TO TALK ABOUT THESE SKILLS OUTSIDE THE NHS",
    "-".repeat(30),
    ...languageLines,
    "",
    "COACHING QUESTIONS TO REFLECT ON NEXT",
    "-".repeat(30),
    ...coachingQuestions.map((q) => `• ${q}`),
    "",
    "WHAT TO DO WITH THIS REPORT",
    "-".repeat(30),
    ...report.nextSteps.map((s, i) => `${i + 1}. ${s}`),
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
