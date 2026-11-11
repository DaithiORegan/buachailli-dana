import { defineConfig } from 'astro/config';
import site from './src/data/site.json';
export default defineConfig({ site: process.env.PUBLIC_SITE_URL || site.siteUrl, output: 'static', trailingSlash: 'always' });
