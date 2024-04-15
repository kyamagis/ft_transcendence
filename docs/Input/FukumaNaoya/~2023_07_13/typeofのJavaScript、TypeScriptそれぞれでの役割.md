# typeofのJavaScript、TypeScriptそれぞれでの役割

作成者: FukumaNaoya
最終更新日時: 2023年7月14日 12:01

問題意識：

型の情報を取り出すtypeofは、型を扱うTypeScript特有の機能と思ってしまっていた

JavaScriptとTypeScriptの`typeof`オペレータの使い方について比較すると以下のようになります：

## JavaScript

JavaScriptでは、`typeof`オペレータはランタイム時に値のデータ型を判定するために使用されます。以下に例を示します：

```tsx
let num = 42;
console.log(typeof num); // "number"

let str = "Hello, world!";
console.log(typeof str); // "string"

let func = function() {};
console.log(typeof func); // "function"

```

このように、JavaScriptの`typeof`は実行時にその時点での値の型を判定します。`typeof`を使うことで、数値、文字列、オブジェクト、関数などのJavaScriptの基本的なデータ型を判別できます。

## TypeScript

TypeScriptでは、`typeof`オペレータはJavaScriptの使い方と同様の方法で使うことができますが、さらに高度な使い方もあります。TypeScriptの`typeof`は、型クエリとしても利用することができます。これは、ある変数の型を動的に取得し、他の変数やパラメータの型として使うことができるという機能です。

例えば：

```tsx
let s = "hello";
let n: typeof s;

n = "world"; // OK
n = 42; // Error: Type '42' is not assignable to type 'string'

```

この場合、`n`の型は`typeof s`となります。つまり、`s`の型である`string`となります。これにより、プログラム中で動的に型を取得し、それを他の場所で使うことが可能になります。この機能は、特に大規模なプログラムやライブラリの開発で役立つことがあります。

また、TypeScriptでは`typeof`を使った型ガードというものも存在します。これは特定のブロック（ifブロックやswitchブロックなど）内で、特定の型が保証されるような条件を作り出すことができます。

以上のように、JavaScriptとTypeScriptの`typeof`は基本的な使い方は同じですが、TypeScriptでは型の情報をより効果的に扱うための追加的な機能が提供されています。