import fetch from '@dojo/framework/shim/fetch';
const Cache = require('file-system-cache');

const cache = Cache.default({});

export interface Blog {
	id: string;
	title: string;
	slug: string;
	image: string;
	content: string;
	categories: { name: string; id: number }[];
}

export default async function(baseUrl: string, slug: string): Promise<Blog | null> {
	let result = await cache.get(slug);
	if (!result) {
		console.log('fetching blog:', slug);
		const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts?_embed&slug=${slug}`);
		const [blog]: any = await response.json();
		if (!blog) {
			return null;
		}
		result = blog;
		cache.set(slug, result);
	}

	let categories = [];
	if (result && result._embedded && result._embedded['wp:term'] && Array.isArray(result._embedded['wp:term'])) {
		categories = result._embedded['wp:term'][0]
			.filter((item: any) => item.taxonomy === 'category')
			.map((item: any) => ({ name: item.name, id: item.id }));
	}
	return {
		categories,
		title: result.title.rendered,
		slug: result.slug,
		id: result.id,
		image: result.jetpack_featured_media_url,
		content: result.content.rendered
	};
}
