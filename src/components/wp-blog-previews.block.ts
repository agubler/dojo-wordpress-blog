import fetch from 'node-fetch';

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

export default async function(baseUrl: string, size: number, page: number): Promise<BlogPreviews> {
	const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=${size}&page=${page}`);
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
		// limit pages for testing
		totalPages: 4, // parseInt(String(response.headers.get('x-wp-totalpages'))),
		currentPage: page,
		pageSize: size
	};
}
