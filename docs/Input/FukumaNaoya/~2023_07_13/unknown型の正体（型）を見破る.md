# unknown型の正体（型）を見破る

作成者: FukumaNaoya
最終更新日時: 2023年7月14日 12:05

```tsx
const value: unknown = "";
// 型ガード
if (typeof value === "string") {
// ここブロックではvalueはstring型として扱える
console.log(value.toUpperCase());
}
```

typeofは、変数の型を調べるのではなく、

実際に入っている値の型を調べるもの

なので、変数の型がunknown型でも、

上記の例だと空文字列が入っているので、”string”と判定できる！

そうすると、コンパイラは安心して”value”をstring型として扱えるので、

コンパイルエラーを吐かない