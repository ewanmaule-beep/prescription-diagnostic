import { Question } from "@/types";

export const questions: Question[] = [
  // DOMAIN 1: Judgement when there is no obvious answer
  {
    id: "q1",
    domain: "judgement",
    type: "multi",
    text: "In your work, which of these situations come up regularly?",
    subtext: "Select all that apply.",
    options: [
      { value: "guidance_fit", label: "Deciding what to do when the guidance does not quite fit", scores: { judgement: 1 } },
      { value: "weigh_risk", label: "Weighing up risk when the evidence points in different directions", scores: { judgement: 1 } },
      { value: "take_responsibility", label: "Taking responsibility for a decision where there is no perfect answer", scores: { judgement: 1 } },
      { value: "pause_check", label: "Knowing when to pause, check, or gather more information", scores: { judgement: 1 } },
      { value: "adapt_practice", label: "Adapting normal practice for an unusual patient, service, or situation", scores: { judgement: 1 } },
      { value: "challenge_plan", label: "Challenging a plan because something about it does not feel safe or sensible", scores: { judgement: 1 } },
    ],
    required: true,
  },
  {
    id: "q2",
    domain: "judgement",
    type: "rating",
    text: "How often do you have to make professional decisions where the answer is not already written down?",
    ratingLabels: {
      low: "Not often. Most of my work follows clear guidance.",
      high: "Very often. I regularly deal with situations where judgement matters more than the rulebook.",
    },
    required: true,
  },
  {
    id: "q3",
    domain: "judgement",
    type: "text",
    text: "Think of a recent decision where the evidence, guidance, or situation was unclear. What did you decide, and what were you balancing?",
    subtext: "A few sentences is fine. Optional, but your answer will appear in your report.",
    required: false,
  },

  // DOMAIN 2: Explaining complex things clearly
  {
    id: "q4",
    domain: "translation",
    type: "multi",
    text: "Who do you regularly need to explain things to?",
    subtext: "Select all that apply.",
    options: [
      { value: "patients_simple", label: "Patients who need things explained simply and clearly", scores: { translation: 1 } },
      { value: "patients_complex", label: "Patients with several conditions or complicated treatment plans", scores: { translation: 1 } },
      { value: "clinicians", label: "Doctors, nurses, AHPs, or other non-pharmacy clinicians", scores: { translation: 1 } },
      { value: "managers", label: "Managers, commissioners, finance colleagues, or operational leads", scores: { translation: 1 } },
      { value: "senior_leaders", label: "Senior leaders, committees, or boards", scores: { translation: 1 } },
      { value: "pharmacy_peers", label: "Other pharmacy professionals", scores: { translation: 1 } },
    ],
    required: true,
  },
  {
    id: "q5",
    domain: "translation",
    type: "rating",
    text: "How often do you need to turn specialist pharmacy knowledge into language other people can use?",
    ratingLabels: {
      low: "Rarely. Most of my communication is with pharmacy colleagues.",
      high: "Constantly. A big part of my role is helping other people understand what matters and what to do next.",
    },
    required: true,
  },

  // DOMAIN 3: Influencing people you do not manage
  {
    id: "q6",
    domain: "influence",
    type: "multi",
    text: "When you need someone to do something, but you are not their manager, what do you usually do?",
    subtext: "Select all that apply.",
    options: [
      { value: "relationship", label: "Build the relationship first, then ask when the time is right", scores: { influence: 1 } },
      { value: "evidence", label: "Use evidence and data to make the case", scores: { influence: 1 } },
      { value: "framing", label: "Frame the issue so the right next step feels obvious", scores: { influence: 1 } },
      { value: "convene", label: "Bring the right people together and build agreement", scores: { influence: 1 } },
      { value: "persistent", label: "Keep nudging, persuading, and following up quietly", scores: { influence: 1 } },
      { value: "via_authority", label: "Work through someone with more formal authority", scores: { influence: 1 } },
    ],
    required: true,
  },
  {
    id: "q7",
    domain: "influence",
    type: "rating",
    text: "How much of your work depends on getting people on board when they do not report to you?",
    ratingLabels: {
      low: "Not much. I mostly work within my own team or line management structure.",
      high: "A lot. Most of my work depends on influencing across teams, organisations, or professions.",
    },
    required: true,
  },
  {
    id: "q8",
    domain: "influence",
    type: "text",
    text: "Tell us about a time you helped people with different views get to a workable answer.",
    subtext: "A few sentences is fine. Optional, but your answer will appear in your report.",
    required: false,
  },

  // DOMAIN 4: Making things happen
  {
    id: "q9",
    domain: "delivery",
    type: "multi",
    text: "Which of these are you regularly responsible for?",
    subtext: "Select all that apply.",
    options: [
      { value: "project_lead", label: "Taking a project from idea to delivery", scores: { delivery: 1 } },
      { value: "change_service", label: "Changing how a service, pathway, or process works", scores: { delivery: 1 } },
      { value: "multiple_work", label: "Managing several pieces of work at the same time", scores: { delivery: 1 } },
      { value: "deadlines", label: "Delivering against deadlines when there is pressure", scores: { delivery: 1 } },
      { value: "coordinate", label: "Coordinating work across different teams", scores: { delivery: 1 } },
      { value: "track_report", label: "Tracking progress and keeping others sighted", scores: { delivery: 1 } },
    ],
    required: true,
  },
  {
    id: "q10",
    domain: "delivery",
    type: "rating",
    text: "How often are you the person who turns an idea, plan, or strategy into something that actually works?",
    ratingLabels: {
      low: "Rarely. My role is more focused on advice, thinking, or input.",
      high: "Often. I am usually involved in making the change happen in practice.",
    },
    required: true,
  },

  // DOMAIN 5: Seeing the system, not just the task
  {
    id: "q11",
    domain: "systems",
    type: "multi",
    text: "Which of these are part of your work?",
    subtext: "Select all that apply.",
    options: [
      { value: "redesign", label: "Designing or redesigning a service, pathway, or process", scores: { systems: 1 } },
      { value: "audit", label: "Running audits and using the findings to change practice", scores: { systems: 1 } },
      { value: "incidents", label: "Looking into incidents, errors, or near misses", scores: { systems: 1 } },
      { value: "controls", label: "Putting controls in place so problems are less likely to happen again", scores: { systems: 1 } },
      { value: "patterns", label: "Spotting patterns across cases, services, or teams", scores: { systems: 1 } },
      { value: "policy", label: "Writing or reviewing policies, procedures, or guidance", scores: { systems: 1 } },
    ],
    required: true,
  },
  {
    id: "q12",
    domain: "systems",
    type: "rating",
    text: "How often do you notice that an individual issue is really a sign of a wider system problem?",
    ratingLabels: {
      low: "Rarely. I usually focus on the immediate issue in front of me.",
      high: "Often. I tend to spot the wider pattern behind individual cases.",
    },
    required: true,
  },

  // DOMAIN 6: Helping other people develop
  {
    id: "q13",
    domain: "development",
    type: "multi",
    text: "Which of these do you do regularly?",
    subtext: "Select all that apply.",
    options: [
      { value: "teach", label: "Teach pharmacy, clinical, or wider professional colleagues", scores: { development: 1 } },
      { value: "supervise", label: "Supervise trainees, foundation pharmacists, apprentices, or students", scores: { development: 1 } },
      { value: "mentor", label: "Mentor or coach colleagues", scores: { development: 1 } },
      { value: "design_learning", label: "Design learning materials, assessments, or teaching sessions", scores: { development: 1 } },
      { value: "support_difficult", label: "Support people through difficult professional situations", scores: { development: 1 } },
      { value: "model", label: "Show others how to do something by modelling good practice", scores: { development: 1 } },
    ],
    required: true,
  },
  {
    id: "q14",
    domain: "development",
    type: "rating",
    text: "How often do other people learn from you, formally or informally?",
    ratingLabels: {
      low: "Rarely. I am mostly developing my own skills.",
      high: "Often. Other people regularly come to me to learn, reflect, or improve.",
    },
    required: true,
  },

  // DOMAIN 7: Making sense of evidence and data
  {
    id: "q15",
    domain: "data",
    type: "multi",
    text: "Which of these do you regularly do?",
    subtext: "Select all that apply.",
    options: [
      { value: "clinical_evidence", label: "Use clinical evidence to inform practice", scores: { data: 1 } },
      { value: "analyse_data", label: "Analyse prescribing, activity, performance, or service data", scores: { data: 1 } },
      { value: "read_research", label: "Read research critically", scores: { data: 1 } },
      { value: "produce_reports", label: "Produce audits, reports, or papers using numbers or evidence", scores: { data: 1 } },
      { value: "spot_trends", label: "Spot trends, variation, or outliers in data", scores: { data: 1 } },
      { value: "data_to_action", label: "Turn data or evidence into a recommendation", scores: { data: 1 } },
    ],
    required: true,
  },
  {
    id: "q16",
    domain: "data",
    type: "rating",
    text: "How confident are you working with research evidence, numbers, or data?",
    ratingLabels: {
      low: "Not very confident. I usually need support from others.",
      high: "Very confident. I am often the person others ask to interpret it.",
    },
    required: true,
  },
  {
    id: "q17",
    domain: "data",
    type: "single",
    text: "When someone gives you a dataset, report, or evidence summary, what do you usually do first?",
    options: [
      { value: "main_finding", label: "Look for the main finding and what action it points to", scores: { data: 2 } },
      { value: "whats_missing", label: "Look for what is missing, unclear, or not being said", scores: { data: 2 } },
      { value: "explain", label: "Think about how to explain it to the people who need to act", scores: { data: 1, translation: 1 } },
      { value: "methodology", label: "Check how the evidence or data was produced before trusting it", scores: { data: 2 } },
      { value: "compare", label: "Compare it with other evidence, experience, or context", scores: { data: 2 } },
    ],
    required: true,
  },

  // DOMAIN 8: Running services well
  {
    id: "q18",
    domain: "operations",
    type: "multi",
    text: "Which of these are part of your role?",
    subtext: "Select all that apply.",
    options: [
      { value: "run_service", label: "Running a clinical or operational service day to day", scores: { operations: 1 } },
      { value: "rotas_staffing", label: "Managing rotas, staffing, capacity, or workload", scores: { operations: 1 } },
      { value: "procurement", label: "Managing procurement, stock, resources, or budgets", scores: { operations: 1 } },
      { value: "performance", label: "Reporting on service performance", scores: { operations: 1 } },
      { value: "standards", label: "Setting standards and checking they are being met", scores: { operations: 1 } },
      { value: "fix_issues", label: "Sorting operational problems as they arise", scores: { operations: 1 } },
    ],
    required: true,
  },
  {
    id: "q19",
    domain: "operations",
    type: "rating",
    text: "How much of your role is about keeping services running well, rather than mainly doing projects or strategy?",
    ratingLabels: {
      low: "Very little. My work is mostly project, advisory, or strategic.",
      high: "A lot. My role is mainly about reliable day-to-day delivery.",
    },
    required: true,
  },
  {
    id: "q20",
    domain: "operations",
    type: "single",
    text: "In your work, what does a well-run service look like?",
    subtext: "Several may apply — choose the one that matters most to you.",
    options: [
      { value: "reliable", label: "Things run reliably and important tasks do not fall through the gaps", scores: { operations: 2 } },
      { value: "right_time", label: "Patients get what they need at the right time", scores: { operations: 2 } },
      { value: "absorb", label: "The team can cope when something unexpected happens", scores: { operations: 2 } },
      { value: "quality", label: "Targets are met without cutting corners on quality", scores: { operations: 2 } },
      { value: "embedded", label: "Improvements become part of normal working, not just a temporary fix", scores: { operations: 2, systems: 1 } },
    ],
    required: true,
  },
];

export const domainLabels: Record<string, string> = {
  judgement: "Judgement when there is no obvious answer",
  translation: "Explaining complex things clearly",
  influence: "Influencing people you do not manage",
  delivery: "Making things happen",
  systems: "Seeing the system, not just the task",
  development: "Helping other people develop",
  data: "Making sense of evidence and data",
  operations: "Running services well",
};

export const domainDescriptors: Record<string, string> = {
  judgement: "Higher = you regularly make professional calls where the right answer isn't already written down.",
  translation: "Higher = a strong pattern of turning specialist knowledge into language other people can use.",
  influence: "Higher = you rely on relationships and framing rather than formal authority to get things done.",
  delivery: "Higher = you are typically the one who turns ideas and plans into something that actually works.",
  systems: "Higher = you spot the wider pattern behind individual cases and design for it.",
  development: "Higher = other people regularly learn from you, formally or informally.",
  data: "Higher = you are comfortable interpreting evidence, numbers, and data, and turning them into decisions.",
  operations: "Higher = a strong pattern of keeping services running reliably day to day.",
};
