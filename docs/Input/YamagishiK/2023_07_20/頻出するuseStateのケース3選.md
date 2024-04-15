# 【新・日本一わかりやすいReact入門【基礎編】頻出するuseStateのケース3選

作成者: YamagishiK
最終更新日時: 2023年7月19日 10:12

参考: https://developer.mozilla.org/ja/docs/Web/HTML/Element/input

## 引数を使って更新する

textを入力する画面を描画するコードを以下に示す.

```javascript
import React, {useState} from 'react'

const TextInput = () => {
    const [str, setStr] = useState('')

    const handleStr = (event) => {
        console.log(event.target.value);
        setStr(event.target.value) // 入力された値
    }
    return (
        <input
            onChange={(event) => handleStr(event)} // onChange で入力を管理
            type={'text'}                          // 入力形式をtextに設定
            value={str}                            // 入力コントロールの値
        />
    )
};

export default TextInput
```
- event
  - イベントオブジェクトとい種類でオブジェクト名は何でもいい
  - 型は\<input>"だと ChangeEvent\<HTMLInputElement>である
  - このeventオブジェクトには、イベントに関連する情報（例えば、テキスト入力フィールドの内容など）が含まれている
  - event.targetはイベントが発生したDOM要素（ここではinput要素）を表す
  - event.target.valueはそのDOM要素の値、つまりテキスト入力フィールドに入力された文字列を取得するために使用される
  - onChange={(event) => handleName(event)}という記述では、onChangeイベントが発生した際にReactが自動的にイベントオブジェクトを生成し、そのイベントオブジェクトがhandleName関数に引数として渡される。

- type
  - 画面に表示したいビジュアルをきめる. text以外にbutton, checkboxなどがる.

- value={name}
  - value={name}を指定すると、input要素は制御コンポーネント（ControlledComponent）として扱われる
  - Reactの状態とinput要素の値が常に同期され, これにより Reactの状態を正確に管理し、ユーザーの入力を制御することができる。


## prevStateを活用する
Reactコンポーネント内の値を書き換え再描画したいとき, DOMを直接書き換えたいところだが
Reactの仮想DOMの利点を削ぐことになるので, stateを用いて再描画する.
stateまたは, propsが変更されたときReactコンポーネントは再描画される.


## useStateの使い方
- useStateによるstateの宣言
  ```
    // state        : 現在の状態
    // setState     : 更新関数
    // initialState : 初期値
    const [state, setState] = useState(initialState)
  ```
- state の更新
  ```
    // newState: 新しい値
    setState(newState);
  ```
## propsとstateの違い
- propsは引数のようにコンポーネントに渡される値
- stateはコンポーネントの内部で宣言, 制御される値

## stateをpropsに渡す
```
  // 親
  const Article = (props) => {
    const [isPublished, setPublished] = useState(false);
    // 更新関数は, そのままpropsとして渡さずラップする.
    const publishArticle = () => {
      setIsPublished(true)
    }
    return (
      <div>
        <Title title={props.title} />
        <Content content={props.content} />
        <PublishButton isPubulished={isPublished} onClick={publishArticle} />
      </div>
    );
  };
```
```
  // 子
  const PublishButton = (props) => {
    return (
      <button onClick={() => props.onClick()}>
        公開状態: {props.isPublished.toStoring()}
      </button>
    );
  };
  export default PublishButton;
```

## propsへ関数を渡す際の注意点
- OKパターン

  ```
    <PublishButton isPublished={isPublished} onClick={publishArticle} />
    // コールバック関数を渡す場合.
    <PublishButton isPublished={isPublished} onClick={() => publishArticle} />
  ```
- NGパターン (無限レンダリング)
  ```
    // publishArticle()は,その関数を実行してしまいstateが変更され
    // コンポーネントが再描画される．そしてまた, publishArticle()が呼び出される.
    <PublishButton isPublished={isPublished} onClick={publishArticle()} />
  ```

  