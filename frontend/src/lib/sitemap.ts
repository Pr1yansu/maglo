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
  {
    path: "/login",
    priority: 0.8,
    changeFreq: "yearly",
  },
  {
    path: "/register",
    priority: 0.8,
    changeFreq: "yearly",
  },
  {
    path: "/dashboard",
    priority: 0.9,
    changeFreq: "daily",
  },
  {
    path: "/dashboard/transactions",
    priority: 0.7,
    changeFreq: "daily",
  },
  {
    path: "/dashboard/invoices",
    priority: 0.7,
    changeFreq: "weekly",
  },
  {
    path: "/dashboard/invoices/new",
    priority: 0.6,
    changeFreq: "monthly",
  },
  {
    path: "/dashboard/wallets",
    priority: 0.7,
    changeFreq: "weekly",
  },
  {
    path: "/dashboard/wallets/cards",
    priority: 0.6,
    changeFreq: "monthly",
  },
  {
    path: "/dashboard/settings",
    priority: 0.6,
    changeFreq: "monthly",
  },
  {
    path: "/help",
    priority: 0.5,
    changeFreq: "monthly",
  },
];

export function generateSitemap(
  baseUrl: string = "https://maglo.com",
  routes: SitemapRoute[] = defaultRoutes
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
  </url>`
  )
  .join("\n")}
</urlset>`;

  return sitemapXml;
}

export function generateRobotsTxt(
  baseUrl: string = "https://maglo.com",
  allowAll: boolean = true,
  disallowedPaths: string[] = ["/dashboard", "/dashboard/*"]
): string {
  const disallowRules = allowAll
    ? disallowedPaths.map((path) => `Disallow: ${path}`).join("\n")
    : "Disallow: /";

  return `User-agent: *
${allowAll ? "Allow: /" : ""}
${disallowRules}

# Allow access to public assets
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.gif$
Allow: /*.svg$

# Crawl delay (optional)
Crawl-delay: 1

Sitemap: ${baseUrl}/sitemap.xml`;
}

// Generate a manifest.json for PWA
export function generateManifest() {
  return {
    name: "Maglo - Financial Dashboard",
    short_name: "Maglo",
    description: "Modern financial dashboard and wallet management platform",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9AE93A",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["finance", "productivity", "business"],
    lang: "en",
    dir: "ltr",
    orientation: "portrait-primary",
  };
}
