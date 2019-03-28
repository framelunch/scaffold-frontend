const path = require('path');
const Dotenv = require('dotenv-webpack');

const conf = require('../config');

module.exports = {
  entry: conf.script.entry,
  output: {
    path: path.join(process.cwd(), conf.dest.build),
    filename: '[name].js',
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      name: 'js/vendor.bundle',
      chunks: 'initial',
    },
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['json', '.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
      {
        test: /\.svg$/,
        use: 'svg-inline-loader',
      },
      {
        test: /\.(txt|log|md|frag|vert|glsl)$/,
        use: 'raw-loader',
      },
    ],
  },
  plugins: [new Dotenv()],
};
