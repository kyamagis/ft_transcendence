# frontendの階層構造

作成者: tfujiwar
最終更新日時: 2023年7月13日 22:26

### feature baseなフォルダ階層にすることで得られるメリット

1. 関心の分離
2. リファクタの容易性
3. コードベースについてのより良い推論
4. チームでの開発を円滑に

### 全体像

![Untitled](frontend%E3%81%AE%E9%9A%8E%E5%B1%A4%E6%A7%8B%E9%80%A0%207dff26bc83af4f73940b240c3121ca78/Untitled.png)

### src/*

```
├─ src
   ├─ components
   ├─ config
   ├─ features
   ├─ layouts
   ├─ lib
   ├─ pages
   ├─ providers
   ├─ stores
   ├─ testing
   ├─ types
   └─ utils

```

### components

- アプリケーション全体で共有されるコンポーネント

### config

- 設定ファイル

### features

- すべての機能ベースのモジュールを含む

### layouts

- ページの異なるレイアウト

### lib

- ライブラリの設定

### pages

- next.jsがルーティングのページを探すディレクトリ

### providers

- すべてのページでプロバイダを利用可能にする、単一のアプリケーションプロバイダをexportする

### stores

- すべてのグローバル状態管理ストア

### testing

- テスト関連のファイル

### types

- Typescript型定義

### utils

- 共有ユーティリティ関数

### src/features/*

- 各featureごとに作成する
- `index.ts`でfeatureのAPIとして、公開すべきものをエクスポートする
- つまり、以下のようにfeature内のcomponentを、別のfeatureからimportしてはいけない

```tsx
import {JobsList} from '@/features/jobs/components/jobs-list'
```

- 代わりに、このようにimportする

```tsx
import {JobsList} from '@/features/jobs'
```