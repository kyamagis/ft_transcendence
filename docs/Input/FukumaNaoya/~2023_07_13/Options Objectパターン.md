# Options Objectパターン

作成者: FukumaNaoya
最終更新日時: 2023年7月14日 16:34

結構良さそう

ポイント　引数をオブジェクトにし、関数呼び出しにオブジェクトリテラルを使う

## Options Objectパターンの利点[](https://typescriptbook.jp/reference/functions/keyword-arguments-and-options-object-pattern#options-object%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3%E3%81%AE%E5%88%A9%E7%82%B9)

Options Objectパターンの利点は次の3つがあります。

- 引数の値が何を指すのか分かりやすい
- 引数追加時に古いコードを壊さない
- デフォルト引数が省略できる

具体例）

```tsx
findUsers({
  country: "JP",
  city: "Tokyo",
  ageMin: 10,
  ageMax: 20,
  order: "id",
  sort: "asc",
});

findUsers({ country: "JP", city: "Tokyo", order: "id", sort: "asc" });
findUsers({ country: "JP"});
```

オブジェクトリテラルは、{}で、キーと値を並べるので、値がマジックナンバーにならないので、わかりやすい

オブジェクトリテラルは順番関係ないので、引数（オブジェクトのプロパティ）追加で順番変えたくなっても大丈夫

オブジェクトリテラルが指定されていないプロパティにアクセスすると、自動的にundefinedが検知される。