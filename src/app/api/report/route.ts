import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

// Extract text from PDF or Word file. Returns empty string if unsupported or empty.
async function extractCvText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    if (file.type === "application/pdf") {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      return data.text ?? "";
    }
    if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return result.value ?? "";
    }
  } catch (err) {
    console.error("CV text extraction failed:", err);
  }

  return "";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const answersRaw = formData.get("answers") as string;
    const reportRaw = formData.get("baseReport") as string;
    const cvFile = formData.get("cv") as File | null;
    const careerContextRaw = formData.get("careerContext") as string | null;

    if (!answersRaw || !reportRaw) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Parse optional career context
    let careerContextLines = "";
    if (careerContextRaw) {
      try {
        const ctx = JSON.parse(careerContextRaw) as {
          jobTitle?: string;
        };
        if (ctx.jobTitle) {
          careerContextLines = `\n\nUSER-PROVIDED CONTEXT:\n- Current job title: ${ctx.jobTitle}`;
        }
      } catch {
        // ignore malformed context
      }
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured." }, { status: 500 });
    }

    const client = new OpenAI({ apiKey });

    // Extract CV text if provided
    let cvContext = "";
    if (cvFile) {
      const rawText = await extractCvText(cvFile);
      if (rawText.trim().length > 0) {
        // Cap raw text to keep token usage sensible
        const capped = rawText.length > 8000 ? rawText.slice(0, 8000) + "\n[...truncated]" : rawText;

        const extraction = await client.chat.completions.create({
          model: "gpt-4o",
          max_tokens: 1500,
          messages: [
            {
              role: "user",
              content: `Extract and summarise the following from this CV text. Be concise.

1. Professional qualifications and registrations (especially: independent prescriber status, advanced clinical practice, Royal College membership, academic degrees, teaching qualifications)
2. Current and most recent roles — job title, organisation type, seniority level
3. Career trajectory — approximate years in NHS, any experience outside NHS
4. Key responsibilities that suggest transferable skills (e.g. budget management, commissioning, leadership, education, research, policy)
5. Any notable achievements or projects

Do not reproduce the full CV. Extract only the above. Plain text, no formatting.

CV TEXT:
${capped}`,
            },
          ],
        });

        cvContext = extraction.choices[0]?.message?.content ?? "";
      } else {
        console.warn("CV uploaded but no text could be extracted. File type:", cvFile.type);
      }
    }

    const baseReport = JSON.parse(reportRaw);

    const systemPrompt = `You are a skills translator with deep knowledge of UK pharmacy and the NHS. You help pharmacy professionals see and articulate the transferable value of what they already do.

PURPOSE OF THIS TOOL:
This is a skills translator. It is NOT a job recommender, a career planner, or a personality test. Your job is to help the user see their own skills more clearly and give them language to talk about those skills outside their current context.

USER PROFILE — ASSUME UNLESS THE CV SAYS OTHERWISE:
- All users are qualified pharmacy professionals (registered pharmacists or pharmacy technicians, typically pharmacists). Treat pharmacy training as a baseline, not a question mark.
- Most are mid-to-senior career, not entry-level.
- Many will hold or be working toward additional qualifications: Independent Prescriber (IP), advanced clinical practice, postgraduate clinical qualifications.

WHAT TO PRODUCE:
- "patterns": 2 short paragraphs reflecting back what the user's strongest skill patterns suggest. Specific, not generic. Drawn from the questionnaire answers and (if present) the CV and free-text answers.
- "capabilities": 5 to 6 transferable capabilities the user may be underestimating. Each capability should be 2 to 3 sentences: the capability itself, then a sentence on what it looks like in practice or how it is described outside NHS pharmacy. Where the user has provided free-text answers or a CV, ground the capability text in something specific from them.
- "languageBanks": 3 language banks, one for each of the user's top three skill patterns. Each bank has a skillName and four phrasings labelled by context — "CV bullet", "LinkedIn one-liner", "In conversation", and "Interview fragment". Each phrasing should sound like a real human sentence the user could use directly. The CV bullet is action-led and specific. The LinkedIn one-liner is short and confident. The "In conversation" phrasing is casual. The "Interview fragment" is the start of a specific story.
- "coachingQuestions": 4 reflective questions for the user to take away. Not assessment questions. Should provoke fresh thinking.
- "summary": 2 to 3 sentences. Specific to this user, not generic.

EVIDENCE TIES (IMPORTANT):
- When the user has provided free-text answers or a CV, weave specific phrases or examples from them into the patterns and capabilities. Use phrases like: "In your own words, you described [X], which is a working example of [capability Y]". This makes the report feel like it actually read them, not generic.
- Do not invent details. Only use what is actually in the user's input.

DO NOT INCLUDE: sector suggestions, role suggestions, employer suggestions, "things to avoid". Those are out of scope for this tool.

TONE:
- Clear, reflective, practical, credible. Never cheesy. Never like a personality quiz.
- Never say "you are a [type]" or use fixed archetypes.
- Never imply certainty about career outcomes.
- Use phrases like: "your answers suggest", "you may be strongest when", "you may be underestimating", "this is not a fixed label".
- Write in UK English.
- Where the CV mentions prescribing status, advanced practice, or specific senior roles, name them explicitly in the capability text.
- Keep the tone adult, grounded, and useful — not motivational.`;

    const userPrompt = `A pharmacy professional has completed The Prescription skills diagnostic. Here is a summary of their results:

DOMAIN SCORES (percentage, higher = stronger pattern in that skill area):
${baseReport.domainScores.map((s: { label: string; percentage: number }) => `- ${s.label}: ${s.percentage}%`).join("\n")}

TOP SKILL PATTERNS: ${baseReport.topDomains.join(", ")}

BASE REPORT PATTERNS IDENTIFIED:
${baseReport.patterns.join("\n")}

${cvContext ? `CV SUMMARY (extracted from uploaded CV):\n${cvContext}` : "No CV was uploaded."}${careerContextLines}

FREE TEXT ANSWERS FROM QUESTIONNAIRE:
${baseReport.answers
  ? Object.entries(baseReport.answers)
      .filter(([, v]) => typeof v === "string" && (v as string).trim().length > 20)
      .map(([k, v]) => `Q${k}: ${v}`)
      .join("\n")
  : "None provided."}

Please generate a personalised version of the skills translation report. Where a CV or free-text answer gives you material, ground the capability and pattern text in something specific from it.

Return your response as a JSON object with exactly these keys:
{
  "summary": "2-3 sentence summary — specific to this user, not generic",
  "patterns": ["pattern 1 — short paragraph", "pattern 2 — short paragraph"],
  "capabilities": ["capability 1 — 2 to 3 sentences", "capability 2 — 2 to 3 sentences", "capability 3", "capability 4", "capability 5"],
  "languageBanks": [
    {
      "skillName": "Name of the skill",
      "phrasings": [
        {"context": "CV bullet", "text": "..."},
        {"context": "LinkedIn one-liner", "text": "..."},
        {"context": "In conversation", "text": "..."},
        {"context": "Interview fragment", "text": "..."}
      ]
    }
    // exactly 3 language banks, one per top skill pattern
  ],
  "coachingQuestions": ["question 1", "question 2", "question 3", "question 4"]
}

Return only valid JSON. No preamble, no markdown, no explanation.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const text = response.choices[0]?.message?.content ?? "{}";
    const finishReason = response.choices[0]?.finish_reason;

    let enhanced;
    try {
      enhanced = JSON.parse(text);
    } catch (parseErr) {
      console.error("Report API JSON parse failed.", {
        finishReason,
        responseLength: text.length,
        responsePreview: text.slice(0, 500),
        responseTail: text.slice(-500),
        parseErr,
      });
      return NextResponse.json(
        { error: "Failed to parse AI response.", finishReason },
        { status: 500 }
      );
    }

    return NextResponse.json({ enhanced, cvUsed: !!cvFile });
  } catch (err) {
    console.error("Report API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate enhanced report.", detail: message },
      { status: 500 }
    );
  }
}
