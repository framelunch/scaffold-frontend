const webpack = require('webpack');

const conf = require('../config');
const base = require('./base');

module.exports = {
  ...base,
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': "'development'" }),
  ]
};
