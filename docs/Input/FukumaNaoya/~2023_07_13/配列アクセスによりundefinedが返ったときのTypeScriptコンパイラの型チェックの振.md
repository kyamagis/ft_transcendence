# 配列アクセスによりundefinedが返ったときのTypeScriptコンパイラの型チェックの振る舞い

作成者: FukumaNaoya
最終更新日時: 2023年7月13日 23:30

要素アクセスで得た値は`string`と`undefined`どちらの可能性もありながら、TypeScriptは常にstring型であると考えるようになっています。そのため、要素アクセスで`undefined`が返ってくる場合のエラーはTypeScriptでは発見できず、JavaScript実行時に判明することになります。

```tsx
const abc = ["a", "b", "c"];
const character: string = abc[100];
console.log(character);
undefinedcharacter.toUpperCase();
 -> Cannot read properties of undefined (reading 'toUpperCase')
```

## TypeScriptで要素アクセスを型安全にする設定[](https://typescriptbook.jp/reference/values-types-variables/array/how-to-access-elements-in-an-array#typescript%E3%81%A7%E8%A6%81%E7%B4%A0%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%82%92%E5%9E%8B%E5%AE%89%E5%85%A8%E3%81%AB%E3%81%99%E3%82%8B%E8%A8%AD%E5%AE%9A)

TypeScriptにこの問題を指摘してもらうようにするには、コンパイラーオプションの`noUncheckedIndexedAccess`を有効にします。

**[📄️ noUncheckedIndexedAccess**
インデックス型のプロパティや配列要素を参照したときundefinedのチェックを必須にする](https://typescriptbook.jp/reference/tsconfig/nouncheckedindexedaccess)

これを有効にすると、たとえば、`string[]`配列から要素アクセスで得た値の型は、string型もしくはundefined型を意味する`string | undefined`になります。

```tsx
const abc: string[] = ["a", "b", "c"];
const character: string | undefined = abc[0];
character.toUpperCase();
 -> Object is possibly 'undefined'.
```

`string | undefined`型のままでは`toUpperCase`などのstring型のメソッドは呼び出せません。そこで、if文で変数がstring型だけになるように絞り込みます。すると、string型のメソッドを呼び出してもコンパイルエラーで指摘されることがなくなります。

```tsx
const abc: string[] = ["a", "b", "c"];
const character = abc[0];
// 絞り込み条件
if (typeof character === "string") {
  character.toUpperCase(); // コンパイルエラーにならない
}

```

配列要素へのアクセスを安全にするために、`noUncheckedIndexedAccess`を有効にしておくことを推奨します。