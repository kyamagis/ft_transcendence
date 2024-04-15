# ユニオン型変数のif分岐

作成者: YamagishiK
最終更新日時: 2023年7月14日 11:05

参考: STS

ユニオン型変数のif分岐の例を以下に示す．

```tsx
function showMonth(date: string | Date | number) {
    if (typeof date === "string") { // プリミティブ型を抽出したい場合
        console.log(date.padStart(2, "0")); // stringの関数
        return ;
    }
    else if (date instanceof Date) { // オブジェクト型を抽出したい場合
        console.log(date.getMonth() + 1);
        return ;
    }
    console.log(date.toFixed());
}
```

`typeof`や`instanceof`などを条件式に含んだif文を使い方を絞り込むことを型ガードと言う