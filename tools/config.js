const { browserslist } = require('../package.json');

module.exports = {
  dest: {
    dev: '.tmp',
    build: 'build',
  },

  // この項目に要素を追加すると[copy:[KEY_NAME]]という名称で勝手にtaskも増えます。
  copy: {
    assets: ['assets/**/*'],
  },

  rev: {
    src: 'build/**/*.{js,css,png,gif,jpg,jpeg,svg,eot,ttf,woff,ico}',
    dest: 'build',
    manifestFileName: 'manifest.json',
    isEnable: false   // ここをtrueにすると生成ファイルにハッシュが付きます。ただし差分ビルドが死にます。
  },

  revReplace: {
    src: ['build/index.html', 'build/**/*.{js,css,html}'],
    dest: 'build',
  },

  view: {
    src: ['src/views/**/*.ejs', '!src/views/**/_*'],
    watch: ['src/views/**/*.ejs'],
    rename (path) {
      // TODO: ちょっと複雑感あるので、一旦コメントアウト
      // if (path.basename === 'index') {
      //   return;
      // }

      // let basename = 'index';
      // let dirname = `${path.dirname}/`;

      // dirname += path.basename.split('.').reduce((str, item) => {
      //   if (item.charAt(0) === '_') {
      //     basename = item.substr(1);
      //   } else {
      //     str += `${item}/`;
      //   }
      //   return str;
      // }, '');

      // path.basename = basename;
      // path.dirname = dirname;
    },
  },

  style: {
    src: ['src/**/*.css', '!src/**/_*', '!src/components/**/*', '!src/assets/**/*'],
    watch: ['src/**/*.css', 'src/components/**/*.css'],
    urlOption: { filter: ['./**/*'], url: 'inline' },
    autoprefixerOption: { grid: true },
    cssnanoOption: {
      // for postcss-fixes  https://www.npmjs.com/package/postcss-fixes#recommended-usage
      safe: true,
      calc: false
    }
  },

  script: {
    src: ['src/**/*.{js,jsx}', '!src/**/_*', '!src/components/**/*', '!src/assets/**/*'],
    watch: ['src/**/*.{js,jsx}', 'src/components/**/*.{js,jsx}'],
    entry: {
      vendor: [
        // useBuiltIns: trueが効かなくなるためvendorからは外す
        // 'babel-polyfill',
        'jquery',
      ],
      index: './src/js/index.js',
    },
    babelOptions: {
      presets: [
        ['env', {
          // package.jsonで指定したbrowserslistを利用する
          targets: { browsers: browserslist },
          // babel-polyfillのうちbrowserslistを踏まえて必要なものだけ読み込む
          useBuiltIns: true,
          // productionの場合tree shakingを有効化
          modules: process.env.NODE_ENV === 'production' ? false : 'commonjs',
          // developmentの際にデバッグ情報を出力する
          debug: process.env.NODE_ENV === 'development'
        }],
        'flow'
      ],
      plugins: [
        'transform-object-rest-spread'
      ],
      cacheDirectory: true,
      babelrc: false
    }
  },

  browser: {
    notify: false,
    port: 9012,
    reloadDebounce: 500,
    server: {
      baseDir: ['.tmp'],
      routes: {
        '/': 'assets'
      },
    },
  },
};

