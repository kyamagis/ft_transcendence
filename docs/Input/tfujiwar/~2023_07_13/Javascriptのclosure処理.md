# Javascriptのclosure処理

作成者: tfujiwar
最終更新日時: 2023年7月11日 21:55

- 関数内で関数を定義した際、内側のスコープから外側のスコープを参照できる

```jsx
function outerFunction() {
     let count = 0;
 
     function innerFunction() {
         count++;
         console.log(count);
     }
 
     return innerFunction;
 }
 
 const incrementCount = outerFunction();
 
 incrementCount(); // prints 1
 incrementCount(); // prints 2
 incrementCount(); // prints 3
```