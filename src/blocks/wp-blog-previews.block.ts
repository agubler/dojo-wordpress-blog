import fetch from './fetch';

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

export default async function(baseUrl: string, size: number, page: number, category?: number): Promise<BlogPreviews> {
	let url = `${baseUrl}/wp-json/wp/v2/posts?per_page=${size}&page=${page}`;
	if (category) {
		url = `${url}&categories=${category}`;
	}
	const response = await fetch(url);
	const json: any[] = await response.json();

	const blogPreviews = json.map<BlogPreview>((item) => ({
		title: item.title.rendered,
		slug: item.slug,
		id: item.id,
		image: item.jetpack_featured_media_url,
		excerpt: item.excerpt.rendered
	}));

	return {
		blogPreviews,
		total: parseInt(String(response.headers.get('x-wp-total'))),
		totalPages: parseInt(String(response.headers.get('x-wp-totalpages'))),
		currentPage: page,
		pageSize: size
	};
}
