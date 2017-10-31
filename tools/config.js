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
    src: ['src/**/*.{ts,tsx}', '!src/**/_*', '!src/components/**/*', '!src/assets/**/*'],
    watch: ['src/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    entry: {
      vendor: [
        'babel-polyfill',
        'jquery',
      ],
      index: './src/js/index.ts',
    },
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
