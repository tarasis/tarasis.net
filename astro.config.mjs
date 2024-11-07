// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import expressiveCode from 'astro-expressive-code';
import { pluginColorChips } from 'expressive-code-color-chips';

// https://astro.build/config
export default defineConfig({
    site: 'https://v5.tarasis.net',
    integrations: [expressiveCode({
		plugins: [pluginColorChips()],
	}), mdx(), sitemap()],
});