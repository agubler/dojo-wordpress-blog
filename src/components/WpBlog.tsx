import { create } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import block from '@dojo/framework/core/middleware/block';

import getBlog, { Blog } from './wp-blog.block';

interface WpBlogPreviewsProperties {
	baseUrl: string;
	slug: string;
}

interface WpBlogPreviewsChildren {
	(blog: Blog): RenderResult;
}

const factory = create({ block })
	.properties<WpBlogPreviewsProperties>()
	.children<WpBlogPreviewsChildren>();

export default factory(function WpBlogPreviews({ children, properties, middleware: { block } }) {
	const { baseUrl, slug } = properties();
	const [renderChildren] = children();

	const blog = block(getBlog)(baseUrl, slug);

	if (blog) {
		return renderChildren(blog);
	}
});
