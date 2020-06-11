import { create } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import block from '@dojo/framework/core/middleware/block';

import getBlog, { Blog } from '../blocks/wp-blog.block';
import getBlogList, { BlogSummary } from '../blocks/wp-blog-list.block';

interface WpBlogPreviewsProperties {
	baseUrl: string;
	slug: string;
}

interface WpBlogPreviewsChildren {
	(blog: Blog, prev: BlogSummary, next: BlogSummary): RenderResult;
}

const factory = create({ block })
	.properties<WpBlogPreviewsProperties>()
	.children<WpBlogPreviewsChildren>();

export default factory(function WpBlogPreviews({ children, properties, middleware: { block } }) {
	const { baseUrl, slug } = properties();
	const [renderChildren] = children();

	const blog = block(getBlog)(baseUrl, slug);
	const list = block(getBlogList)(baseUrl);

	if (blog && list) {
		const index = list.findIndex((item) => item.slug === slug);
		const prev = list[index + 1];
		const next = list[index - 1];
		return renderChildren(blog, prev, next);
	}
});
