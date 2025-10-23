import { Helmet } from 'react-helmet-async'

interface SEOProps {
    title?: string
    description?: string
    keywords?: string
    image?: string
    url?: string
    type?: 'website' | 'article' | 'profile'
    author?: string
    publishDate?: string
    modifiedDate?: string
    noindex?: boolean
}

const defaultSEO = {
    title: 'Maglo - Modern Web Application',
    description: 'A modern web application built with React, TypeScript, and NestJS',
    keywords: 'react, typescript, nestjs, graphql, drizzle, vite, modern web app',
    image: '/og-image.png',
    url: 'https://maglo.com',
    type: 'website' as const,
    author: 'Pr1yansu',
}

export function SEO({
    title = defaultSEO.title,
    description = defaultSEO.description,
    keywords = defaultSEO.keywords,
    image = defaultSEO.image,
    url = defaultSEO.url,
    type = defaultSEO.type,
    author = defaultSEO.author,
    publishDate,
    modifiedDate,
    noindex = false,
}: SEOProps) {
    const fullTitle = title === defaultSEO.title ? title : `${title} | Maglo`
    const fullUrl = url.startsWith('http') ? url : `${defaultSEO.url}${url}`
    const fullImage = image.startsWith('http') ? image : `${defaultSEO.url}${image}`

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content="Maglo" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={fullImage} />
            <meta property="twitter:creator" content={`@${author}`} />

            {/* Article specific */}
            {type === 'article' && publishDate && (
                <meta property="article:published_time" content={publishDate} />
            )}
            {type === 'article' && modifiedDate && (
                <meta property="article:modified_time" content={modifiedDate} />
            )}
            {type === 'article' && (
                <meta property="article:author" content={author} />
            )}

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': type === 'website' ? 'WebSite' : 'WebPage',
                    name: fullTitle,
                    description,
                    url: fullUrl,
                    image: fullImage,
                    author: {
                        '@type': 'Person',
                        name: author,
                    },
                    ...(publishDate && { datePublished: publishDate }),
                    ...(modifiedDate && { dateModified: modifiedDate }),
                })}
            </script>
        </Helmet>
    )
}