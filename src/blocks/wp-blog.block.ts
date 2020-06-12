import fetch from './fetch';

export interface Blog {
	id: string;
	title: string;
	slug: string;
	image: string;
	content: string;
	categories: { name: string; id: number; slug: string }[];
}

export default async function(baseUrl: string, slug: string): Promise<Blog | null> {
	const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts?_embed&slug=${slug}`, {
		cacheCategory: 'blog',
		cacheId: slug
	});
	const [blog]: any = await response.json();
	if (!blog) {
		return null;
	}

	let categories = [];
	if (blog && blog._embedded && blog._embedded['wp:term'] && Array.isArray(blog._embedded['wp:term'])) {
		categories = blog._embedded['wp:term'][0]
			.filter((item: any) => item.taxonomy === 'category')
			.map((item: any) => ({ name: item.name, id: item.id, slug: item.slug }));
	}
	return {
		categories,
		title: blog.title.rendered,
		slug: blog.slug,
		id: blog.id,
		image: blog.jetpack_featured_media_url,
		content: blog.content.rendered
	};
}
