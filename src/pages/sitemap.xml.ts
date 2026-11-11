import type { APIRoute } from 'astro';
const paths=['/','/wedding-band/','/solo-musician/','/setlist/','/live/','/press/'];
export const GET: APIRoute = ({site}) => new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(path=>'<url><loc>'+new URL(path,site).href+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}});
