import type { MetadataRoute } from "next";
import { militaryJobs } from "@/data/jobs";
const base = "https://gunbti.vercel.app";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/test", "/jobs"].map((path) => ({ url: base + path, lastModified: new Date() })).concat(militaryJobs.map((job) => ({ url: base + "/jobs/" + job.slug, lastModified: new Date(job.updatedAt) }))); }
