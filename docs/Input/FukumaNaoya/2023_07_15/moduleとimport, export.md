## moduleの単位はファイル

## エクスポートの仕方は２種類
  - デフォルトエクスポート(１moduleにつき１つ) : `export default {関数名やオブジェクト名}`
  - 名前付きエクスポート（１moduleにつき複数可） : `export {関数名やオブジェクト名}`

## インポートの仕方も２種類
 - デフォルトインポート : `import {参照名を任意に設定} from '{特定のファイルpath}';`
 - 名前付きインポート : `import {インポート元で決められた名前} from '{特定のファイルpath}';`

## 具体例

### case 1
ポイントは、名前付きインポートの対象が複数のときのインポートの仕方
```javascript
// myModule.js

export default function() {
  console.log('Hello, world!');
}

export function func1() {
  console.log('This is function 1');
}

export function func2() {
  console.log('This is function 2');
}
-------------

// app.js

import greet, { func1, func2 } from './myModule.js';

greet(); // Hello, world!
func1(); // This is function 1
func2(); // This is function 2
```
### case 2
ポイントは、デフォルトエクスポートするオブジェクトに複数の関数を入れる
```javascript
// myModule.js

function func1() {
  console.log('This is function 1');
}

function func2() {
  console.log('This is function 2');
}

export default {
  func1,
  func2
};
------------------------
// app.js

import myFunctions from './myModule.js';

myFunctions.func1(); // This is function 1
myFunctions.func2(); // This is function 2

```

## 補足
エクスポートの形式については、企業やプロジェクトによって様々な規約が存在します。以下に、一部の主要なJavaScriptフレームワークやライブラリの開発者、およびコード品質ツールが推奨しているスタイルを示します。

1. **Airbnb**: AirbnbのJavaScriptスタイルガイドは、可能な限り名前付きエクスポートを使用することを推奨しています。その理由は、名前付きエクスポートがリファクタリングを容易にし、エディタが自動補完と検索機能をよりよく提供できるからです。

2. **React**: Reactコンポーネントをエクスポートする際、Reactの公式ドキュメントはデフォルトエクスポートの使用を示しています。しかし、具体的な推奨は行われていません。

3. **ESLint**: ESLintの`import/prefer-default-export`ルールを使用すると、モジュールが一つの名前付きエクスポートのみを含む場合にデフォルトエクスポートを推奨します。ただし、このルールを適用するかはプロジェクトによります。

これらは具体的な規約や推奨事項の一部に過ぎません。重要なのは、プロジェクト固有の規約やチームの合意に基づいて統一されたスタイルを採用することです。一部のプロジェクトではデフォルトエクスポートを禁止し、名前付きエクスポートのみを使用するなど、異なるアプローチをとることもあります。また、TypeScriptを使用する場合は、名前付きエクスポートが型のリファクタリングや管理を容易にするため、より一層推奨されます。
