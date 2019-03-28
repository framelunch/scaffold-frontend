// @flow

/**
 * アプリ内で一度だけ読み込むファイルをここに書く
 * e.g. polyfill, RxJS
 */
import '../modules/DeviceChecker';
import * as Configs from './config';

if (Configs.author) {
  console.log('Dev by', Configs.author);
}
