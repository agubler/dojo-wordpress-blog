import fetch from './fetch';
import * as parse from 'parse-link-header';

export interface BlogSummary {
	slug: string;
	title: string;
}

export default async function(baseUrl: string): Promise<BlogSummary[]> {
	let url = `${baseUrl}/wp-json/wp/v2/posts?per_page=100`;
	const results: any[] = [];
	while (url) {
		const response = await fetch(url, { tempCache: true, cacheCategory: 'blog-list' });
		url = '';
		const link = response.headers.get('link');
		if (link) {
			const next = parse(link);
			if (next && next.next) {
				url = next.next.url;
			}
		}
		const json = await response.json();
		results.push(...json);
	}
	return results.map((result: any) => ({ slug: result.slug, title: result.title.rendered }));
}
