export default {
	title: "BlazeChariot",
	description: "ギターを弾き語れ！とLinuxなどPCの事を書いた11tyで作ったブログです。",
	url: "https://blazechariot.netlify.app",
	author: {
		name: "Hidekichi",
		email: "hidekichi0513@gmail.com",
		url: "https://blazechariot.netlify.app/about/"
	},
	meta_data: {
		twitter: "@ko_hidekichi",
		opengraph_default: "/images/opengraph-default.jpg"
	},
	env: process.env.ELEVENTY_ENV === 'production'
};
