# TypeScriptの多相性時の型チェックは基底クラスが同一であることを必要としない

作成者: FukumaNaoya
最終更新日時: 2023年7月13日 23:23

### 構造的部分型の場合[](https://typescriptbook.jp/reference/values-types-variables/structural-subtyping#%E6%A7%8B%E9%80%A0%E7%9A%84%E9%83%A8%E5%88%86%E5%9E%8B%E3%81%AE%E5%A0%B4%E5%90%88)

以下はTypeScriptでの紹介です。

```tsx
class File extends InputSource {
  public readonly destination: string;

  public constructor(destination: string) {
    super();
    this.destination = destination;
  }

  public fetch(): Data {
    const reader: Reader = FileSystem.readFrom(this.destination);
    // ...

    return data;
  }
}

class Request extends InputSource {
  public readonly destination: string;

  public constructor(destination: string) {
    super();
    this.destination = destination;
  }

  public fetch(): Data {
    const response: Response = HTTPRequest.get(this.destination);
    // ...

    return data;
  }
}

コピー
```

こちらも同様にリスコフの置換原則が成立するのでスーパークラスの変数でサブクラスを受けることができます。

```tsx
const source1: InputSource = new File("/data/~~~.txt");
const source2: InputSource = new Request("https://~~~~");

const data1: Data = source1.fetch();
const data2: Data = source2.fetch();

コピー
```

次に、先ほどと同じように結果を受ける変数の型をお互いのサブクラスに変更します。

```tsx
const source3: Request = new File("/data/~~~.txt");
const source4: File = new Request("https://~~~~");

const data3: Data = source3.fetch();
const data4: Data = source4.fetch();

```

するとこれはエラーが出ることなく実行できます。これが構造的部分型の大きな特徴で、File, Requestのシグネチャが同じために可換になります。

```tsx
interface InputSource {
  destination: string;

  fetch(): Data;
}

```

File, Requestは共にこのInputSourceのようなインターフェースであると解釈されるためこのようなことが起こります。

## TypeScriptでさらに注意すること[](https://typescriptbook.jp/reference/values-types-variables/structural-subtyping#typescript%E3%81%A7%E3%81%95%E3%82%89%E3%81%AB%E6%B3%A8%E6%84%8F%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8)

今回の例は共に同じスーパークラスを持つサブクラスの話でしたが、実はこれは**スーパークラスが異なっていても起こりえます**。スーパークラスのInputSourceを上記TypeScriptの例から抹消してしまっても同様にこのコードは動作します。

```tsx
class File {
  public destination: string;

  public constructor(destination: string) {
    this.destination = destination;
  }

  public fetch(): Data {
    const reader: Reader = FileSystem.readFrom(this.destination);
    // ...

    return data;
  }
}

class Request {
  public destination: string;

  public constructor(destination: string) {
    this.destination = destination;
  }

  public fetch(): Data {
    const response: Response = HTTPRequest.get(this.destination);
    // ...

    return data;
  }
}

const source3: Request = new File("/data/~~~.txt");
const source4: File = new Request("https://~~~~");

const data3: Data = source3.fetch();
const data4: Data = source4.fetch();

```

消えたのはInputSourceと、その継承を示す`extends InputSource`と`super();`だけです。このコードは正常なTypeScriptのコードとして動作します。