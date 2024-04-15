# object、Object、{}の違い

作成者: FukumaNaoya
最終更新日時: 2023年7月13日 15:37

![Untitled](object%E3%80%81Object%E3%80%81%7B%7D%E3%81%AE%E9%81%95%E3%81%84%2021de0d6524d2457b9456ba1b5f7b0964/Untitled.png)

プリミティブ型でも、自動ボックス化（ラッパーオブジェクトへの暗黙の変換）が存在する場合、代入の構文がエラーとならない！

`Object`型は[TypeScriptの公式ドキュメントで使うべきでないとされています](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#number-string-boolean-symbol-and-object)。理由はプリミティブ型も代入できてしまうためです。もしオブジェクトだけをなんでも代入可にしたい場合は、代わりに`object`型を検討すべきです。

### object型[](https://typescriptbook.jp/reference/values-types-variables/object/difference-among-object-and-object#object%E5%9E%8B)

`object`型はオブジェクトだけが代入できる型です。JavaScriptの値はプリミティブ型かオブジェクトの2つに大分されるので、`object`型はプリミティブ型が代入できない型とも言えます。

```tsx
let a: object;
a = { x: 1 }; // OK
a = [1, 2, 3]; // OK。配列はオブジェクト
a = /a-z/; // OK。正規表現はオブジェクト

// プリミティブ型はNG
a = 1;
Type 'number' is not assignable to type 'object'.Type 'number' is not assignable to type 'object'.a = true;
Type 'boolean' is not assignable to type 'object'.Type 'boolean' is not assignable to type 'object'.a = "string";
Type 'string' is not assignable to type 'object'.

```

### Object型[](https://typescriptbook.jp/reference/values-types-variables/object/difference-among-object-and-object#object%E5%9E%8B-1)

`Object`型はインターフェースです。`valueOf`などのプロパティを持つ値なら何でも代入できます。したがって、`Object`型には`null`や`undefined`を除くあらゆるプリミティブ型も代入できます。string型やnumber型などのプリミティブ型は自動ボックス化により、オブジェクトのようにプロパティを持てるからです。

```tsx
let a: Object;
a = {}; // OK

// ボックス化可能なプリミティブ型OK
a = 1; // OK
a = true; // OK
a = "string"; // OK

// nullとundefinedはNG
a = null;
Type 'null' is not assignable to type 'Object'.Type 'null' is not assignable to type 'Object'.a = undefined;
Type 'undefined' is not assignable to type 'Object'.Type 'undefined' is not assignable to type 'Object'.
コピー
```

### {}型[](https://typescriptbook.jp/reference/values-types-variables/object/difference-among-object-and-object#%E5%9E%8B)

`{}型`は、プロパティを持たないオブジェクトを表す型です。プロパティを持ちうる値なら何でも代入できます。この点は`Object`型と似ていて、`null`や`undefined`を除くあらゆる型を代入できます。

```
let a: {};
a = {}; // OK

// ボックス化可能なプリミティブ型OK
a = 1; // OK
a = true; // OK
a = "string"; // OK

// nullとundefinedはNG
a = null;
Type 'null' is not assignable to type '{}'.Type 'null' is not assignable to type '{}'.a = undefined;
Type 'undefined' is not assignable to type '{}'.

```