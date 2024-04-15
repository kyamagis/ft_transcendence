# importのpathを通す

作成者: tfujiwar
最終更新日時: 2023年7月13日 21:24

- `tsconfig.json`の`baseUrl`, `paths`を指定することで、importを簡潔に記述できる

```json
"baseUrl": ".",
 "paths": {
   "@/*": ["./src/*"]
 }
```

- 以下のように相対パスで指定しなくても、

```tsx
import { Component } from '../../../components/component'
```

- 絶対パスでimportできる

```tsx
import { Component } from '@/components/component'
```