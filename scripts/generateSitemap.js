import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const loadEnv = () => {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) return;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
};

loadEnv();

const siteUrl = (process.env.SITE_URL || "https://musicalbums.vercel.app").replace(/\/+$/, "");
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

const staticRoutes = [
  "/",
  "/best-albums",
  "/discover",
  "/new-releases",
  "/genres",
  "/community",
  "/search",
  "/about",
  "/contact",
  "/privacy",
  "/terms"
];

const buildUrl = (route) => `${siteUrl}${route}`;

const toUrlNode = (loc, changefreq, priority) => {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
};

const fetchDynamicRoutes = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { albumIds: [], artistIds: [] };
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const [albumsRes, artistsRes] = await Promise.all([
    supabase.from("bugs_albums_view").select("id"),
    supabase.from("bugs_artists").select("id")
  ]);

  const albumIds = (albumsRes.data ?? []).map((row) => row.id).filter(Boolean);
  const artistIds = (artistsRes.data ?? []).map((row) => row.id).filter(Boolean);

  return { albumIds, artistIds };
};

const generateSitemap = async () => {
  const urlNodes = [];

  urlNodes.push(toUrlNode(buildUrl("/"), "daily", "1.0"));
  staticRoutes
    .filter((route) => route !== "/")
    .forEach((route) => {
      const changefreq = route === "/search" ? "weekly" : "weekly";
      const priority = ["/best-albums", "/discover", "/new-releases"].includes(route) ? "0.8" : "0.6";
      urlNodes.push(toUrlNode(buildUrl(route), changefreq, priority));
    });

  const { albumIds, artistIds } = await fetchDynamicRoutes();

  albumIds.forEach((id) => {
    urlNodes.push(toUrlNode(buildUrl(`/album/${id}`), "weekly", "0.7"));
  });
  artistIds.forEach((id) => {
    urlNodes.push(toUrlNode(buildUrl(`/artist/${id}`), "weekly", "0.5"));
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes.join(
    "\n"
  )}\n</urlset>\n`;

  const outPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf8");
  console.log(`Generated sitemap.xml with ${urlNodes.length} URLs`);
};

generateSitemap().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exit(1);
});
