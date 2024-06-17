re# ft_transcendence

![demo](https://github.com/kyamagis/ft_transcendence/blob/master/Pong.gif)

## 注意事項
- 起動するためには ./backend/.env/.env.prod の"change"の部分を書き換える必要がある

## 起動方法
- docker compose up -d

## URL
- http://localhost:5000/

## docker
### devの立ち上げについて
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
