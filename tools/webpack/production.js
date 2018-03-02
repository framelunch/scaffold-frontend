const webpack = require('webpack');

const conf = require('../config');
const base = require('./base');

process.noDeprecation = true;

module.exports = Object.assign({}, base, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': "'production'" }),
    new webpack.DllReferencePlugin({
      manifest: conf.script.dll.manifest,
      context: process.cwd(),
    }),
  ]
});
