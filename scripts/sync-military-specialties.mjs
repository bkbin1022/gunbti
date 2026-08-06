import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
const endpoint = "https://apis.data.go.kr/1300000/gsTgMastr/list/gsTgMastr/list";
const rawServiceKey = process.env.MILITARY_KEY;
const serviceKey = rawServiceKey ? decodeURIComponent(rawServiceKey) : "";
if (!serviceKey) throw new Error("MILITARY_KEY가 없습니다. .env.local에 넣은 뒤 다시 실행하세요.");
async function fetchPage(pageNo) {
  const url = new URL(endpoint);
  url.search = new URLSearchParams({ ServiceKey: serviceKey, numOfRows: "100", pageNo: String(pageNo), type: "json" }).toString();
  const response = await fetch(url);
  if (!response.ok) throw new Error("병무청 API 요청 실패: HTTP " + response.status);
  const payload = await response.json();
  if (process.env.MMA_DEBUG === "1" && pageNo === 1) {
    console.log(JSON.stringify(payload, null, 2));
  }
  const body = payload?.response?.body ?? payload?.body ?? payload;
  const header = payload?.response?.header ?? payload?.header;
  if (header?.resultCode && header.resultCode !== "00") throw new Error("병무청 API 오류: " + header.resultMsg);
  const rawItems = body?.items?.item ?? body?.items ?? [];
  return { items: Array.isArray(rawItems) ? rawItems : [rawItems], totalCount: Number(body?.totalCount ?? payload?.totalCount ?? 0) };
}
const first = await fetchPage(1); const pages = Math.max(1, Math.ceil(first.totalCount / 100)); const records = [...first.items];
for (let page = 2; page <= pages; page += 1) { const next = await fetchPage(page); records.push(...next.items); }
const officialMaster = records.filter(Boolean).map((item) => ({ id: "mma-" + item.mbteukgiNo, specialtyCode: item.gsteukgiCd || undefined, officialName: item.gsteukgiNm || "이름 미확인", branch: item.gunGbnm || "군 구분 미확인", recruitmentCategory: item.mjgubNm || item.mjbgteukgiNm || undefined, recruitmentCode: item.mjgbCd || item.mjbgteukgiCd || undefined, recruitmentSchedule: { year: item.mojipYy || undefined, round: item.mojipTms || undefined, plannedStartMonth: item.iyyjsijakYm || undefined, plannedEndMonth: item.iyyjjongryoYm || undefined }, source: { authority: "official", label: "병무청 군사특기마스터 OpenAPI", endpoint, retrievedAt: new Date().toISOString() } }));
const outputDirectory = join(process.cwd(), "data", "military", "generated");
await mkdir(outputDirectory, { recursive: true });
await writeFile(join(outputDirectory, "official-specialty-master.json"), JSON.stringify({ sourceVersion: "MMA_OPENAPI_0004", retrievedAt: new Date().toISOString(), totalCount: officialMaster.length, records: officialMaster }, null, 2) + "\n", "utf8");
console.log("병무청 공식 특기 마스터 " + officialMaster.length + "건을 저장했습니다.");
