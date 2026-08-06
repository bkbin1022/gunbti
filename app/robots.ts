import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: ["/", "/jobs"], disallow: ["/result", "/analyzing", "/goal", "/compare"] }, sitemap: "https://gunbti.vercel.app/sitemap.xml" }; }
