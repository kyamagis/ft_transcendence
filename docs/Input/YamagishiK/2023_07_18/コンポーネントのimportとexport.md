# 【新・日本一わかりやすいReact入門【基礎編】コンポーネントのimportとexport

作成者: YamagishiK
最終更新日時: 2023年7月18日 10:12

## 1ファイル = 1モジュール

## export の種類
- default export (名前なしexport)
  - 推奨されているexport方法(誰に？)
  - 1 ファイル = 1 export
  - 正確に言うとdefaultという名前でexport している
  ```Javascript
  // アロー関数の default export
  const Title = (props) => {
    return <h2>{props.title}</h2>
  };
  export default Title;
  
  ```
  ```Javascript
  // 名前付き関数の default export
  export default function Title(props) {
    return <h2>{props.title}</h2>
  }
  
  ```
- 名前付きexport
  - 1ファイルから複数モジュールをexportしたいときに使用する
  ```Javascript
    // helper.js
    export const addTax = (price) => {
      return Math.floor(price * 1.1);
    };

    export const getWild = () => {
      console.log("Get wild and touch);
    }
  ```
- 別名export
  - default export に as で名前をつけてexport する
  ```Javascript
    export {default as Article} from "./Article"
  ```
- エントリーポイント
  - export するコンポーネントを1つのファイルにまとめたもの. JS版ヘッダーファイル
  - 慣例的にファイル名は, index.jsにする
  ```Javascript
    // index.js
    export {default as Article} from "./Article"
    export {default as Content} from "./Content"
    export {default as Title} from "./Title"
  ```


## import の種類

- default import (名前なしimport)
  - default export したモジュールをそのまま読み込む

  ```Javascript
    // 書式
  import モジュール名 from "ファイルパス"
  ```
  ```Javascript
    // App.jsx (親)
    import  Article from "./comport/Article";

    function APP() {
      return (
        <div>
          <Article
            title={"React"}
            content={"propsについて"}
          />
        </div>
      )
    };

    export default App;
  ```

  ```Javascript
    // components/Article.jsx (子)
    const Article = () => {
      return (
        <div>
          <h2>{props.title}</h2>
          <p>{props.content}</p>
        </div>
      );
    };

    export default Article;
  ```
- 名前付きimport
  - 1ファイルから複数モジュールを読み込む
  - エントリポイントから複数コンポーネントを読み込む
  ```Javascript
    import {Content, Title} from "./index"

    const Article = (props) => {
      return (
        <div>
          <Title title={props.titlw} />
          <Content content={props.content} />
        </div>
      );
    };

    export default Article;
  ```
  