import { MetadataRoute } from 'next'
import { getMarkdownFiles } from '@/lib/markdown'
import fs from 'fs'
import path from 'path'

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
  
  // Get all app routes
  const appRoutes = getAppRoutes()

  // Get all content
  const blogPosts = getMarkdownFiles<BlogPost>('blog')
  const pressReleases = getMarkdownFiles<PressRelease>('press-releases')

  return [
    // Dynamic app routes
    ...appRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '/' ? 1 : 0.8,
    })),

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