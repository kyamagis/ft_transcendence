# useEffectのライフサイクル

作成者: tfujiwar
最終更新日時: 2023年7月12日 18:10

[リアクティブなエフェクトのライフサイクル – React](https://ja.react.dev/learn/lifecycle-of-reactive-effects)

### Effectのライフサイクルは、Componentの視点から分離した方が良い

> Componentの視点から見ると、Effectは、"レンダー直後" や"アンマウント直前"のように特定のタイミングで発生する"コールバック関数"や"ライフサイクル中のイベント"であると考えたくなります。
> 

> その代わりに、エフェクトの開始/終了という 1 サイクルのみにフォーカスしてください。コンポーネントがマウント中なのか、更新中なのか、はたまたアンマウント中なのかは問題ではありません。どのように同期を開始し、どのように同期を終了するのか、これを記述すれば良いのです。このことを意識するだけで、開始・終了が何度も繰り返されても、柔軟に対応できるエフェクトとなります。
> 

### コード例

```
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

### Componentのライフサイクル

> 画面に追加されたとき、コンポーネントはMountされる
新しい[[props]]や[[state]]を受け取ったとき、コンポーネントはUpdateされる
画面から削除されたとき、コンポーネントはUnmountされる
> 
- **上記コード例をComponentの視点で捉えると**
    1. エフェクトが `"general"` ルームに接続する
    2. エフェクトが `"general"` ルームを切断し、`"travel"` ルームに接続する
    3. エフェクトが `"travel"` ルームを切断し、`"music"` ルームに接続する
    4. エフェクトが `"music"` ルームを切断する

### Effectのライフサイクル

- [[useEffect]]は、Reactの外部と同期させる機能
- その同期を、どのように開始して終了するかを考えれば良い
- **上記コード例をEffectの視点で捉えると**
    1. エフェクトが、`"general"` に接続する（切断されるまで）
    2. エフェクトが、`"travel"` に接続する（切断されるまで）
    3. エフェクトが、`"music"` に接続する（切断されるまで）

### あえてComponentとEffectのライフサイクルを対応づけると...

- [[React Hookのライフサイクル]]