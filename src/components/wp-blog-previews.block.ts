import fetch from '@dojo/framework/shim/fetch';
const Cache = require('file-system-cache');

const cache = Cache.default({});

export interface BlogPreview {
	id: string;
	title: string;
	slug: string;
	image: string;
	excerpt: string;
}

export interface BlogPreviews {
	blogPreviews: BlogPreview[];
	total: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

interface CachedResult {
	json: any[];
	headers: {
		total: number;
		totalPages: number;
	};
}

export default async function(baseUrl: string, size: number, page: number, category?: string): Promise<BlogPreviews> {
	let result: CachedResult | undefined = await cache.get(`${size}-${page}-${category}`);
	if (!result) {
		console.log('fetching blog list:', page, size, category);
		let url = `${baseUrl}/wp-json/wp/v2/posts?per_page=${size}&page=${page}`;
		if (category) {
			url = `${url}&categories=${category}`;
		}
		const response = await fetch(url);
		const json: any[] = await response.json();
		result = {
			json,
			headers: {
				total: parseInt(String(response.headers.get('x-wp-total'))),
				totalPages: parseInt(String(response.headers.get('x-wp-totalpages')))
			}
		};
		await cache.set(`${size}-${page}-${category}`, result);
	}

	const blogPreviews = result.json.map<BlogPreview>((item) => ({
		title: item.title.rendered,
		slug: item.slug,
		id: item.id,
		image: item.jetpack_featured_media_url,
		excerpt: item.excerpt.rendered
	}));

	return {
		blogPreviews,
		total: result.headers.total,
		totalPages: 1, // result.headers.totalPages,
		currentPage: page,
		pageSize: size
	};
}
