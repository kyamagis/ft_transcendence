# Node.jsでサーバーを立てるとは

作成者: tfujiwar
最終更新日時: 2023年7月11日 0:10

### 疑問点

- これまでPythonでWebサービス開発をしていたため、DjangoやFlaskなどの開発者用サーバーとNode.jsサーバーを類推して認識していた
- 上記認識に基づくと、Node.jsのサーバーはかなり脆弱なのでは?

### わかったこと

- Node.jsはjavascriptでサーバーサイドを実装できる
- Pythonでウェブアプリを開発する場合との類推でいくと、WSGIの範囲までNode.jsが担当している

```mermaid
flowchart LR
Client --> Node.js_Server
```

```mermaid
flowchart LR
Client --> WSGI_Server --> Django
```