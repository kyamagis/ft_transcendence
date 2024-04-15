# JSのシャローコピーとディープコピー

作成者: YamagishiK
最終更新日時: 2023年7月13日 10:54

出典: [シャローコピー・ディープコピーとは](https://zenn.dev/luvmini511/articles/722cb85067d4e9) ，[https://lodash.com/](https://lodash.com/)，

下にシャローコピーの例を示す.

```jsx
const object = {
  name: "apple",
  like: {
    food: "かぼちゃ"
  }
};
const newObject = { ...object };

newObject.name= "banana";
newObject.like.food = "魚";

console.log(object); // { name: "apple", like: { food: "魚" } }
console.log(newObject); // { name: "banana", like: { food: "魚" } }
```

object直下のメソッド変数であるnameは，互いに独立しているが，メソッド変数であるlikeのメソッド変数は，アドレスを共有している．

下にディープコピーの例を示す.

```jsx
const object = {
	name: "apple",
	like: {
	  food: "かぼちゃ"
	}
  };
  const newObject = JSON.parse(JSON.stringify(object));

  console.log("\n--JSON class result--");
  console.log(JSON.stringify(object)); //             {"name":"apple","like":{"food":"かぼちゃ"}}
  console.log(JSON.parse(JSON.stringify(object))); // { name: 'apple', like: { food: 'かぼちゃ' } }
  
  newObject.name = "banana";
  newObject.like.food = "魚";
  
  console.log("\n--result--");
  console.log(object); //    { name: "apple", like: { food: "かぼちゃ" } }
  console.log(newObject); // { name: "banana", like: { food: "魚" } }
```

> 
> 
> 
> 原本のオブジェクトを[JSON.stringify()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)でまず文字列化して、それを[JSON.parse()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)でまたオブジェクト化するげんりです。
> 
> 割と簡単ですが、この方法はプロパティにDateオブジェクトや関数、undefinedなどが入ってる場合は上手く動かないです。
> 
> これの他にはLodash(Javascriptのユーティリティライブラリ)にあるcloneDeep()メソッドを使う方法などがあります。
> 

下にLodashライブラリを用いたディープコピーとシャローコピーの例を示す.

```jsx
// 事前に以下の２つのコマンドを実行しておくこと ([https://lodash.com/](https://lodash.com/))
// npm i -g npm
// npm i --save lodash

import { clone } from 'lodash';
import { cloneDeep } from 'lodash';

const object = {
	name: "apple",
	like: {
	  food: "かぼちゃ"
	}
  };
  
  // ディープコピー
  const deepObject = cloneDeep(object);
  deepObject.name = "banana";
  deepObject.like.food = "魚";
  
  // シャローコピー
  const shallowObject = clone(object);
  shallowObject.name = "banana";
  shallowObject.like.food = "魚";
  
  console.log("\n--result--");
  console.log(object);        // { name: "apple", like: { food: "魚" } }
  console.log(deepObject);    // { name: "banana", like: { food: "魚" } }
  console.log(shallowObject); // { name: "banana", like: { food: "魚" } }
```

ディープコピーの方法は，他にImmer([https://zenn.dev/luvmini511/articles/85e8e3c71a2f41](https://zenn.dev/luvmini511/articles/85e8e3c71a2f41))やstructuredClone****(****[https://zenn.dev/kata_n/articles/87e7b3d644c6cc](https://zenn.dev/kata_n/articles/87e7b3d644c6cc)****)****がある