const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const conf = require('../config');
const base = require('./base');

const tsconfigPath = path.join(process.cwd(), 'tsconfig.production.json');

module.exports = {
  ...base,
  mode: 'production',
  module: {
    rules: [
      ...base.module.rules,
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          'cache-loader',
          {
            loader: 'ts-loader',
            options: {
              configFile: tsconfigPath,
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...base.plugins,
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': "'production'" }),
    new ForkTsCheckerWebpackPlugin({ tsconfig: tsconfigPath }),
  ],
};
