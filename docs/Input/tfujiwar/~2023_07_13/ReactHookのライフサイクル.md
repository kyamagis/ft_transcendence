# ReactHookのライフサイクル

作成者: tfujiwar
最終更新日時: 2023年7月12日 18:05

---

[Hooks時代のReactライフサイクル完全理解への道](https://zenn.dev/yodaka/articles/7c3dca006eba7d)

### 概要

- 関数コンポーネントのライフサイクルを、クラスコンポーネントと対応させて理解する
- **結論、関数コンポーネントはクラスコンポーネントのrenderそのものである**

### ライフサイクルの基本

- クラスコンポーネントも、関数コンポーネントも、ライフサイクルの流れは以下の通り
    1. **Mount**
    2. **Update**
    3. **Render**

### クラスコンポーネントのライフサイクル

- クラスコンポーネントの場合、**インスタンスの生き死にとDOMへの反映が対応している**
- [React lifecycle methods diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

### Mount

1. `constructor`
2. `render`
3. `componentDidMount`

### Update

1. `render`
2. `componentDidUpdate`

### Unmount

1. `componentWillUnmount`

### 関数コンポーネントのライフサイクル

- 以下のコードのように、`initialize`, `effect`, `removeEffect`, `render`を定義する

```
function Example() {
  // initialize

  useEffect(() => {
    // effect

    return () => {
      // removeEffect
    }
  });

  // render
  return <></>;
}

```

### Mount

1. `initialize`
2. `render`
3. `effect`

### Update

1. `initialize`
2. `render`
3. `removeEffect`
4. `effect`

### Unmount

1. `removeEffect`

### 関数コンポーネントとクラスコンポーネントのライフサイクルの違い

- `constructor`はマウント時にしか呼ばれないが、`initialize`は更新時にも呼ばれる
- `componentWillUnmount`はアンマウント時にしか呼ばれないが、`removeEffect`は更新時に`effect`が実行されるならその前に呼ばれる