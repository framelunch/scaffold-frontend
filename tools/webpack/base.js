const path = require('path');
const customProperties = require('postcss-custom-properties');
const nested = require('postcss-nested');
const importCss = require('postcss-import');
const autoprefixer = require('autoprefixer');

const conf = require('../config');

module.exports = {
  entry: conf.script.entry,
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].map', //inline-source-mapの時は特に必要ないが一応
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['json', '.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'cache-loader',
          'awesome-typescript-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              localIdentName: '[name]-[local]-[hash:base64:5]',
              modules: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                customProperties,
                nested,
                importCss({root: loader.resourcePath}),
                autoprefixer(conf.style.autoprefixerOption)
              ],
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      },
      {
        test: /\.svg$/,
        use: 'svg-inline-loader'
      },
      {
        test: /\.(txt|log|md)$/,
        use: 'raw-loader'
      },
    ],
  },
};

