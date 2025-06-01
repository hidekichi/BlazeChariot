module.exports = () => {
	return {
		"title": "BlazeChariot",
		"description": "Minimal boilerplate for new projects built with Eleventy, Tailwind, PostCSS and esbuild",
		"url": "https://blazechariot.netlify.app/",
		"author": "HIDEKICHI",
		"meta_data": {
			"twitter": "@ko_hidekichi",
			"opengraph_default": "/static/opengraph-default.webp"
		},
		"env": process.env.ELEVENTY_ENV === 'production'
	}
};
