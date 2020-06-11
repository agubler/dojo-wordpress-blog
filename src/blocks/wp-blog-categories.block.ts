import fetch from './fetch';
import * as parse from 'parse-link-header';

interface Category {
	id: number;
	slug: string;
	name: string;
}

export default async function(baseUrl: string): Promise<Category[]> {
	let url = `${baseUrl}/wp-json/wp/v2/categories?per_page=100`;
	const categories: any[] = [];
	while (url) {
		const response = await fetch(url);
		url = '';
		const link = response.headers.get('link');
		if (link) {
			const next = parse(link);
			if (next && next.next) {
				url = next.next.url;
			}
		}
		const json = await response.json();
		categories.push(...json);
	}
	return categories.map((category) => ({
		id: category.id,
		slug: category.slug,
		name: category.name
	}));
}
