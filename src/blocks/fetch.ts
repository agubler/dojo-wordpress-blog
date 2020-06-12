import coreFetch from '@dojo/framework/shim/fetch';
const Cache = require('file-system-cache');
import { URL } from 'url';
import { join } from 'path';

interface CacheProperties {
	tempCache?: boolean;
	cacheCategory?: string;
	cacheId?: string;
}

export async function fetch(input: string, options: RequestInit & CacheProperties = {}): Promise<Response> {
	const parsedUrl = new URL(input);
	const {
		cacheCategory = parsedUrl.pathname.split('/').pop() || 'unknown',
		cacheId = parsedUrl.search,
		tempCache,
		...init
	} = options;
	const cache = Cache.default({
		basePath: join('.cache', tempCache ? '.tmp' : '', cacheCategory, cacheId)
	});
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
