// Sitemap generator utility
// This can be used to generate static sitemaps or dynamic ones

export interface SitemapRoute {
  path: string;
  priority?: number;
  changeFreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  lastModified?: string;
}

const defaultRoutes: SitemapRoute[] = [
  {
    path: "/",
    priority: 1.0,
    changeFreq: "monthly",
  },
  // Add more routes as your app grows
];

export function generateSitemap(
  baseUrl: string = "https://maglo.com",
  routes: SitemapRoute[] = defaultRoutes,
): string {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    ${route.lastModified ? `<lastmod>${route.lastModified}</lastmod>` : ""}
    ${route.changeFreq ? `<changefreq>${route.changeFreq}</changefreq>` : ""}
    ${route.priority ? `<priority>${route.priority}</priority>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return sitemapXml;
}

export function generateRobotsTxt(
  baseUrl: string = "https://maglo.com",
  allowAll: boolean = true,
): string {
  return `User-agent: *
${allowAll ? "Allow: /" : "Disallow: /"}

Sitemap: ${baseUrl}/sitemap.xml`;
}
