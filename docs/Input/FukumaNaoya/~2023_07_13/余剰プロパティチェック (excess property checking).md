# 余剰プロパティチェック (excess property checking)

作成者: FukumaNaoya
最終更新日時: 2023年7月13日 13:23

# **余剰プロパティチェック (excess property checking)**

TypeScriptのオブジェクトの型には余剰プロパティチェック(excess property checking)という、追加のチェックが働く場合があります。余剰プロパティチェックとは、オブジェクトの型に存在しないプロパティを持つオブジェクトの代入を禁止する検査です。

たとえば、`{ x: number }`はプロパティ`x`が必須なオブジェクトの型です。この型に`{ x: 1, y: 2 }`のような値を代入しようとします。この代入は許可されるでしょうか。代入値の型は、必須プロパティの`{ x: number }`を満たしているので問題なさそうです。ところが、この代入は許可されません。

```jsx
let onlyX: { x: number };
onlyX = { x: 1 }; // OK
onlyX = { x: 1, y: 2 }; // コンパイルエラー
Type '{ x: number; y: number; }' is not assignable to type '{ x: number; }'.
  Object literal may only specify known properties, and 'y' does not exist in type '{ x: number; }'.Type '{ x: number; y: number; }' is not assignable to type '{ x: number; }'.
  Object literal may only specify known properties, and 'y' does not exist in type '{ x: number; }'.
コピー
```

このとき、「Object literal may only specify known properties, and 'y' does not exist in type '{ x: number; }'.」というコンパイルエラーが発生します。なぜこれがコンパイルエラーになるかというと、`{ y: 2 }`が余計だと判断されるからです。こうした余計なプロパティを許さないTypeScriptのチェックが余剰プロパティチェックなのです。

## 余剰プロパティチェックはオブジェクトリテラルだけを検査する[](https://typescriptbook.jp/reference/values-types-variables/object/excess-property-checking#%E4%BD%99%E5%89%B0%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%AF%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%83%AA%E3%83%86%E3%83%A9%E3%83%AB%E3%81%A0%E3%81%91%E3%82%92%E6%A4%9C%E6%9F%BB%E3%81%99%E3%82%8B)

余剰プロパティチェックはオブジェクトの余計なプロパティを禁止するため、コードが型に厳密になるよう手助けをします。しかし、余剰プロパティチェックが効くのは、オブジェクトリテラルの代入に対してのみです。なので、変数代入にはこのチェックは働きません。

```jsx
const xy: { x: number; y: number } = { x: 1, y: 2 };
let onlyX: { x: number };
onlyX = xy; // OK

```

変数代入にも余剰プロパティチェックが働いたほうが良さそうと思われるかもしれません。型が厳密になるからです。しかし、そうなっていないのは、TypeScriptが型の安全性よりも利便性を優先しているためです。

```jsx
let onlyX: { x: number };
onlyX = { x: 1, y: 2 };
console.log(onlyX.y); // Error: Property 'y' does not exist on type '{ x: number; }'

```

このコードは、TypeScriptのコンパイラーから見ると`onlyX`の型は`{ x: number }`と宣言されているため、プロパティ`y`が存在しないとみなします。そのため、`console.log(onlyX.y);`の部分でTypeScriptのコンパイラーはエラーを出します。

しかし、このコードをJavaScriptとして実行すると、`onlyX`は実際にはプロパティ`y`を持つオブジェクト`{ x: 1, y: 2 }`が代入されているため、`console.log(onlyX.y);`は`2`を出力します。

JavaScriptでは、存在しないプロパティへのアクセスは`undefined`を返します。しかし、この場合`y`プロパティは実際には存在しています。私の前の説明では、この点を誤って説明していました。そのため、お指摘の通り、私の前の説明は矛盾していました。申し訳ありません。

よって、修正すると以下のようになります：

「上記のコードをJavaScriptとして実行した場合、エラーにはならず、onlyX.yの評価結果は2となります。なぜなら、JavaScriptは動的型付け言語であり、実際に存在するプロパティへのアクセスはそのプロパティの値を返すからです。」