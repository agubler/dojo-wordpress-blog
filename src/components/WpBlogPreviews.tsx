import { create } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import block from '@dojo/framework/core/middleware/block';

import getBlogPreviews, { BlogPreviews } from './wp-blog-previews.block';

interface WpBlogPreviewsProperties {
	baseUrl: string;
	page: number;
	size: number;
}

interface WpBlogPreviewsChildren {
	(previews: BlogPreviews): RenderResult;
}

const factory = create({ block })
	.properties<WpBlogPreviewsProperties>()
	.children<WpBlogPreviewsChildren>();

export default factory(function WpBlogPreviews({ children, properties, middleware: { block } }) {
	const { baseUrl, page, size } = properties();
	const [renderChildren] = children();

	const previews = block(getBlogPreviews)(baseUrl, size, page);

	if (previews) {
		return renderChildren(previews);
	}
});
