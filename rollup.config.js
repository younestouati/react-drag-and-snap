import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import uglify from 'rollup-plugin-uglify';
import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import image from 'rollup-plugin-image';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import globals from 'rollup-plugin-node-globals';
import ascii from 'rollup-plugin-ascii';
import pkg from './package.json';

const ENV = process ? process.env.NODE_ENV : JSON.stringify('development');
const isProduction = ENV === 'production';
const isDevelopment = ENV === 'development';

export default [
    //Dev build (running both for dev and production build - but only serves and watches/livereloads for dev builds)
    {
        input: 'demos/index.js',
        output: {name: 'ReactDragAndSnapDemos', file: 'dev-bundle/bundle.umd.js', format: 'umd'},
        plugins: [
            postcss({
                extensions: ['.css'],
            }),
            eslint({
                envs: ["browser"]
            }),
            babel({
                exclude: ['node_modules/**'],
                plugins: ['external-helpers']
            }),
            resolve(), // Makes it possible to load third-party modules in node_modules.
            commonjs(), // Converts CommonJS modules to ES6.
            image(), // For importing JPG, PNG, GIF and SVG images
            globals(), // Injects the same node globals browserify does (i.e process, Buffer, etc)
            ascii(), // Escape ASCII charaters

            (isDevelopment && serve({open: true, contentBase: ''})), // assumes index.html in the root of the project!
            (isDevelopment && livereload({watch: 'dev-bundle'})) //TODO: CONSIDER IF THIS SHOULD WATCH THE LAUNCH_PAGES INDEX.JS FILE INSTEAD!!!!
        ]
    },
    //Production builds.
    {
        input: 'src/index.js',
        external: ['react', 'react-dom'],
        globals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
        },
        output: isProduction ?
        [
            {name: 'ReactDragAndSnap', file: pkg.browser, format: 'umd'}, // browser-friendly UMD build
            {file: pkg.main, format: 'cjs' }, // CommonJS (for Node)
            {file: pkg.module, format: 'es' }, // ES module (for bundlers and modern browsers)
        ] : [ /* Build nothing if this isn't a production build */ ],
        plugins: [
            postcss({
                extensions: ['.css'],
            }),
            eslint({
                envs: ["browser"]
            }),
            babel({
                exclude: ['node_modules/**'],
                plugins: ['external-helpers']
            }),
            resolve(), // Makes it possible to load third-party modules in node_modules.
            commonjs(), // Converts CommonJS modules to ES6.
            image(), // For importing JPG, PNG, GIF and SVG images
            globals(), // Injects the same node globals browserify does (i.e process, Buffer, etc)
            uglify(),
            ascii(), // Escape ASCII charaters
        ],
        sourcemap: true
    }
];