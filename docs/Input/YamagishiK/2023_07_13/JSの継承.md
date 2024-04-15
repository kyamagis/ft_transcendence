# JSの継承

作成者: YamagishiK
最終更新日時: 2023年7月13日 23:49

参考文献: [https://typescriptbook.jp/reference/values-types-variables/object/prototype-based-programming](https://typescriptbook.jp/reference/values-types-variables/object/prototype-based-programming)

> 継承と言ってもプロトタイプベースでは、クラスベースの`extends`のような特別な仕掛けがあるわけではなく、「既存のオブジェクトから新しいオブジェクトを作る」というプロトタイプベースの仕組みを継承に応用しているにすぎません。
> 

JSにおける継承の具体例を以下に示す.

```jsx
const player = {
    name: "三苫",
    nest: {
        things: "1 mm"
    }
};

const prevPlayer = Object.create(player);
console.log("--before--");
console.log(player);     // { name: '三苫', nest: { things: '1 mm' } }
console.log(prevPlayer); // {}

prevPlayer.name = "本田";
prevPlayer.nest.things = "5分!!";

console.log("--after1--");
console.log(player);     // { name: '三苫', nest: { things: '5分!!' } }
console.log(prevPlayer); // { name: '本田' }

prevPlayer.nest = {things: "前田さん"};

console.log("--after2--");
console.log(player);     // { name: '三苫', nest: { things: '5分!!' } 
console.log(prevPlayer); // { name: '本田', nest: { things: '前田さん' } }
```

継承は, シャローコピーになるので注意

以上の結果になるメカニズム を以下に記す．(出典: ChatGPT)

```markdown
この振る舞いはJavaScriptの「プロトタイプチェーン」および「参照型」と「値型」の2つの重要な概念に起因します。

1. **プロトタイプチェーン:** `Object.create()`関数を使うと、新しいオブジェクトのプロトタイプを指定したオブジェクトに設定できます。この場合、新しいオブジェクト（`prevPlayer`）は元のオブジェクト（`player`）のプロパティを「継承」します。継承とは、新しいオブジェクトが元のオブジェクトのプロパティを参照できるという意味です。しかし、新しいオブジェクトに同名のプロパティが設定されると、その新しいオブジェクトはそのプロパティを自分自身が所有することになり、元のオブジェクトの同名のプロパティを参照しなくなります。

2. **参照型と値型:** JavaScriptでは、オブジェクトや配列のような複合型のデータは参照型として扱われます。つまり、その値自体ではなく、その値への参照が渡される、または代入されるのです。これに対して、プリミティブ型（文字列、数値、ブーリアンなど）は値型として扱われ、その値自体が直接渡される、または代入されます。

これらの概念を組み合わせると、あなたのコードの挙動を説明できます：

- まず`prevPlayer`は`player`をプロトタイプとして新たに作られるので、`name`と`nest`プロパティを継承します。

- `prevPlayer.name = "本田";`は`prevPlayer`に新しい`name`プロパティを設定しています。この`name`プロパティはプリミティブ型なので値型として扱われ、`player`の`name`プロパティには影響を与えません。

- しかし、`prevPlayer.nest.things = "前田さん"`は`prevPlayer`の`nest`プロパティ（オブジェクト）を直接変更しています。`nest`プロパティは参照型なので、これは`player`の`nest`プロパティも同時に変更してしまいます。これは`prevPlayer`が自分自身の`nest`プロパティを持っていないため、プロトタイプチェーンを通じて`player`の`nest`プロパティを参照しているからです。

- `console.log()`で`prevPlayer`を出力したとき、その直接のプロパティだけが表示されます。`prevPlayer`がプロトタイプチェーンを通じて継承したプロパティは表示されません。ただし、そのプロパティにアクセスすると、JavaScriptはプロトタイプチェーンをたどってその値を取得します。

以上から、`Object.create()`を使う際やオブジェクトのプロパティを変更する際には、これらの概念を理解しておくことが重要です。
```

この挙動は **`Object.create()`** の働きによるものです。**`Object.create(proto)`** 関数は新たなオブジェクトを作りますが、そのオブジェクトの「プロトタイプ」が引数 **`proto`** のオブジェクトになります。

プロトタイプとは、JavaScriptにおいてオブジェクトが持つ特殊な内部プロパティで、他のオブジェクトへのリンクを表します。このリンクされたオブジェクトのプロパティやメソッドは、そのオブジェクト自身がそれらを持たない場合に参照されます。これをプロトタイプ継承と呼びます。

したがって **`prevPlayer`** オブジェクトは自身のプロパティを持っていないため、**`console.log(prevPlayer)`** では **`{}`** が出力されます。しかし **`prevPlayer`** のプロトタイプとして **`player`** オブジェクトが存在しているため、**`console.log(prevPlayer.name)`** とすると **`"三苫"`** が出力されます。同様に、**`console.log(prevPlayer.nest.things)`** とすると **`"1 mm"`** が出力されます。これらは **`player`** オブジェクトからプロトタイプ継承により参照されています。

なお、**`Object.create()`** は第二引数としてプロパティディスクリプタのオブジェクトを受け取ることも可能で、これを使用すると新しく作成するオブジェクトに直接プロパティを設定することもできます。