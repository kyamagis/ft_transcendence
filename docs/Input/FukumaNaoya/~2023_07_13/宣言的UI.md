# 宣言的UI

作成者: FukumaNaoya
最終更新日時: 2023年7月11日 16:17

### 特徴その2: 宣言的UI[](https://typescriptbook.jp/tutorials/react-like-button-tutorial#%E7%89%B9%E5%BE%B4%E3%81%9D%E3%81%AE2-%E5%AE%A3%E8%A8%80%E7%9A%84ui)

Reactの2つ目の特徴はUIを宣言的に書ける点です。Reactを使わずにUIを実装すると、命令的なコードになります。命令的なコードでは、何かを表示したい場合でもどのように表示するかのhowの部分を細かく書く必要があります。

次の簡単なHTMLのリストを表示するために、命令的なコードと宣言的なコードで書き方がどう違うかを見ていきましょう。

```
<ul>
  <li>リンゴ</li>
  <li>オレンジ</li>
  <li>ぶどう</li>
</ul>

コピー
```

まず、命令的なコードでは、次のようになります。

```
const list = document.createElement("ul");
const apple = document.createElement("li");
apple.innerText = "リンゴ";
list.append(apple);
const orange = document.createElement("li");
orange.innerText = "オレンジ";
list.append(orange);
const grape = document.createElement("li");
grape.innerText = "ぶどう";
list.append(grape);

コピー
```

この処理を日本語に書き下すと、次のようになります。

- `ul`要素を作り、変数`list`に代入する
- `li`要素を作り、変数`apple`に代入する
- `apple`のテキストは「リンゴ」にする
- `list`に`apple`を追加する
- `li`要素を作り、変数`orange`に代入する
- `orange`のテキストは「オレンジ」にする
- `list`に`orange`を追加する
- ...

3つの果物のリストのような簡単なUIでも、どのように作ったらいいかを細かく記述しなければなりません。これを見るだけでも、UIを命令的に書くのは大変で、保守していくことも考えると望ましい書き方には思えないのではないでしょうか。

今度は宣言的な書き方を見てみましょう。次はReactでの書き方です。

```
function Fruits() {
  return (
    <ul>
      <li>リンゴ</li>
      <li>オレンジ</li>
      <li>ぶどう</li>
    </ul>
  );
}

コピー
```

見てのとおり、どのように表示するかの部分はなく、「このような表示になってほしい」という目標だけが書かれています。

宣言的UIでは、実装の細部やアルゴリズムを気にしなくてよいです。「どんなUIにしたいか」の一点に集中してコードを書けるようになります。