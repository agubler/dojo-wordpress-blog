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
		id: 'blog',
		outlet: 'main',
		path: 'blog/{slug}'
	}
];
