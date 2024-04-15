# npm install —save-dev

作成者: tfujiwar
最終更新日時: 2023年7月13日 21:50

### npm installとの違い

- 開発時 / テスト時の依存関係として、[[package.json]]の`devDependencies`に追加される

### `devDependencies`に含めた方が良いpackageの例

- `@types/`
- `eslint`
- `husky`
- `lint-staged`
- `prettier`
- `tailwindcss`
- `typescript`
- `postcss`

### `tupescript`, `tailwindcss`は本番環境にいらないの?

- `tailwindcss`、`typescript`、および`postcss`は開発時に使用されるツールであり、本番ビルドを作成するために使用されますが、本番環境でアプリケーションを実行するためには必要ありません。

### 結論

- **gptに聞けばうまいこと選り分けてくれる**