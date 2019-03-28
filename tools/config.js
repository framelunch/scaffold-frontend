const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config();

const ports = {
  browserSync: parseInt(process.env.PORT_DEV, 10) || 9012,
  webpackDevServer: parseInt(process.env.PORT_WDS, 10) || 13000,
};
exports.ports = ports;

exports.dest = {
  dev: '.tmp',
  build: 'build',
};

// この項目に要素を追加すると[copy:[KEY_NAME]]という名称で勝手にtaskも増えます。
exports.copy = {
  // assets: [
  //   'assets/**/*',
  // ],
  'b.assets': ['assets/**/*', '!assets/**/*.{jpg,jpeg,gif,png}'],
};

exports.image = {
  createWebp: process.env.USE_WEBP === 'true',
  src: ['assets/**/*.{jpg,jpeg,png}', 'assets/**/*.gif'],
  // PNG形式: https://www.npmjs.com/package/imagemin-pngquant
  png: {
    // クオリティ 0(やり過ぎ) ~ 1(ほぼそのまま)
    quality: [0.65, 0.8],
    // 処理速度を指定 1(じっくり) ~ 10(最速) 5％くらい質に違いが出るらしい
    speed: 1,
    // ディザリングを設定 0(無効) ~ 1(最大)
    floyd: 0,
    // フロイド-スタインバーグ・ディザリングを無効化するか
    // https://ja.wikipedia.org/wiki/%E3%83%95%E3%83%AD%E3%82%A4%E3%83%89-%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%B3%E3%83%90%E3%83%BC%E3%82%B0%E3%83%BB%E3%83%87%E3%82%A3%E3%82%B6%E3%83%AA%E3%83%B3%E3%82%B0
    nofs: false,
  },
  // JPG形式: https://www.npmjs.com/package/imagemin-mozjpeg
  jpg: {
    // クオリティ 0(やり過ぎ) ~ 100(ほぼそのまま)
    quality: 80,
    // プログレッシブjpegを作成するか falseにするとベースラインjpeg
    progressive: true,
  },
  // GIF形式: https://github.com/imagemin/imagemin-gifsicle#imagemingifsicleoptionsbuffer
  gif: {
    // 最適化レベル 1(ちょっと)-3(そこそこ)で指定
    optimizationLevel: 3,
  },
  // SVG形式: https://github.com/svg/svgo#what-it-can-do
  svg: {},
  // WebP形式: https://github.com/imagemin/imagemin-webp#imagemin-webp-
  webp: {
    quality: 80,
  },
  gif2webp: {
    quality: 80,
  },
};

exports.rev = {
  src: 'build/**/*.{js,css,png,gif,jpg,jpeg,svg,eot,ttf,woff,ico}',
  dest: 'build',
  manifestFileName: 'manifest.json',
  isEnable: false, // ここをtrueにすると生成ファイルにハッシュが付きます。ただし差分ビルドが死にます。
};

exports.replace = {
  src: ['build/index.html', 'build/**/*.{js,css,html}'],
  dest: 'build',
};

exports.view = {
  src: ['src/views/**/*.ejs', '!src/views/**/_*'],
  watch: ['src/views/**/*.ejs'],
};

const useScss = process.env.USE_SCSS === 'true';
exports.style = {
  useScss,
  src: [`src/**/*.${useScss ? 's' : ''}css`, '!src/**/_*', '!src/components/**/*', '!src/assets/**/*'],
  watch: [`src/**/*.${useScss ? 's' : ''}css`, `src/components/**/*.${useScss ? 's' : ''}css`],
  urlOption: { filter: ['./**/*'], url: 'inline' },
  autoprefixerOption: { grid: true },
  cssnanoOption: {
    safe: true,
    calc: false,
  },
};

exports.script = {
  src: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/_*', '!src/components/**/*', '!src/assets/**/*'],
  watch: ['src/**/*.{js,jsx,ts,tsx}', 'src/components/**/*.{js,jsx,ts,tsx}'],
  entry: {
    'js/index': './src/js/index.js',
  },
};

exports.spreadsheet = {
  // Spreadsheet ID URLから引っ張る
  id: '1SOa3TeSRJdpcuoTkoRWuhRZDEaFEzt5CJQFThPgv0Ec',
  output: './src/spreadsheet.json',
  sheets: [
    // 以下サンプル なんだか知らないけど列名は小文字になる模様
    {
      key: 'users',
      sheetTitle: 'ユーザ一覧',
      rows: [['id', 'id'], ['name', '名前'], ['age', '年齢']],
    },
    {
      key: 'groups',
      sheetTitle: 'グループ',
      rows: [['key', 'キー'], ['name', '名前']],
    },
  ],
};

exports.browser = {
  notify: false,
  port: ports.browserSync,
  proxy: `http://localhost:${ports.webpackDevServer}`,
  reloadDebounce: 500,
};
