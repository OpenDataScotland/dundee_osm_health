const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
};

function handleOptions(request) {
	return new Response(null, {
		status: 204,
		headers: corsHeaders
	});
}

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'OPTIONS') {
			return handleOptions(request);
		}

		// Extract report name from URL path
		const url = new URL(request.url);
		const pathParts = url.pathname.split('/').filter(part => part.length > 0);

		if (pathParts.length === 0) {
			return new Response('Report name is required. Use /REPORT_NAME format.', {
				status: 400,
				headers: corsHeaders
			});
		}

		const reportName = pathParts[0];
		const reportUrl = `https://osm.dundee.opendata.scot/reports/${reportName}/`;

		// Create cache key from the request URL
		const cacheKey = new Request(url.toString(), request);
		const cache = caches.default;

		// Check if we have a cached response
		let response = await cache.match(cacheKey);

		if (response) {
			// Return cached response with X-Cache-Status header
			const cachedResponse = new Response(response.body, response);
			cachedResponse.headers.set('X-Cache-Status', 'HIT');
			return cachedResponse;
		}

		try {
			// Fetch report configuration from API
			const reportRes = await fetch(reportUrl);

			if (!reportRes.ok) {
				return new Response(`Report not found: ${reportName}`, {
					status: 404,
					headers: corsHeaders
				});
			}

			const reportConfig = await reportRes.json();
			const query = reportConfig.query;

			if (!query) {
				return new Response('Invalid report configuration: missing query', {
					status: 500,
					headers: corsHeaders
				});
			}

			// Send query to Overpass API
			const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': 'OSM Dundee Worker (https://osm.dundee.opendata.scot)'
				},
				body: new URLSearchParams({ data: query }).toString()
			});

			if (!overpassRes.ok) {
				return new Response(`Overpass API Error: ${overpassRes.status}`, {
					status: 502,
					headers: corsHeaders
				});
			}

			const json = await overpassRes.json();

			// Create response with cache headers
			response = new Response(JSON.stringify(json, null, 2), {
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'public, max-age=900', // 15 minutes = 900 seconds
					'X-Cache-Status': 'MISS',
					...corsHeaders
				},
			});

			// Store in cache
			ctx.waitUntil(cache.put(cacheKey, response.clone()));

			return response;
		} catch (err) {
			return new Response(`Error: ${err.message}`, {
				status: 500,
				headers: corsHeaders
			});
		}
	},
};
