# object型は使わない

作成者: FukumaNaoya
最終更新日時: 2023年7月13日 23:05

## `object`型[](https://typescriptbook.jp/reference/values-types-variables/object/type-annotation-of-objects#object%E5%9E%8B)

オブジェクトの型注釈には`object`型を用いることもできます。

```tsx
let box: object;
box = { width: 1080, height: 720 };

```

`object`型の使用はお勧めしません。第1の理由は、`object`型には何のプロパティがあるかの情報がないためです。そのため、`box**.width`を参照するとコンパイルエラーになります。（アホすぎ）**

```tsx
box.width;
Property 'width' does not exist on type 'object'.Property 'width' does not exist on type 'object'.
```

第2の理由はどんなオブジェクトでも代入できるからです。期待しない値も代入できてしまうので、コードの問題に気づきにくくなります。

```tsx
let box: object;
box = { wtdih: 1080, hihget: 720 }; // スペルミス

```

オブジェクトを型注釈する場合は、`object`型はできるだけ使わずに、プロパティまで型を定義することをお勧めします。