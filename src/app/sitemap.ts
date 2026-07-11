import { MetadataRoute } from 'next'
import { getMarkdownFiles } from '@/lib/markdown'
import { getServiceSlugs, getServiceWorks } from '@/lib/services'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-static'

interface BlogPost {
  date: string;
  priority?: boolean;
}

interface PressRelease {
  date: string;
  priority?: boolean;
}

// Helper function to get all routes
function getAppRoutes(dir: string = 'src/app'): string[] {
  const routes: string[] = ['/']
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !file.startsWith('_') && !file.startsWith('.') && !file.startsWith('[')) {
      const hasPage = fs.existsSync(path.join(filePath, 'page.tsx'))
      if (hasPage) {
        const route = filePath
          .replace('src/app', '')
          .replace(/\\/g, '/')
          .replace('/page.tsx', '')
        if (route) routes.push(route)
      } else {
        // Only recurse if no page.tsx was found
        routes.push(...getAppRoutes(filePath))
      }
    }
  })

  return [...new Set(routes)].filter(route => route !== '/api')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qed-it.com'

  // Get all static app routes (skips dynamic [..] folders)
  const appRoutes = getAppRoutes()

  // Service pages live under dynamic [service]/[work] routes, so the folder
  // walker above misses them. Enumerate them from the content instead, the
  // same way the pages are generated.
  const serviceLandingRoutes = getServiceSlugs().map((service) => `/services/${service}`)
  const serviceWorkRoutes = getServiceSlugs().flatMap((service) =>
    getServiceWorks(service).map((w) => `/services/${service}/${w.slug}`)
  )

  // Get all content
  const blogPosts = getMarkdownFiles<BlogPost>('blog')
  const pressReleases = getMarkdownFiles<PressRelease>('press-releases')

  // Calculate total pages for blog and news
  const blogItemsPerPage = 9;
  const newsItemsPerPage = 12;
  const totalBlogPages = Math.ceil(blogPosts.length / blogItemsPerPage);
  const totalNewsPages = Math.ceil(pressReleases.length / newsItemsPerPage);

  // Generate blog pagination URLs
  const blogPaginationUrls = Array.from({ length: totalBlogPages - 1 }, (_, i) => ({
    url: `${baseUrl}/blog/page/${i + 2}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Generate news pagination URLs
  const newsPaginationUrls = Array.from({ length: totalNewsPages - 1 }, (_, i) => ({
    url: `${baseUrl}/news/page/${i + 2}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    // Dynamic app routes
    ...appRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '/' ? 1 : 0.8,
    })),

    // Service landing pages (/services/audits, ...)
    ...serviceLandingRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),

    // Service work / case-study pages (/services/audits/ragu-tachyon, ...)
    ...serviceWorkRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),

    // Blog pagination pages
    ...blogPaginationUrls,

    // News pagination pages
    ...newsPaginationUrls,

    // Blog posts
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/${post.fileName.replace(/\.md$/, '')}`,
      lastModified: new Date(post.data.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),

    // Press releases
    ...pressReleases.map((release) => ({
      url: `${baseUrl}/news/${release.fileName.replace(/\.md$/, '')}`,
      lastModified: new Date(release.data.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}