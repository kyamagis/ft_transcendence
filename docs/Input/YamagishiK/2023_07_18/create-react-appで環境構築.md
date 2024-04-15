# 【新・日本一わかりやすいReact入門【基礎編】create-react-appで環境構築

作成者: YamagishiK
最終更新日時: 2023年7月18日 10:12

## create-react-appとは

Reactの環境構築をしてくれるツール

本来の環境構築はトランスパイラのBabel, バンドラーのWebpackが必要だが，それらの設定をせずに環境構築をしてくれる.

## npx create-react-appの生成物
 - src
   - 開発用ファイルが格納
   - ReactコンポーネントのJSXファイルなどはここに置く
 - public
    - 静的ファイルが格納
    - htmlファイルや画像ファイルなど
 - build
    - 本番用ファイルが格納
    - npm run buildコマンドで生成

## npm スクリプト

  - npm start 
    - ローカルサーバーを起動してReactアプリを確認できる.
    - ホットリロードに対応(ファイル保存で自動更新)
  - npm run build
    - 本番ファイルを生成してbuildディレクトリに出力
    - srcとpublicのファイルを一つにまとめる(バンドル)
  - npm run eject (なるぺく使わないほうがいい)
    - BabelやWebpackの設定を変えたいときに使用
