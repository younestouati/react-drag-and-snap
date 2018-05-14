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
import pkg from './package.json';

const ENV = process ? process.env.NODE_ENV : JSON.stringify('development');
const isProduction = ENV === 'production';
const isDevelopment = ENV === 'development';

const plugins = [
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
]

export default [
    //Dev build (running both for dev and production build - but only serves and watches/livereloads for dev builds)
    //The dev/demo bundle contains the demos as well as the library.
    {
        input: 'demos/index.js',
        output: {name: 'ReactDragAndSnapDemos', file: 'demo-bundle/bundle.umd.js', format: 'umd'},
        plugins: [
            ...plugins,
            (isDevelopment && serve({open: true, contentBase: ''})), // assumes index.html in the root of the project!
            (isDevelopment && livereload({watch: 'demo-bundle'}))
        ]
    },
    //Production builds.
    {
        input: 'src/index.js',
        external: ['react', 'react-dom', 'react-motion'],
        globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react-motion': 'ReactMotion'
        },
        output: isProduction ?
        [
            {name: 'ReactDragAndSnap', file: pkg.browser, format: 'umd'}, // browser-friendly UMD build
            {file: pkg.main, format: 'cjs' }, // CommonJS (for Node)
            {file: pkg.module, format: 'es' }, // ES module (for bundlers and modern browsers)
        ] : [ /* Build nothing if this isn't a production build */ ],
        plugins: [
            ...plugins,
            uglify()
        ],
        sourcemap: true
    }
];