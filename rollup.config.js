import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [{
  input: './src/index.js',
  plugins: [
    nodeResolve({preferBuiltins: false, browser: true}),
    commonjs(),
  ],
  output: {
    file: 'dist/index.js',
    format: 'es'
  }
}]
