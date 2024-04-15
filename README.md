re# ft_transcendence
## docker
### 起動方法について
- root階層にて`npm run start:dev` | `npm run start:prod` （ログが混ざるので注意）
- ./frontend、 ./backend それぞれで`npm run start:dev` | `npm run start:prod` で立ち上げることも可能

### dev, prod, testの切り替えについて
- `npm run down` でコンテナを削除してからでないと、docker-composeが使用するyamlが切り替わらないので注意

## frontend
### API Mockingについて
- frontendの単体テストでは、APIのモックを使用
- dev, prodではデフォルトでAPIモックを使用していないが、以下設定で使用可能
```.env
NEXT_PUBLIC_API_MOCKING=true
```

## backend
### DB seedについて
- dev, test環境では, prisma seedでデータベースを初期化していルので、テストに使いたいデータはseed.tsに記載する
### prisma migrationについて
- dbコンテナが立ち上がった状態で、`npm run migrate:dev`を実行する
