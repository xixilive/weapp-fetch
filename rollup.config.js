import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default [{
  input: './src/index.js',
  plugins: [
    nodeResolve({preferBuiltins: false, browser: true}),
    babel({runtimeHelpers: true}),
    commonjs(),
  ],
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  }
}]
