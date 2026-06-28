import { MetadataRoute } from 'next';

const APP_URL = 'https://task-poker.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/pt', '/en', '/es'],
      disallow: ['/pt/session/', '/en/session/', '/es/session/'],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
