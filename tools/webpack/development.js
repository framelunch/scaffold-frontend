const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const conf = require('../config');
const base = require('./base');

module.exports = {
  ...base,
  entry: Object.entries(base.entry).reduce((tmp, [key, value]) => {
    tmp[key] = [
      `webpack-dev-server/client?http://localhost:${conf.ports.webpackDevServer}`,
      'webpack/hot/only-dev-server',
      ...(value instanceof Array ? value : [value]),
    ];
    return tmp;
  }, {}),
  mode: 'development',
  devtool: 'inline-source-map',
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
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...base.plugins,
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': "'development'" }),
    new webpack.NamedModulesPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
  devServer: {
    publicPath: base.output.publicPath,
    contentBase: [
      path.join(process.cwd(), conf.dest.dev),
      path.join(process.cwd(), 'assets'),
      path.join(process.cwd(), '_template'),
    ],
    port: conf.ports.webpackDevServer,
  },
};
