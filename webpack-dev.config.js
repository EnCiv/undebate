const path = require('path')
const webpack = require('webpack')
const compressionplugin = require('compression-webpack-plugin')

const use = [
  {
    loader: 'babel-loader',
  },
]

const env = process.env.NODE_ENV || 'development'
if (env !== 'development') console.error('NODE_ENV is', env, "but needs to be 'development' when the server runs")

module.exports = {
  context: path.resolve(__dirname, 'app'),
  mode: 'development',
  watch: true,
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
        test: /\.jsx$/,
        exclude: /node_modules/,
        include: /(.*profile.*)/, // for some reason, webpack (4.25.1) will exclude files with names containing 'profile' (or 'profile-' not sure) so I has to explicitly include them
        use,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use,
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use,
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  node: {
    fs: 'empty', // logger wants to require fs though it's not needed on the browser
  },
  devServer: {
    disableHostCheck: true,
    publicPath: '/assets/webpack/', // in main.js also ass if(typeof ___webpack_public_path__ !== 'undefined' __webpack_public_path__ = "http://localhost:3011/assets/webpack/";  // this is where the hot loader sends requests to
    hot: true,
    hotOnly: true,
    host: '0.0.0.0',
    port: 3011,
    index: '', // specify to enable root proxying
    proxy: {
      // the dev server will proxy all traffic other than publicPath to target below.
      context: () => true,
      '/': 'http://localhost:3012', // this is where the node server of the application is really running
    },
    compress: true,
  },
  plugins: [
    new webpack.IgnorePlugin(/nodemailer/), // not used in the client side - those should be move outside of the app directory
    new webpack.NormalModuleReplacementPlugin(/.+models\/.+/, '../models/client-side-model'), // do not include models on the client side - the app/api files contain server side and client side code
    new webpack.HotModuleReplacementPlugin(), // DO NOT use --hot in the command line - it will cause a stack overflow on the client
  ],
}
