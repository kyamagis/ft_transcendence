# never型と例外の活用による網羅性チェック

作成者: FukumaNaoya
最終更新日時: 2023年7月14日 11:24

# 例外による網羅性チェック[](https://typescriptbook.jp/reference/statements/never#%E4%BE%8B%E5%A4%96%E3%81%AB%E3%82%88%E3%82%8B%E7%B6%B2%E7%BE%85%E6%80%A7%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF)

一歩進んで網羅性チェック用の例外クラスを定義するのがお勧めです。このクラスは、コンストラクタ引数に`never`型を取る設計にします。

### 例外クラスの実装例）

```tsx

class ExhaustiveError extends Error {
  constructor(value: never, message = `Unsupported type: ${value}`) {
    super(message);
  }
}

```

### 活用例）

この例外を`default`分岐で投げるようにします。コンストラクタに網羅性をチェックしたい引数を渡します。こうしておくと、網羅性が満たされていない場合、TypeScriptが代入エラーを警告します。

```tsx
function printLang(ext: Extension): void {
  switch (ext) {
    case "js":
      console.log("JavaScript");
      break;
    case "ts":
      console.log("TypeScript");
      break;
    default:
      throw new ExhaustiveError(ext);
Argument of type 'string' is not assignable to parameter of type 'never'.Argument of type 'string' is not assignable to parameter of type 'never'.  }
}

コピー
```

例外にしておく利点は2つあります。

1. `noUnusedLocals`に対応可能
2. 実行時を意識したコードになる

## `noUnusedLocals`に対応可能[](https://typescriptbook.jp/reference/statements/never#nounusedlocals%E3%81%AB%E5%AF%BE%E5%BF%9C%E5%8F%AF%E8%83%BD)

コンパイラオプション`[noUnusedLocals](https://typescriptbook.jp/reference/tsconfig/nounusedlocals)`は使われていない変数について警告を出すかを設定します。これが`true`のとき、変数に代入するだけの網羅性チェックはコンパイルエラーになってしまいます。

```tsx
全網羅するも未使用変数で警告される
function func(value: "yes" | "no"): void {
  switch (value) {
    case "yes":
      console.log("YES");
      break;
    case "no":
      console.log("NO");
      break;
    default:
      const exhaustivenessCheck: never = value;
'exhaustivenessCheck' is declared but its value is never read.'exhaustivenessCheck' is declared but its value is never read.      break;
  }
}

コピー
```

網羅性チェックを例外にしておくと、未使用変数についてのコンパイルエラーが発生しなくなります。

## 実行時を意識したコードになる[](https://typescriptbook.jp/reference/statements/never#%E5%AE%9F%E8%A1%8C%E6%99%82%E3%82%92%E6%84%8F%E8%AD%98%E3%81%97%E3%81%9F%E3%82%B3%E3%83%BC%E3%83%89%E3%81%AB%E3%81%AA%E3%82%8B)

例外のほうが、コンパイル後のJavaScriptを意識した実装になります。変数代入による網羅性チェックのコードをコンパイルすると、次のJavaScriptが生成されます。

```tsx
コンパイル後のJavaScript(変数代入による網羅性チェック)
function func(value) {
    switch (value) {
        case "yes":
            console.log("YES");
            break;
        case "no":
            console.log("NO");
            break;
        default:
            const exhaustivenessCheck = value;
            break;
    }
}

コピー
```

コンパイルもとのTypeScriptを知らない者がこのコードを見ると、`exhaustivenessCheck`への代入は意図が不明です。また、網羅性のチェックは実行時に行われません。

例外による網羅性チェックは、コンパイル後コードだけ見ても意図が明瞭です。また、実行時にもチェックが行われます。このほうがよい実装になります。

```tsx
コンパイル後のJavaScript(例外による網羅性チェック)
class ExhaustiveError extends Error {
    constructor(value, message = `Unsupported type: ${value}`) {
        super(message);
    }
}
function func(value) {
    switch (value) {
        case "yes":
            console.log("YES");
            break;
        case "no":
            console.log("NO");
            break;
        default:
            throw new ExhaustiveError(value);
    }
}

コピー
```