import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

const config = {
	kit: {
		adapter: adapter({
			pages: "docs",
			assets: "docs",
			fallback: "index.html",
		})
	},
	paths: {
		// change below to your repo name
		base: dev ? "" : "/orions-arm",
	},
};

export default config;
