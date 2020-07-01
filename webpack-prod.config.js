const path = require('path')
const webpack = require('webpack')

const use = [
  {
    loader: 'babel-loader',
  },
]

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, 'app'),
  entry: {
    main: './client/main.js',
  },
  devtool: 'source-map',
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
  plugins: [
    new webpack.IgnorePlugin(/nodemailer/), // not used in the client side - those should be move outside of the app directory
  ],
}
