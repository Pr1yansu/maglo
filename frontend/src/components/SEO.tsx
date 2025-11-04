import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile" | "WebPage" | "WebApplication";
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  schema?: "WebPage" | "Dashboard" | "FinancialService" | "SoftwareApplication";
}

const defaultSEO = {
  title: "Maglo - Modern Financial Dashboard & Wallet Management",
  description:
    "Manage your finances with Maglo's modern dashboard. Track transactions, create invoices, manage wallets, and monitor your financial health with our intuitive platform.",
  keywords:
    "financial dashboard, wallet management, invoice creation, transaction tracking, financial analytics, money management, fintech, personal finance, financial planning",
  image: "/og-image.png",
  url: "https://maglo.com",
  type: "website" as const,
  author: "Pr1yansu",
};

export function SEO({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url,
  type = defaultSEO.type,
  author = defaultSEO.author,
  publishDate,
  modifiedDate,
  noindex = false,
  breadcrumbs = [],
  schema = "WebPage",
}: SEOProps) {
  const location = useLocation();
  const currentUrl = url || `${defaultSEO.url}${location.pathname}`;
  const fullTitle = title === defaultSEO.title ? title : `${title} | Maglo`;
  const fullUrl = currentUrl.startsWith("http")
    ? currentUrl
    : `${defaultSEO.url}${currentUrl}`;
  const fullImage = image.startsWith("http")
    ? image
    : `${defaultSEO.url}${image}`;

  // Generate structured data based on schema type
  const generateStructuredData = () => {
    const baseData: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": schema,
      name: fullTitle,
      description,
      url: fullUrl,
      image: fullImage,
      author: {
        "@type": "Person",
        name: author,
      },
      publisher: {
        "@type": "Organization",
        name: "Maglo",
        logo: {
          "@type": "ImageObject",
          url: `${defaultSEO.url}/icon.svg`,
        },
      },
      ...(publishDate && { datePublished: publishDate }),
      ...(modifiedDate && { dateModified: modifiedDate }),
    };

    // Add breadcrumb structured data if available
    if (breadcrumbs.length > 0) {
      baseData.breadcrumb = {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url.startsWith("http")
            ? item.url
            : `${defaultSEO.url}${item.url}`,
        })),
      };
    }

    // Add specific schema for different page types
    if (schema === "Dashboard") {
      baseData["@type"] = "WebApplication";
      baseData.applicationCategory = "FinanceApplication";
      baseData.operatingSystem = "Web Browser";
    } else if (schema === "FinancialService") {
      baseData["@type"] = "Service";
      baseData.serviceType = "Financial Management";
    }

    return baseData;
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Robots and Indexing */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${fullTitle} - Preview Image`} />
      <meta property="og:site_name" content="Maglo" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      <meta
        property="twitter:image:alt"
        content={`${fullTitle} - Preview Image`}
      />
      <meta property="twitter:creator" content={`@${author}`} />
      <meta property="twitter:site" content="@magloapp" />

      {/* Article specific */}
      {type === "article" && publishDate && (
        <meta property="article:published_time" content={publishDate} />
      )}
      {type === "article" && modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}
      {type === "article" && (
        <meta property="article:author" content={author} />
      )}

      {/* Additional SEO */}
      <meta name="language" content="en" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
}
