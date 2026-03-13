import type { APIRoute } from 'astro';
import { mockSearch } from '@lib/mock-data';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q') || '';

  // In production: query D1 database
  // const db = locals.runtime.env.DB;
  // const results = await db.prepare('SELECT ... FROM politicians WHERE name LIKE ?').bind(`%${query}%`).all();

  // For now, use mock data
  const results = mockSearch(query);

  return new Response(JSON.stringify({ results, query }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};
