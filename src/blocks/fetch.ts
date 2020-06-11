import coreFetch from '@dojo/framework/shim/fetch';
const Cache = require('file-system-cache');

const cache = Cache.default({});

export async function fetch(input: string, init?: RequestInit | undefined): Promise<Response> {
	const cached = await cache.get(input);
	if (cached) {
		return new Response(cached.body, {
			headers: cached.headers,
			status: 200,
			statusText: 'OK'
		});
	}
	console.log('****REQUESTING*****', input);
	const response = await coreFetch(input, init);
	let headers: string[][] = [];
	response.headers.forEach((value, key) => {
		headers.push([key, value]);
	});
	const json = await response.json();
	await cache.set(input, { body: JSON.stringify(json), headers });
	return new Response(JSON.stringify(json), {
		headers,
		status: 200,
		statusText: 'OK'
	});
}

export default fetch;
