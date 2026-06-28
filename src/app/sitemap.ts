import { MetadataRoute } from 'next';

const APP_URL = 'https://task-poker.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${APP_URL}/pt`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${APP_URL}/en`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${APP_URL}/es`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
