# 【Node.js, NestJS】バックエンドにJavaScriptを選定する際のリスク

作成者: YamagishiK
最終更新日時: 2023年7月11日 11:16

出典:[【Node.js, NestJS】バックエンドにJavaScriptを選定する際のリスク](https://www.youtube.com/watch?v=0Ch49h2KerA)

NestJSはExpress をもとに作成された.

ExpressやNestJSといったフレームワークは比較的に安定しているが，ライブラリは壊滅的な変更が

なされる場合がある. 

NestJSの周辺機能にクセモノがいる. 

例えば, 

- TypeORM(ORMのライブラリ)のMigrationコマンド(データベースのスキーマ変更を管理する)の仕様が変更された際に, ドキュメント通りに動かない.
- bcrypt(パスワードのハッシュ化のライブラリ)は, HostOS上ではinstallできないのでDockerコンテナでnpm installする必要がある.

ORM: **オブジェクト関係マッピング**（[英](https://ja.wikipedia.org/wiki/%E8%8B%B1%E8%AA%9E): **Object-relational mapping**、**O/RM**、**ORM**）

オブジェクト指向言語から使える「仮想」[オブジェクトデータベース](https://ja.wikipedia.org/wiki/%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9)を構築する手法