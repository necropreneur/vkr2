/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {
			colors: {
				'gpt-bg': '#313131',
				'gpt-secondary-bg': '#434448',
			}
		}
	},
	plugins: [require('flowbite/plugin')]
};
