import type { MetadataRoute } from "next";
import { militaryJobs } from "@/data/jobs";
import { officialSpecialties } from "@/lib/official-specialties";
const base = "https://gunbti.vercel.app";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/test", "/jobs", "/specialties"].map((path) => ({ url: base + path, lastModified: new Date() })).concat(militaryJobs.map((job) => ({ url: base + "/jobs/" + job.slug, lastModified: new Date(job.updatedAt) })), officialSpecialties.map((specialty) => ({ url: base + "/specialties/" + specialty.slug, lastModified: new Date(specialty.source.retrievedAt) }))); }
