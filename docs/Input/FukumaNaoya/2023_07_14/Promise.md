## 基本
```javascript
new Promise((resolve, reject) => {
  // ここで非同期の処理を行う
  // 非同期処理が成功した場合はresolveを、失敗した場合はrejectを呼び出す
})
.then(value => {
  // Promiseがfulfilledになったとき（resolveが呼ばれたとき）に実行されるコールバック
})
.catch(error => {
  // Promiseがrejectedになったとき（rejectが呼ばれたとき）に実行されるコールバック
});
```

このように、`resolve`と`reject`はPromiseの内部で使用するための関数で、ユーザーが直接定義するものではありません。

## resolve, reject

`resolve`と`reject`は、それぞれ以下のような引数を取ります：

- `resolve(value)`: `resolve`関数は1つの引数を取ります。この引数はPromiseが解決されたときに、`then`メソッドのコールバック関数に渡されます。引数`value`は任意の値を指定することができます。具体的な値の型や形状は、解決するPromiseの結果によります。

- `reject(reason)`: `reject`関数も1つの引数を取ります。この引数はPromiseが拒否されたときに、`catch`メソッドのコールバック関数に渡されます。引数`reason`は通常、エラーオブジェクトまたはエラーメッセージを指定します。

以下に具体的なコード例を示します：

```javascript
new Promise((resolve, reject) => {
  const data = getDataFromSomewhere(); // 何らかのデータ取得処理
  if (data) {
    resolve(data); // データが取得できたらそれを引数にしてresolveを呼び出す
  } else {
    reject(new Error('Failed to get data')); // データ取得に失敗したらエラーメッセージを引数にしてrejectを呼び出す
  }
})
.then(value => {
  console.log(value); // resolveが呼ばれたら、その引数がここに渡される
})
.catch(error => {
  console.error(error); // rejectが呼ばれたら、その引数がここに渡される
});
```

## 非同期処理の組み合わせと、ハンドリング方法

非同期処理を組み合わせた場合には、`Promise.all`、`Promise.race`、`Promise.any`、`Promise.allSettled`の各メソッドを利用することが一般的です。それぞれのメソッドの挙動と、それを使用したコード例を以下に示します。

1. `Promise.all(promises)`: 引数のPromiseが全て解決（fulfilled）するまで待ち、全てのPromiseが解決したときにその結果の配列を返します。一つでも拒否（rejected）があると、その時点で`Promise.all`全体が拒否となります。

```javascript
let promise1 = Promise.resolve(3);
let promise2 = 42;
let promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3])
  .then(values => {
    console.log(values); // [3, 42, "foo"]
  })
  .catch(error => {
    console.error(error);
  });
```
※値自体（プロミス以外の値）が Promise.all() に与えられた場合、それらは自動的に解決されたプロミスとして扱われ、拒否状態にはなりません。したがって、単に数値や文字列などを Promise.all() に渡すと、それらは成功として扱われます。

2. `Promise.race(promises)`: 引数のPromiseのうち、最初に状態が変わった（解決または拒否された）Promiseの結果または理由を返します。

```javascript
let promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

let promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2])
  .then(value => {
    console.log(value); // "two"
  })
  .catch(error => {
    console.error(error);
  });
```

3. `Promise.any(promises)`: 引数のPromiseのうち、最初に解決（fulfilled）したPromiseの結果を返します。全てのPromiseが拒否（rejected）した場合には、`AggregateError`という新しいエラーオブジェクトを返します。

```javascript
let promise1 = Promise.reject(0);
let promise2 = new Promise((resolve) => setTimeout(resolve, 100, 'quick'));
let promise3 = new Promise((resolve) => setTimeout(resolve, 500, 'slow'));
let promises = [promise1, promise2, promise3];

Promise.any(promises).then((value) => console.log(value)); // "quick"
```

4. `Promise.allSettled(promises)`: 全てのPromiseが解決または拒否したときに、その結果または理由を配列に格納して返します。

```javascript
let promise1 = Promise.resolve(3);
let promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));

Promise.allSettled([promise1, promise2])
  .then(results => {
    console.log(results);
    // [
    //   {status: "fulfilled", value: 3},
    //   {status: "rejected", reason: "foo"}
    // ]
  });
```

これらのメソッドを用いて非同期処理を制御することで、非同期処理の結果をより細かく扱うことが可能になります。


## 実用例
以下に、非同期なAPIリクエストを模したシンプルな実践的な例を示します。この例では `fetch` 関数を使用して外部APIからデータを取得します。`fetch` は Promise を返すため、非同期操作と一緒に使用するのに適しています。

注意：このコードは実際のブラウザやNode.jsの環境で動作しますが、その環境が `fetch` 関数をサポートしている必要があります。

```javascript
// 外部APIからの非同期なデータ取得を模倣
function fetchData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error(`Error in fetchData: ${error}`));
}

// それぞれのURLからデータを取得
let promise1 = fetchData('https://api.example.com/data1');
let promise2 = fetchData('https://api.example.com/data2');
let promise3 = fetchData('https://api.example.com/data3');

// 全てのデータが取得できたら処理を進める
Promise.all([promise1, promise2, promise3])
  .then(values => {
    console.log(values); // データが全て取得できたらここに表示
  })
  .catch(error => {
    console.error(`Error in Promise.all: ${error}`);  // 何か1つでもエラーがあった場合ここでキャッチ
  });
```

このコードでは、3つの異なるURLからデータを非同期に取得し、全てのリクエストが完了したときにデータを表示します。これらの非同期操作が並行して行われ、全てが完了するのを待ってから次のステップ（ここでは `console.log`）に進むのが `Promise.all` の働きです。
