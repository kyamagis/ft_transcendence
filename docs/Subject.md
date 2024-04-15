# 課題文

II.1 Overview
Thanks to your website, users will play Pong with others. You will provide a nice user interface, a chat, and real-time multiplayer online games!
Your work has to comply with the following rules:

- Your website backend must be written in NestJS.
- The frontend must be written with a TypeScript framework of your choice.
- You are free to use any library you want to in this context. However, you must use the latest stable version of every library or framework used in your project.
- You must use a PostgreSQL database. That’s it, no other database.
- Your website must be a single-page application. The user should be able to use the Back and Forward buttons of the browser.
• Your website must be compatible with the latest stable up-to-date version of Google Chrome and one additional web browser of your choice.
• The user should encounter no unhandled errors and no warnings when browsing the website.
• Everything has to be launch by a single call to: docker-compose up --build

When your computers in clusters run under Linux, you will use Docker in rootless mode for security reasons. This comes with 2 sideways: 1) your Docker runtime files must be located in /goinfre or /sgoinfre. 2) you can’t use so called “bind-mount volumes” between the host and the container if non-root UIDs are used in the container. Depending on the project, your situation and the context, several fallbacks exist: Docker in a VM, rebuild you container after your changes, craft your own docker image with root as unique UID.

II.1 概要
あなたのウェブサイトのおかげで、ユーザーは他の人と一緒にPongをプレイすることができます。あなたは、素敵なユーザーインターフェイス、チャット、リアルタイムマルチプレイヤーオンラインゲームを提供することになります！
あなたの仕事は、以下のルールに従わなければなりません：

- バックエンドは、NestJSで記述する必要があります。
- フロントエンドは、あなたが選んだTypeScriptフレームワークで書かなければなりません。
- この文脈では、どのようなライブラリを使ってもかまいません。ただし、プロジェクトで使用するすべてのライブラリやフレームワークの最新の安定版を使用する必要があります。
- データベースはPostgreSQLを使用する必要があります。それ以外のデータベースは使用しないでください。
- あなたのウェブサイトは、シングルページのアプリケーションでなければなりません。ユーザーは、ブラウザの「戻る」「進む」ボタンを使用できる必要があります。
- あなたのウェブサイトは、Google Chromeの最新の安定した最新バージョンと、あなたが選んだ追加のウェブブラウザ1つと互換性がなければなりません。
- ユーザーがウェブサイトを閲覧する際に、処理されないエラーや警告が発生しないこと。
- docker-compose up --build を1回呼び出すだけで、すべてが起動する必要があります。

クラスタ内のコンピュータがLinuxで動作している場合、セキュリティ上の理由からDockerをルートレスモードで使用することになります。これには2つの側面があります： 1) Dockerのランタイムファイルは/goinfreまたは/sgoinfreに配置する必要があります。2) コンテナで非 root UID が使用されている場合、ホストとコンテナの間でいわゆる「バインドマウントボリューム」を使用することができない。プロジェクトや状況、文脈に応じて、いくつかのフォールバックが存在します： VMでDockerする、変更後にコンテナを再構築する、rootをユニークUIDとして独自のDockerイメージを作成する。

II.2 Security concerns
In order to create a fully functional website, here are a few security concerns that you have to tackle:
• Any password stored in your database must be hashed.
• Your website must be protected against SQL injections.
• You must implement some kind of server-side validation for forms and any user input.

Please make sure you use a strong password hashing algorithm

For obvious security reasons, any credentials, API keys, env variables etc... must be saved locally in a .env file and ignored by git. Publicly stored credentials will lead you directly to a failure of the project.

II.2 セキュリティに関する懸念
完全に機能するウェブサイトを作成するために、ここであなたが取り組まなければならないいくつかのセキュリティの懸念があります：

- データベースに保存されるパスワードは、ハッシュ化されなければならない。
- ウェブサイトはSQLインジェクションから保護されていなければなりません。
- フォームやユーザー入力に対して、何らかのサーバーサイドのバリデーションを実装する必要があります。

強力なパスワードハッシュアルゴリズムを使用していることを確認してください。

セキュリティ上の理由から、認証情報、APIキー、環境変数などは.envファイルにローカルに保存し、gitでは無視する必要があります。公開されている認証情報は、プロジェクトの失敗に直接つながります。

II.3 User Account
• The user must login using the OAuth system of 42 intranet.
• The user should be able to choose a unique name that will be displayed on the website.
• The user should be able to upload an avatar. If the user doesn’t upload an avatar, a default one must be set.
• The user should be able to enable two-factor authentication. For instance, Google Authenticator or sending a text message to their phone.
• The user should be able to add other users as friends and see their current status (online, offline, in a game, and so forth).
• Stats (such as: wins and losses, ladder level, achievements, and so forth) have to be displayed on the user profile.
• Each user should have a Match History including 1v1 games, ladder, and anything else useful. Anyone who is logged in should be able to consult it.

II.3 ユーザーアカウント

- ユーザは、42 イントラネットの OAuth システムを使用してログインしなければならない。
- ユーザーは、ウェブサイトに表示される固有の名前を選択できるようにする必要があります。
- ユーザーは、アバターをアップロードできるようにする必要があります。ユーザーがアバターをアップロードしない場合、デフォルトのアバターが設定されなければならない。
- ユーザーは、二要素認証を有効にすることができる必要があります。例えば、Google Authenticatorや携帯電話へのテキストメッセージの送信などです。
- 他のユーザーをフレンドとして追加し、現在のステータス（オンライン、オフライン、ゲーム中、など）を確認できること。
- ユーザープロファイルに統計情報（勝敗、ラダーレベル、実績など）が表示されなければならない。
- 各ユーザーは、1vs1ゲーム、ラダー、その他有用なものを含むマッチヒストリーを持つべきです。ログインしている人なら誰でもそれを参照できるようにすること。

II.4 Chat
You also have to create a chat for your users:
• The user should be able to create channels (chat rooms) that can be either public, or private, or protected by a password.
• The user should be able to send direct messages to other users.
• The user should be able to block other users. This way, they will see no more messages from the account they blocked.
• The user who has created a new channel is automatically set as the channel owner until they leave it.
◦ The channel owner can set a password required to access the channel, change it, and also remove it.
◦ The channel owner is a channel administrator. They can set other users as administrators.
◦ A user who is an administrator of a channel can kick, ban or mute (for a limited time) other users, but not the channel owners.
• The user should be able to invite other users to play a Pong game through the chat interface.
• The user should be able to access other players profiles through the chat interface.
II.5 Game
The main purpose of this website is to play Pong versus other players.
• Therefore, users should be able to play a live Pong game versus another player directly on the website.
• There must be a matchmaking system: the user can join a queue until they get automatically matched with someone else.
• It can be a canvas game, or it can be a game rendered in 3D, it can also be ugly, but in any case, it must be faithful to the original Pong (1972).
• You must offer some customization options (for example, power-ups or different maps). However, the user should be able to select a default version of the game without any extra features if they want to.
• The game must be responsive!
Think about network issues, like unexpected disconnection or lag.
You have to offer the best user experience possible.

II.4 チャット
ユーザーのためのチャットも作成する必要があります：

- ユーザーは、公開、非公開、パスワードで保護されたチャンネル（チャットルーム）を作成できるようにする必要があります。
- ユーザーは、他のユーザーにダイレクトメッセージを送ることができるようにする。
- ユーザーは、他のユーザーをブロックすることができるべきです。そうすれば、ブロックしたアカウントからのメッセージは見られなくなります。
- 新しいチャンネルを作成したユーザーは、そのチャンネルから離れるまで、自動的にチャンネルオーナーに設定されます。
チャンネルオーナーは、チャンネルへのアクセスに必要なパスワードを設定したり、変更したり、削除したりすることができます。
チャネルオーナーは、チャネル管理者です。他のユーザーを管理者に設定することができます。
チャンネルの管理者であるユーザーは、他のユーザーをキック、禁止、ミュート（期間限定）することができますが、チャンネル・オーナーはできません。
- ユーザーは、チャット・インターフェースを通じて、他のユーザーをポンゲームに招待することができるはずです。
- ユーザーは、チャット・インターフェースを通じて、他のプレーヤーのプロフィールにアクセスできるべきである。

II.5 ゲーム
本サイトの主な目的は、他のプレーヤーとポン対戦をすることである。

- したがって、ユーザーは、ウェブサイト上で直接、他のプレーヤーとライブのポンゲームをプレイすることができるはずです。
- マッチメイキング・システムがなければならない。ユーザーは、自動的に誰かとマッチングされるまで、キューに参加することができる。
- キャンバス地のゲームでもいいし、3Dで描かれたゲームでもいいし、醜くてもいいのですが、いずれにせよ、オリジナルの『Pong』（1972年）に忠実である必要があります。
- いくつかのカスタマイズオプション（例えば、パワーアップや異なるマップなど）を提供しなければなりません。ただし、ユーザーが望むのであれば、追加機能のないデフォルトバージョンを選択できるようにしなければなりません。
- ゲームはレスポンシブである必要があります！
予期せぬ切断やラグなど、ネットワークの問題についても考えておきましょう。
可能な限り最高のユーザー体験を提供する必要があります。