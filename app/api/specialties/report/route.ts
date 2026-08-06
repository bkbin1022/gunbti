import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

const categories = new Set(["incorrectName", "outdatedRecruitmentStatus", "incorrectRequirement", "incorrectDescription", "brokenSource", "other"]);
const attempts = new Map<string, number[]>();
const sensitiveTerms = ["부대 위치", "작전", "근무 일정", "인원 현황"];

function allowedUrl(value: unknown) {
  if (value === undefined || value === "") return true;
  if (typeof value !== "string") return false;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length >= 3) return NextResponse.json({ error: "TOO_MANY_REPORTS" }, { status: 429 });
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "INVALID_REPORT" }, { status: 400 });
  const value = body as Record<string, unknown>;
  const message = value.message;
  if (typeof value.website === "string" && value.website.trim()) return NextResponse.json({ error: "INVALID_REPORT" }, { status: 400 });
  if (typeof value.specialtyId !== "string" || typeof message !== "string" || !categories.has(String(value.category)) || !message.trim() || message.length > 1000 || !allowedUrl(value.sourceUrl)) return NextResponse.json({ error: "INVALID_REPORT" }, { status: 400 });
  if (sensitiveTerms.some((term) => message.includes(term))) return NextResponse.json({ error: "PUBLIC_INFO_ONLY" }, { status: 400 });
  attempts.set(ip, [...recent, now]);
  const report = { specialtyId: value.specialtyId, category: value.category, message: message.trim(), sourceUrl: value.sourceUrl || undefined, pageUrl: typeof value.pageUrl === "string" ? value.pageUrl : undefined, dataVersion: typeof value.dataVersion === "string" ? value.dataVersion : undefined, createdAt: new Date().toISOString() };
  try {
    const directory = join(process.cwd(), "data", "reports");
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, `${Date.now()}-${crypto.randomUUID()}.json`), JSON.stringify(report, null, 2), "utf8");
    return NextResponse.json({ accepted: true }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "REPORT_STORAGE_UNAVAILABLE" }, { status: 503 });
  }
}
