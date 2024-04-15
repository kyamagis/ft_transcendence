# Type predicateによるユーザー定義の型ガード関数

作成者: FukumaNaoya
最終更新日時: 2023年7月14日 17:29

関数の返り値が、コンパイラさんに、真偽値に型情報を伝える。

これによって、型ガードに使える関数になる。

Type predicateの宣言は戻り値が`boolean`型の関数に対して適用できる。

型ガード（type guard）とは、あるスコープ（条件文内など）で変数が特定の型であることをTypeScriptの型チェッカーに伝えるためのものです。単純な真偽値を返す関数は、その関数が真を返す場合に引数が特定の型であることを型チェッカーに伝える情報を提供しないため、型ガードとしては機能しません。

以下の2つの例を考えてみましょう：

例1：

```tsx
function isString(value: unknown): boolean {
    return typeof value === 'string';
}

```

例2：

```tsx
function isString(value: unknown): value is string {
    return typeof value === 'string';
}

```

両方の関数は同じ条件をチェックしますが、2つ目の関数は `value is string` という型ガードを提供します。このため、以下のようなコードを書くことができます：

```tsx
const value: unknown = "hello";

if (isString(value)) {
    console.log(value.toUpperCase());  // TypeScriptはvalueがstring型であることを認識する
}

```

ここで `isString` 関数は `value is string` を返しているため、if文の内部では `value` を `string` として扱うことができます。つまり、型チェッカーは `value` が `string` であると認識してくれます。

しかし、最初の `isString` 関数の場合、`boolean` を返すだけなので、これが型ガードとして機能することはありません。つまり、`value` の型についての追加情報は提供されず、`value` が `string` 型であると型チェッカーに伝えることはできません。