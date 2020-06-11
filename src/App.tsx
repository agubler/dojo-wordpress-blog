import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Outlet from '@dojo/framework/routing/Outlet';
import Link from '@dojo/framework/routing/Link';
import has from '@dojo/framework/core/has';

import WpBlogPreviews from './components/WpBlogPreviews';
import WpBlog from './components/WpBlog';
import { BlogPreview } from './components/wp-blog-previews.block';

const factory = create({ icache });

const baseUrl = `${has('wp-base-url')}`;

export default factory(function App({ middleware: { icache } }) {
	return (
		<div>
			<Link to="blogs">
				<h1>WordPress Blog Example</h1>
			</Link>
			<Outlet id="main">
				{{
					search: ({ queryParams: { search } }) => {
						if (!search) {
							return null;
						}
						const previews = icache.getOrSet(search, async () => {
							const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts?search=${search}`);
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
								currentPage: 1,
								pageSize: 10
							};
						});
						if (!previews) {
							return null;
						}
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
									<form action="search" method="get">
										<input name="search" />
									</form>
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
					},
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
												<form action="search" method="get">
													<input name="search" />
												</form>
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
					category: ({ params: { page, category } }) => {
						return (
							<WpBlogPreviews page={parseInt(page)} size={5} baseUrl={baseUrl} category={category}>
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
													<Link
														to="category"
														params={{ category, page: `${currentPage - 1}` }}
													>
														Previous
													</Link>
												) : (
													<span>Previous</span>
												)}
												{currentPage < totalPages ? (
													<Link
														to="category"
														params={{ category, page: `${currentPage + 1}` }}
													>
														Next
													</Link>
												) : (
													<span>Next</span>
												)}
												<form action="search" method="get">
													<input name="search" />
												</form>
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
										{/* {blog.categories.map((cat) => (
											<Link to="category" params={{ category: `${cat.id}` }}>
												{cat.name}
											</Link>
										))} */}
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
