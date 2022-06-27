// webpack.config.js
const path = require('path')
//const webpack = require('webpack')
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  context: path.resolve(__dirname, 'dist'),
  mode: 'development',
  entry: './start',
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      //exclude: /a\.js|node_modules/,
      // include specific files based on a RegExp
      //include: /dir/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      //cwd: process.cwd(),
    }),
  ],
}
