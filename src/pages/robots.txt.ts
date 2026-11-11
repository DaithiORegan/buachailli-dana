import type { APIRoute } from 'astro';
import config from '../data/site.json';
export const GET: APIRoute = ({site}) => new Response(`User-agent: *\n${config.allowIndexing ? 'Allow: /' : 'Disallow: /'}\nSitemap: ${new URL('/sitemap.xml', site).href}\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
