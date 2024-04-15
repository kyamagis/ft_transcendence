# 型ガードとnull

作成者: FukumaNaoya
最終更新日時: 2023年7月14日 11:41

`date != null`の型ガードを追加することで型エラーを解消できます。

（これはnullとundefiedを除外しています）

```tsx
function getMonth(date: string | Date | null) {
  if (typeof date === "object" && date != null) {
    console.log(date.getMonth() + 1);
  }
}

```

JavaScriptの `==` と `!=` 演算子は、比較を行う前にオペランドを強制的に変換します。これはしばしば暗黙的な型変換と呼ばれ、時に混乱を招くことがあります。しかし、`null` や `undefined` との比較に関しては、特別な規則があります。

JavaScriptでは、`null == undefined` は `true` に評価されます。つまり、`!=` 演算子は `null` または `undefined` のいずれかと比較するときにのみ特別な動作をします。それ以外の値、例えば空文字列や `"0"` などと比較したときには、`false` に評価されます。これは `null` または `undefined` と比較した場合とは対照的です。

したがって、以下のコードは `false` をログに出力します：

```
console.log('' != null);  // false
console.log('0' != null); // false

```

逆に、JavaScriptの `===` と `!==` 演算子は厳密な等価性をチェックします。これは、比較を行う前に型変換を行わないということを意味します。したがって、これらの演算子を使用すると、型が異なる場合は常に `false` を返します。

```
console.log('' !== null);  // true
console.log('0' !== null); // true

```

したがって、`null` のみを確認したい場合や、型変換による混乱を避けたい場合には、 `!==` の使用が推奨されます。