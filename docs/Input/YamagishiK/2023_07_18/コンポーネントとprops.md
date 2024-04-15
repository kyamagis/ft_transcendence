# 【新・日本一わかりやすいReact入門【基礎編】コンポーネントとprops

作成者: YamagishiK
最終更新日時: 2023年7月18日 10:12

## コンポーネントとは
- 見た目と機能を持つUI部品

## コンポーネントの種類
 - クラスコンポーネント
    ```
      import React, {Component} from "react";

      class Button extends Component { // クラスが付く
        render() {
          return <button>Say, {this.props.hell}</button> // thisがつく
        }
      }

      export default Button;
    ```
 - 関数コンポーネント(主流の書き方)
    ```
      import React from "react";

      const Button = (props) => {
        return <button>Say, {props.hello</button>};
      };

      export default Button;
    ```

## 1コンポーネント, 1ファイル

## コンポーネントの基本的な使い方
  - ファイル名は, 大文字
  - 親コンポーネント(呼び出すコンポーネント) でimport
    ```
      // App.jsx (親)
      import  Article from "./comport/Article";
    
      function APP() {
        return (
          <div>
            <Article />
          </div>
        )
      };

      export default App;
    ```
  - 子コンポーネント(呼び出されるコンポーネント)でexport
    ```
      // components/Article.jsx (子)
      const Article = () => {
        return <h2>こんにちは</h2>
      };

      export default Article;
    ```

## propsとは
  - 可変長引数的扱いができるもの
  - propsの値が変更されると再描画される

```
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

```
  // components/Article.jsx (子)
  const Article = (props) => {
    return (
      <div>
        <h2>{props.title}</h2>
        <p>{props.content}</p>
      </div>
    );
  };

  export default Article;
```
