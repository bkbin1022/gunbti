import { execFile } from "node:child_process";
import { timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const execute = promisify(execFile);

function equalSecrets(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function POST(request: Request) {
  const expected = process.env.SYNC_SPECIALTIES_SECRET;
  const supplied = request.headers.get("x-sync-secret") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !supplied || !equalSecrets(supplied, expected)) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (process.env.ENABLE_FILE_SYNC_API !== "true") return NextResponse.json({ error: "SYNC_TRIGGER_DISABLED" }, { status: 503 });
  try {
    const { stdout } = await execute(process.execPath, ["--env-file=.env.local", "scripts/sync-military-specialties.mjs"], { cwd: process.cwd(), timeout: 10 * 60 * 1000, windowsHide: true, env: process.env, maxBuffer: 1024 * 1024 });
    return NextResponse.json({ status: "completed", summary: stdout.trim().slice(-8000) });
  } catch {
    return NextResponse.json({ error: "SYNC_FAILED" }, { status: 502 });
  }
}
