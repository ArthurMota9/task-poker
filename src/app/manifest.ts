import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Task Poker',
    short_name: 'Task Poker',
    description: 'Planning Poker online para times ágeis',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
