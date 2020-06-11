export default [
	{
		id: 'blogs',
		outlet: 'main',
		path: 'blogs/{page}',
		defaultParams: {
			page: '1'
		},
		defaultRoute: true
	},
	{
		id: 'category',
		outlet: 'main',
		path: 'category/{category}/{page}',
		defaultParams: {
			page: '1'
		}
	},
	{
		id: 'blog',
		outlet: 'main',
		path: 'blog/{slug}'
	},
	{
		id: 'search',
		outlet: 'main',
		path: 'search?{search}'
	}
];
