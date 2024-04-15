# catchの分岐

作成者: FukumaNaoya
最終更新日時: 2023年7月14日 11:16

**そもそもJavaScriptに型の概念が無いので、型ごとにcatchするのは不可能**

### catchの分岐[](https://typescriptbook.jp/reference/statements/exception#catch%E3%81%AE%E5%88%86%E5%B2%90)

JavaやPHPでは捉えるエラーの型に対応するcatchを複数書けますが、JavaScriptとTypeScriptではcatchは1つしか書けません。JavaScriptでエラーの型によってエラーハンドリングを分岐したい場合は、catchブロックの中で分岐を書く方法で対応します。

```tsx
try {
  // ...
} catch (e) {
  if (e instanceof TypeError) {
    // TypeErrorに対する処理
  } else if (e instanceof RangeError) {
    // RangeErrorに対する処理
  } else if (e instanceof EvalError) {
    // EvalErrorに対する処理
  } else {
    // その他のエラー
  }
}

```