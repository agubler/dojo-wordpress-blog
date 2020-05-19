import { create, tsx } from '@dojo/framework/core/vdom';
import Outlet from '@dojo/framework/routing/Outlet';
import Link from '@dojo/framework/routing/Link';
import has from '@dojo/framework/core/has';

import WpBlogPreviews from './components/WpBlogPreviews';
import WpBlog from './components/WpBlog';

const factory = create();

const baseUrl = `${has('wp-base-url')}`;

export default factory(function App() {
	return (
		<div>
			<Link to="blogs">
				<h1>WordPress Blog Example</h1>
			</Link>
			<Outlet id="main">
				{{
					blogs: ({ params: { page } }) => {
						return (
							<WpBlogPreviews page={parseInt(page)} size={5} baseUrl={baseUrl}>
								{(previews) => {
									const { blogPreviews, currentPage, totalPages } = previews;
									return (
										<div>
											<div
												styles={{
													display: 'flex',
													justifyContent: 'space-between',
													width: '100px'
												}}
											>
												{currentPage > 1 ? (
													<Link to="blogs" params={{ page: `${currentPage - 1}` }}>
														Previous
													</Link>
												) : (
													<span>Previous</span>
												)}
												{currentPage < totalPages ? (
													<Link to="blogs" params={{ page: `${currentPage + 1}` }}>
														Next
													</Link>
												) : (
													<span>Next</span>
												)}
											</div>
											<ul>
												{blogPreviews.map((preview) => {
													return (
														<li>
															<div>
																<Link to="blog" params={{ slug: preview.slug }}>
																	{preview.title}
																</Link>
																<div innerHTML={preview.excerpt} />
															</div>
														</li>
													);
												})}
											</ul>
										</div>
									);
								}}
							</WpBlogPreviews>
						);
					},
					blog: ({ params: { slug } }) => (
						<WpBlog slug={slug} baseUrl={baseUrl}>
							{(blog) => {
								return (
									<div>
										<h2>{blog.title}</h2>
										<div innerHTML={blog.content} />
									</div>
								);
							}}
						</WpBlog>
					)
				}}
			</Outlet>
		</div>
	);
});
