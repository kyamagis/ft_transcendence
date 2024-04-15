# 【新・日本一わかりやすいReact入門【基礎編】JSXの記法

作成者: YamagishiK
最終更新日時: 2023年7月18日 10:12

## JSXとは
- JSの拡張言語 facebookが開発
- HTMLライクな記述 + JSの構文が使える
- JSXをコンパイルしてReact要素を生成

以下に同じ処理をJSXを未使用と使用の例を示す.
```
    // JSX未使用
    React.createElement (
        `buton`,
        {className: 'btn-blue'},
        'Click me!'
    )

    // JSX使用
    <button className={'btn-blue'}>
        Click me!
    </button>
```

## JSXの基本文法1

1.Reactライブラリをimport

2.return文の中がJSXの構文
  - 基本的にはHTMLと同じ
  - HTMLのclassは, JSXではclassNameに変更

3.拡張子は".JSX", "JS" 

```
    import React from 'react';

    const BlueButton = () => {
        return (
            <button className={'btn-blue'}>
                Click me!
            </button>
        )
    }

    export default BlueButton;
```

## JSXの基本文法2

1.キャメルケース記法(JSでは'-'が使えない)
    
2.JSで宣言した変数は{}で囲む事で扱える

3.HTMLと違い一つのタグで完結するとき, 閉じタグ"/>"が必要

```
    import React from 'react';

    const Thumbanil = () => {
        const caption = "写真"
        const imagePath = "../image/photo.png" // キャメルケース

        return (
            <div>
                <p>{caption}</p> // JSで宣言した変数の使用
                <image src={imagePath} alt={"トラハック"} /> // 閉じたぶ
            </div>
        )
    }

    export default Thumbail;

```

## JSXの特殊構文

1.JSXは必ず階層構造を取らなければない
    最上位コンポーネントを並列に出来ない
```
    // OK
    return (
        <p>どすこい太郎</p>
    )

    // ERROR 並列関係
    return (
        <p>どすこい太郎</p> // 親
        <p>どすこい次郎</p> // 子
    )

    // OK 階層構造
    return (
        <div>
            <p>どすこい太郎</p>
            <p>どすこい次郎</p>
        </div>
    )
```

2.React.Fragmentで囲む
    <div>はHTMLでは, 何もしないタブなので, 使いたくない場合がある.
    そんなときに, <React.Fragment>を使う.
    <React.Fragment>は, HTMLに変換されると空のタブになる.また,<React.Fragment>は<>で省略できる.
    
```
    return (
        <React.Fragment>
            <p>どすこい太郎</p>
            <p>どすこい次郎</p>
        </React.Fragment>
    )

    return (
        <>
            <p>どすこい太郎</p>
            <p>どすこい次郎</p>
        </>
    )
```