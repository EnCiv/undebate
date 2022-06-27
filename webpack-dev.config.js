const { tryStatement } = require('@babel/types')
const path = require('path')
const webpack = require('webpack')

const env = process.env.NODE_ENV || 'development'
if (env !== 'development') console.error('NODE_ENV is', env, "but needs to be 'development' when the server runs")

module.exports = {
  context: path.resolve(__dirname, 'app'),
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'only-dev-server': 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    main: './client/main-app.js',
  },
  output: {
    path: path.join(__dirname, 'assets/webpack'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    fallback: {
      fs: false, // logger wants to require fs though it's not needed on the browser
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      os: require.resolve('os-browserify/browser'),
      zlib: require.resolve('browserify-zlib'),
      constants: require.resolve('constants-browserify'),
      buffer: require.resolve('buffer'),
      assert: require.resolve('assert/'),
    },
  },
  devServer: {
    allowedHosts: 'all', // not recomended but could be 'auto' but we want to allow devices on the LAN - this is only for development
    hot: 'only',
    host: '0.0.0.0',
    port: 3011,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    proxy: {
      // the dev server will proxy all traffic other than publicPath to target below.
      context: () => true,
      '/': 'http://localhost:3012', // this is where the node server of the application is really running
    },
    compress: true,
    devMiddleware: {
      index: '', // specify to enable root proxying
      publicPath: '/assets/webpack/', // in main.js also ass if(typeof ___webpack_public_path__ !== 'undefined' __webpack_public_path__ = "http://localhost:3011/assets/webpack/";  // this is where the hot loader sends requests to
    },
  },
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /nodemailer/ }), // not used in the client side - those should be move outside of the app directory
    new webpack.NormalModuleReplacementPlugin(/.+models\/.+/, '../models/client-side-model'), // do not include models on the client side - the app/api files contain server side and client side code
    new webpack.NormalModuleReplacementPlugin(/.+\/the-civil-server\.js$/, '/client/client-side-model'), // on the clientsite map imports of civil-server to an empty module
    new webpack.HotModuleReplacementPlugin(), // DO NOT use --hot in the command line - it will cause a stack overflow on the client
    new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }), // Work around for Buffer is undefined: https://github.com/webpack/changelog-v5/issues/10
    new webpack.ProvidePlugin({ process: 'process/browser' }), // fix "process is not defined" error: // (do "npm install process" before running the build)
  ],
}
