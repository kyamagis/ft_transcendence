# StrictModeで純粋でない計算を検出する

作成者: tfujiwar
最終更新日時: 2023年7月12日 18:09

コンポーネントは呼び出し回数によらず、常に一定の出力が期待される

- `<React.StrictMode>`をrootノードにつけることで、コンポーネントを2回呼び出す

### 例

- 下記をstrictmodeで実行すると、2,4,6となる

```
let guest = 0;
function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```