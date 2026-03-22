import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mediatoolkit.site'
  
  // Static pages
  const staticPages = [
    '',
    '/login',
    '/register',
    '/dashboard',
    '/blog',
    '/faq',
  ]

  // Tool pages
  const tools = [
    'hook-generator',
    'caption-generator',
    'script-studio',
    'viral-analyzer',
    'steal-video',
    'video-finder',
    'trend-radar',
    'competitor-spy',
    'hashtag-research',
    'content-planner',
    'content-repurposer',
    'ab-tester',
    'carousel-planner',
    'engagement-booster',
    'posting-optimizer',
    'thread-composer',
  ]

  // Blog posts
  const blogPosts = [
    'how-to-go-viral-on-tiktok',
    'best-hooks-for-reels',
    'content-calendar-strategy',
    'hashtag-strategy-2025',
    'ai-tools-for-creators',
    'youtube-shorts-vs-tiktok',
  ]

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }))

  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticUrls, ...toolUrls, ...blogUrls]
}
