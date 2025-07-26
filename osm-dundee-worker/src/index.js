import yaml from 'yaml';

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

		const yamlUrl = `https://raw.githubusercontent.com/OpenDataScotland/dundee_osm_health/refs/heads/main/site/_reports/cafes.yml?cachebust=${Date.now()}`;

		try {
			const res = await fetch(yamlUrl);
			const rawYaml = await res.text();
			const parsed = yaml.parse(rawYaml);

			const query = parsed.query;

			// Send query to Overpass API
			const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({ data: query }).toString()
			});

			if (!overpassRes.ok) {
				return new Response(`Overpass API Error: ${overpassRes.status}`, { status: 502 });
			}

			const json = await overpassRes.json();

			return new Response(JSON.stringify(json, null, 2), {
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		} catch (err) {
			return new Response(`Error: ${err.message}`, { status: 500 });
		}

	},
};
