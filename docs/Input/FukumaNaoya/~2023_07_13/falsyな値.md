# falsyな値

作成者: FukumaNaoya
最終更新日時: 2023年7月14日 10:55

## falsyな値[](https://typescriptbook.jp/reference/values-types-variables/truthy-falsy-values#falsy%E3%81%AA%E5%80%A4)

falsyな値というのは限られており、それ以外のすべての値がtruthyとなるのでこれだけ覚えてしまえばいいということでもあります。

| 値 | 型 | 意味 |
| --- | --- | --- |
| false | boolean | 疑値 |
| 0 | number | 数値の0 |
| -0 | number | 数値の-0 |
| NaN | number | Not a Number |
| 0n | bigint | 整数値の0 |
| "" | string | 空文字列 |
| null | null | null |
| undefined | undefined | undefined |

これらの値が`if`の条件式に入った場合、その`if`ブロックは実行されません。