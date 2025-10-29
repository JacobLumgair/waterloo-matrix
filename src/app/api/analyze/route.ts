import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { EDS_OBJECTIVES, STRATEGIC_PLAN_OBJECTIVES } from "@/lib/objectives";

export const runtime = "nodejs";

async function parsePdfToText(buf: Buffer): Promise<string> {
  const mod = await import("pdf-parse");
  const pdfParse: any = (mod as any).default ?? mod;
  const parsed = await pdfParse(buf);
  return parsed?.text ?? "";
}

const SYSTEM = `
You are a municipal strategy analyst.
Score alignment of a document against two objective lists:
(A) EDS objectives (rows) and (B) Strategic Plan objectives (columns).
Use a conservative 0–3 scale: 0 none, 1 light, 2 moderate, 3 strong.
Output valid JSON only.
`.trim();

function prompt(doc: string) {
  const eds = EDS_OBJECTIVES.map(o => `- [${o.id}] ${o.title}: ${o.compact}`).join("\n");
  const sp  = STRATEGIC_PLAN_OBJECTIVES.map(o => `- [${o.id}] ${o.title}: ${o.compact}`).join("\n");
  return `
DOCUMENT:
${doc.slice(0, 8000)}

EDS OBJECTIVES (rows):
${eds}

SP OBJECTIVES (columns):
${sp}

Return strict JSON:
{
  "row_scores": { "EDS-1": 0|1|2|3, ... },
  "col_scores": { "SP5-1": 0|1|2|3, ... },
  "top_cells": [
    { "row": "EDS-5", "col": "SP5-1", "why": "≤40 words", "confidence": 0.0-1.0 }
  ],
  "analysis": "≤180 words"
}
`.trim();
}

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const ct = req.headers.get("content-type") || "";
  const isMultipart = ct.includes("multipart/form-data");

  let text = "";

  if (isMultipart) {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const pasted = form.get("text") as string | null;

    if (file) {
      const buf = Buffer.from(await file.arrayBuffer());
      text = await parsePdfToText(buf);
    } else {
      text = pasted || "";
    }
  } else {
    const body = await req.json().catch(() => ({}));
    text = String(body?.text || "");
  }

  if (!text) {
    return NextResponse.json({ error: "Provide text or upload a PDF" }, { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: prompt(text) },
    ],
  });

  let json: any = {};
  try {
    json = JSON.parse(completion.choices[0].message.content || "{}");
  } catch {
    return NextResponse.json({ error: "Invalid JSON from model" }, { status: 502 });
  }

  // Full cell heatmap: conservative combine = min(row, col)
  const rowScores: Record<string, number> = json.row_scores || {};
  const colScores: Record<string, number> = json.col_scores || {};
  const alignment: Record<string, number> = {}; // e.g., "EDS-5|SP5-1": 0..3

  for (const r of EDS_OBJECTIVES) {
    const rKey = r.id; // already like "EDS-5"
    const rScore = Number(rowScores[rKey] ?? 0);
    for (const c of STRATEGIC_PLAN_OBJECTIVES) {
      const cKey = c.id; // e.g., "SP5-1"
      const cScore = Number(colScores[cKey] ?? 0);
      alignment[`${rKey}|${cKey}`] = Math.min(rScore, cScore);
    }
  }

  return NextResponse.json({ ...json, alignment });
}
