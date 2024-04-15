# JavaScriptにおける意図しないグローバル変数への代入

作成者: FukumaNaoya
最終更新日時: 2023年7月14日 10:58

## 意図しないグローバル変数への代入[](https://typescriptbook.jp/reference/statements/variable-scope#%E6%84%8F%E5%9B%B3%E3%81%97%E3%81%AA%E3%81%84%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E5%A4%89%E6%95%B0%E3%81%B8%E3%81%AE%E4%BB%A3%E5%85%A5)

JavaScriptではローカルスコープの変数に代入したつもりが、グローバル変数に代入してしまっていたといった事故が起こりえます。ローカル変数を宣言する場合は、`let`や`const`を用いますが、これを書き忘れた変数代入は、グローバル変数になってしまいます。

`function func() {  foo = "ローカル変数のつもり";}func();console.log(window.foo);"ローカル変数のつもり"コピー`

JavaScriptで変数を扱う際は、誤ってグローバル変数を作ってしまわないよう注意が必要です。一方、TypeScriptでは変数宣言されていない変数に代入しようとすると、コンパイラが指摘してくれます。

```
function func() {
  foo = "ローカル変数のつもり";
Cannot find name 'foo'.Cannot find name 'foo'.}

コピー
```

意図しないグローバル変数への代入は、JavaScriptの残念な仕様と言えますが、TypeScriptを使っているとこういったトラブルも発見しやすくなります。