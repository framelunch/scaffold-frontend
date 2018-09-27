module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // productionの場合tree shakingを有効化
        modules: process.env.NODE_ENV === 'production' ? false : 'commonjs',
        // developmentの際にデバッグ情報を出力する
        debug: process.env.NODE_ENV === 'development',
        // polyfill必要に応じて自動import
        // おかしかったらentryにしてね
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-flow',
  ],
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
};
