# JavaScriptにおける短絡評価

JavaScriptの論理演算子を用いた短絡評価を詳しく見ていきましょう。短絡評価は、特定の条件下でのみ要素を表示したり、デフォルト値を提供したりする際に使用します。

## 0. 短絡評価とは？その対象は？

JavaScriptの論理演算子の中で、短絡評価を行う演算子は論理AND演算子(&&)、論理OR演算子(||)、Null合体演算子(??)の3つです。これらの演算子は左のオペランドの評価結果に基づいて、右のオペランドを評価するかどうかを決定します。つまり、結果が既に確定した時点でそれ以上の評価を省略（短絡）するという特性を持っています。

## 1. 論理AND演算子(`&&`)による短絡評価

論理AND演算子`&&`は、最初の要素が`false`やfalsyな値（`false`、`null`、`undefined`、`""`、`0`、`NaN`）の場合にはその値をそのまま返し、それ以外の場合には2番目の値を返します。

```javascript
const isLoggedIn = true;
const message = isLoggedIn && <h1>Welcome back!</h1>;
```

この例では、`isLoggedIn`がtruthy（真と評価される値）の場合にのみ、`<h1>Welcome back!</h1>`が表示されます。

## 2. 論理OR演算子(`||`)による短絡評価

論理OR演算子`||`は、最初のオペランドがtruthyな値の場合にその値をそのまま返し、それ以外の場合には2番目の値を返します。

```javascript
const isLoggedIn = false;
const message = isLoggedIn || <h1>Please sign up.</h1>;
```

この例では、`isLoggedIn`がfalsy（偽と評価される値）な値（`undefined`、`null`、`""`、`0`、`NaN`）の場合にのみ、`<h1>Please sign up.</h1>`が表示されます。

## 3. Null合体演算子(`??`)による短絡評価

Null合体演算子（nullish coalescing operator）`??`は、最初のオペランドが`null`または`undefined`の場合にのみ2番目の値を返します。そのため、最初のオペランドが`false`、`0`、`NaN`、空文字列であっても、その値が保持されます。

```javascript
const input = { name: null };
const message = input.name ?? <p>No input provided.</p>;
```

この例では、`input.name`が`null`または`undefined`の場合にのみ、`<p>No input provided.</p>`が表示されます。

## 4. ２項論理演算子の振る舞い
JavaScriptとC++における論理演算子の挙動は異なります。
これらの言語は論理演算子の評価結果として返す値が違います。以下にその違いをまとめます。

### JavaScript

JavaScriptの論理演算子は**短絡評価**を行い、評価が確定した**オペランドの値自体**を返します。

- 論理AND演算子(`&&`): 一番最初にfalsyな値に遭遇した場合、その値を返します。全てのオペランドがtruthyなら、最後の値を返します。
- 論理OR演算子(`||`): 一番最初にtruthyな値に遭遇した場合、その値を返します。全てのオペランドがfalsyなら、最後の値を返します。

これはJavaScriptの動的型付けの特性と関連しています。JavaScriptでは、異なる型の値も論理演算子で評価でき、各値はcontextによって真偽値として評価されます。

```javascript
const value1 = "Hello" && 123;  // value1 is 123
const value2 = "" || "World";   // value2 is "World"
```

### C++

一方、C++の論理演算子は、評価結果として**真偽値**（`true`または`false`）を返します。

- 論理AND演算子(`&&`): 全てのオペランドが真（非ゼロ）であれば`true`を、そうでなければ`false`を返します。
- 論理OR演算子(`||`): 少なくとも1つのオペランドが真（非ゼロ）であれば`true`を、全てのオペランドが偽（ゼロ）であれば`false`を返します。

これはC++の静的型付けの特性と関連しています。C++では、真偽値を扱うための専用の型（`bool`）があり、論理演算の結果はこの`bool`型の値として表されます。

```cpp
bool value1 = ("Hello" && 123);  // value1 is true
bool value2 = ("" || "World");   // value2 is true
```

## 5. 単項の論理演算子(!)
単項の論理演算子であるNOT演算子(!)は、短絡評価とは異なる挙動を示します。NOT演算子はオペランドをBoolean値に変換し、その反転を返します。

これは、NOT演算子がオペランドの真偽値を反転する演算であるため、その結果は必ずBoolean値（trueまたはfalse）になります。つまり、NOT演算子の評価結果として返るのはオペランドの値そのものではなく、オペランドの論理否定の結果となるBoolean値です。
