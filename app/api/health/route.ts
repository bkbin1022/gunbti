import { NextResponse } from "next/server";
import { getDataFreshness } from "@/lib/data-freshness";
import { getActiveOfficialSpecialties } from "@/lib/official-specialty-store";

export async function GET() {
  const officialSpecialties = await getActiveOfficialSpecialties();
  const lastSuccessfulSyncAt = officialSpecialties[0]?.source.retrievedAt;
  const dataFreshness = getDataFreshness(lastSuccessfulSyncAt);
  return NextResponse.json({ status: dataFreshness === "stale" || dataFreshness === "unknown" ? "degraded" : "ok", activeSnapshotAvailable: officialSpecialties.length > 0, lastSuccessfulSyncAt, dataFreshness });
}
