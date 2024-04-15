# constアサーション「as const」 (const assertion)

作成者: FukumaNaoya
最終更新日時: 2023年7月14日 10:34

### `readonly`はプロパティごとにつけられる[](https://typescriptbook.jp/reference/values-types-variables/const-assertion#readonly%E3%81%AF%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3%E3%81%94%E3%81%A8%E3%81%AB%E3%81%A4%E3%81%91%E3%82%89%E3%82%8C%E3%82%8B)

`const assertion`はオブジェクト全体に対する宣言なので、すべてのプロパティが対象になりますが、`readonly`は必要なプロパティのみにつけることができます。

### `const assertion`は再帰的に`readonly`にできる[](https://typescriptbook.jp/reference/values-types-variables/const-assertion#const-assertion%E3%81%AF%E5%86%8D%E5%B8%B0%E7%9A%84%E3%81%ABreadonly%E3%81%AB%E3%81%A7%E3%81%8D%E3%82%8B)

ネストしていても影響を及ぼすことができる