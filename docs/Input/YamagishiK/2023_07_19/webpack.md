# webpack

作成者: YamagishiK
最終更新日時: 2023年7月19日 10:12

参考: https://ics.media/entry/12140/

## webpackとは
JavaScript 向けのモジュールバンドラである.
  - バンドラとは, 複数のモジュールを依存関係を解決して一つにまとめるものである.
『webpackとbabelの使用は, 意識していなかった』H氏談

## webbackの特徴
- 複数のJavaScriptファイルを一つにまとめることで、ブラウザからのリクエスト数を減らし、ファイル転送の最適化をする.
- モジュールには標準仕様のECMAScript Modules（通称、ES ModulesやESMと呼ばれます）や、Node.jsで旧来より用いられているCommonJS形式のモジュールなど、さまざまなモジュールの形式があるが, webpackはどの形式にも対応しており、モジュールをバンドルする.
- webpackはJavaScriptだけでなくスタイルシートや画像をバンドルする.

## webpackの使用例

以下の階層とコードを用意する.

```
.
├── package-lock.json
├── package.json
└── src
    ├── console.js
    ├── index.js
    └── toUpper.js

```
```javascript

//./src/console.js 

import toUpper from './toUpper.js'

const console = () => {
    console.log(toUpper("duel!!!"));
}

console();
export default console

```
```javascript

//./src/index.js 
// エントリポイントは, import の列挙とソースコードを書き込む.
import { default as console } from "./console.js";

console();

```
```javascript

//./src/toUpper.js 

function toUpper(string) {
  return (string.toUpper() )
};

export default toUpper;

```

ここで, rootディレクトリで
```
yarn webpack
```
を実行すると, rootディレクトリに./dist/main.jsが生成される.
./dist/main.jsにsrc配下のコードがまとめられる.
以下が./dist/main.jsの内容である.
```javascript
// ./dist/main.js
(()=>{"use strict";const t=()=>{t.log("duel!!!".toUpper())};t(),t()})();
```

エントリポイントがmainファイル的な役割をする.
どのファイルをエントリポイントにするかはconfigで決定する.
defaultでは, index.jsがエントリポイントである.
