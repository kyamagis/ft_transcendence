# constとreadonlyの違い

作成者: FukumaNaoya
最終更新日時: 2023年7月13日 23:06

## constとreadonlyの違い[](https://typescriptbook.jp/reference/values-types-variables/object/readonly-vs-const#const%E3%81%A8readonly%E3%81%AE%E9%81%95%E3%81%84)

`const`は変数自体を代入不可するものです。変数がオブジェクトの場合、プロパティへの代入は許可されます。一方、`readonly`はプロパティを代入不可にするものです。変数自体を置き換えるような代入は許可されます。以上の違いがあるため、`const`と`readonly`を組み合わせると、変数自体とオブジェクトのプロパティの両方を変更不能なオブジェクトを作ることができます。

```tsx
const obj: { readonly x: number } = { x: 1 };
obj = { x: 2 };
Cannot assign to 'obj' because it is a constant.Cannot assign to 'obj' because it is a constant.obj.x = 2;
Cannot assign to 'x' because it is a read-only property.Cannot assign to 'x' because it is a read-only property.
コピー
```