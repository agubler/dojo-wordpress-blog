import { create } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import block from '@dojo/framework/core/middleware/block';

import getBlogPreviews, { BlogPreviews } from '../blocks/wp-blog-previews.block';
import getCategories from '../blocks/wp-blog-categories.block';

interface WpBlogPreviewsProperties {
	baseUrl: string;
	page: number;
	size: number;
	category?: string;
}

interface WpBlogPreviewsChildren {
	(previews: BlogPreviews): RenderResult;
}

const factory = create({ block })
	.properties<WpBlogPreviewsProperties>()
	.children<WpBlogPreviewsChildren>();

export default factory(function WpBlogPreviews({ children, properties, middleware: { block } }) {
	const { baseUrl, page, size, category } = properties();
	const [renderChildren] = children();

	const categories = block(getCategories)(baseUrl);
	if (categories) {
		const { id } = categories.find((item) => item.slug === category) || { id: 0 };
		const previews = block(getBlogPreviews)(baseUrl, size, page, id);
		if (previews) {
			return renderChildren(previews);
		}
	}
});
