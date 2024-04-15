# useEffect

作成者: tfujiwar
最終更新日時: 2023年7月12日 18:04

[エフェクトを使って同期を行う – React](https://ja.react.dev/learn/synchronizing-with-effects)

### 概要

- `useEffect`とは、**React外のシステムとコンポーネントを同期させるための機能**
- 特定のイベントによってではなく、**レンダー自体によって引き起こされる副作用を指定する**
    - [[イベントハンドラ]]: 特定のイベント（クリックetc）によって引き起こされる副作用
    - `useEffect`: **レンダリング後**に引き起こされる副作用

### useEffectのが実行されるタイミング

- **依存配列で指定された、コンポーネント内のリアクティブな変数に関して、レンダリング後にuseEffectが実行される**
    - `useEffect`が新しい値を「検知」するわけではなく、依存配列の値が変化した場合に指定された副作用を実行する
    - この「検知」は[[React]]の再レンダリングのメカニズムによるもの
- [[コンポーネント本体で宣言された変数は、すべてリアクティブ]]

### useEffectの使用方法

```
 useEffect(() => {
   コールバック（stateが変化するタイミングで実行される関数）
   return () => { クリーンアップ（unmount時に実行される関数) };
 }, [実行タイミングを指定するstate]);

```

### クリーンアップ関数の必要性

- **再マウントされても正しく動作するような処理として、クリーンアップ関数を追加する必要がある**
- 下記で`connection.disconnect()`をコメントアウトすると、レンダリングするたびに接続が増えてしまう
    - メモリを食い続けることになる

```
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);

```

### useEffectは不要かもしれない

- [[useEffectは不要かもしれない]]

### useEffectのライフサイクル

- [[useEffectのライフサイクル]]