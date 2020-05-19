import fetch from 'node-fetch';

export interface Blog {
	id: string;
	title: string;
	slug: string;
	image: string;
	content: string;
}

export default async function(baseUrl: string, slug: string): Promise<Blog> {
	const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts?slug=${slug}`);
	const [blog]: any = await response.json();

	return {
		title: blog.title.rendered,
		slug: blog.slug,
		id: blog.id,
		image: blog.jetpack_featured_media_url,
		content: blog.content.rendered
	};
}
