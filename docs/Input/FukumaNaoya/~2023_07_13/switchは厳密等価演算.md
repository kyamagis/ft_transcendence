# switchは厳密等価演算

作成者: FukumaNaoya
最終更新日時: 2023年7月14日 11:11

## switchは厳密等価演算[](https://typescriptbook.jp/reference/statements/switch#switch%E3%81%AF%E5%8E%B3%E5%AF%86%E7%AD%89%E4%BE%A1%E6%BC%94%E7%AE%97)

switch構文でその値であると判断されるのは等価演算(`==`)ではなく厳密等価演算(`===`)です。たとえば`null`と`undefined`は等価演算では等しいとされますが厳密等価演算では等しくありません。

`console.log(null == undefined);trueconsole.log(null === undefined);falseコピー`

このふたつを使ったswitch構文を作るとそのことがよくわかります。

`function test(n: unknown): void {  switch (n) {    case null:      console.log("THIS IS null");      return;    case undefined:      console.log("THIS IS undefined");      return;    default:      console.log("THIS IS THE OTHER");  }} test(null);'THIS IS null'test(undefined);'THIS IS undefined'コピー`