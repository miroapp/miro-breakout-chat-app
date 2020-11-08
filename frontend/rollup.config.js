import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import {terser} from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import replace from 'rollup-plugin-replace'
import * as dotenv from 'dotenv'

dotenv.config()

const production = !process.env.ROLLUP_WATCH

function serve() {
	let server

	function toExit() {
		if (server) server.kill(0)
	}

	return {
		writeBundle() {
			if (server) return
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev', '--host'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true,
			})

			process.on('SIGTERM', toExit)
			process.on('exit', toExit)
		},
	}
}

const replacePlugin = replace({
	exclude: 'node_modules/**',
	process: JSON.stringify({
		env: {
			CLIENT_ID: process.env.CLIENT_ID,
			CHAT_HOST: process.env.CHAT_HOST,
		},
	}),
})

export default [
	{
		input: 'src/chat/main.ts',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'public/chat/build/bundle.js',
		},
		plugins: [
			replacePlugin,
			svelte({
				// enable run-time checks when not in production
				dev: !production,
				// we'll extract any component CSS out into
				// a separate file - better for performance
				css: (css) => {
					css.write('public/chat/build/bundle.css')
				},
				preprocess: sveltePreprocess(),
			}),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte'],
			}),
			commonjs(),
			// noEmirOnError: false is required to prevent killing the process while in the watch mode
			typescript({sourceMap: !production, noEmitOnError: false, inlineSources: !production}),

			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload('public'),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),
		],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: 'src/init/main.ts',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'public/init/build/bundle.js',
		},
		plugins: [replacePlugin, typescript({sourceMap: !production, noEmitOnError: false, inlineSources: !production}), production && terser()],
	},
]
