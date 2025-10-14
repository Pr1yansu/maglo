import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'A modern full-stack application built with NestJS, GraphQL, Drizzle ORM, PostgreSQL, React, Redux Toolkit, and Tailwind CSS.',
  keywords = 'full-stack, react, nestjs, graphql, postgresql, typescript, redux, tailwind css, web application',
  image = '/og-image.jpg',
  url,
  type = 'website',
  noindex = false,
}) => {
  const siteTitle = 'Maglo';
  const fullTitle = title
    ? `${title} | ${siteTitle}`
    : `${siteTitle} - Modern Full-Stack Application`;
  const currentUrl = url ? `https://maglo.app${url}` : 'https://maglo.app';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://maglo.app${image}`} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://maglo.app${image}`} />
      <meta name="twitter:url" content={currentUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};
