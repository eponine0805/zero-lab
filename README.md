# ZERO LAB

Linuxの基礎からWebセキュリティ、調査・報告までを、日本語の40レッスンで学ぶブラウザ完結型アプリです。

## Netlifyへの公開

1. Netlifyの **Add new project → Import an existing project → GitHub** を選ぶ。
2. **eponine0805/zero-lab** を選ぶ。
3. Production branch は `main`、Build command は空欄、Publish directory は **`public`**。
4. Deployを実行。設定は `netlify.toml` にも含まれています。

APIキー、サーバー、外部CDN、データベースは不要です。Git連携後はmainへの更新が自動デプロイ対象になります。Netlifyの利用料金・上限は利用中のプランに従います。

## 内容

| チャプター | 内容 |
|---|---|
| 01 はじめてのLinux | 現在地・ユーザー・移動・隠しファイル・ノート作成 |
| 02 シェルを使いこなす | grep・パイプ・リダイレクト・権限・find・コピー |
| 03 ネットワークの地図 | IP・サブネット・経路・DNS・ポート・切り分け |
| 04 コードで調べる | JavaScript実行・filter・集計・入力検証 |
| 05 Webの裏側 | HTTP・公開情報・Cookie・認証と認可・IDOR |
| 06 脆弱性のしくみ | SQLi・HTML注入/XSSの入口・パストラバーサル・コマンド注入 |
| 07 Linuxの権限調査 | UID・プロセス・sudo・SUID・cron設定の監査 |
| 08 認証とWindows・AD | エンコード・ハッシュ・Windows ACL・AD/Kerberos基礎 |
| 09 検知とレポート | ログ相関・最小限の証拠・報告・実機ラボへの橋渡し |
| 10 最終ミッション | ファイル探索・サービス探索・ログ分析コード・総合レビュー |

- 説明 → ミッション → 段階的ヒント → 実習 → 理解度チェック
- 端末は状態を持つ仮想ファイルシステム。パイプ・リダイレクト・履歴・コマンド補完に対応
- JavaScriptはWeb Worker内で実際に評価。複数テストケースで採点し、3秒で中断
- Web演習は脆弱モードと修正モードで**同じ入力**を比較して達成
- 初回クリアのXP、レベル、学習日数、間違いの復習、メモ
- localStorageへ自動保存。JSON書き出し・読み込み、ノートのMarkdown書き出し
- スマートフォン向けレスポンシブ表示。キーボード操作とreduced-motion対応

## 実行環境の範囲

仮想シェルはLinuxカーネルやBashそのものではありません。コマンドの対応範囲は `help` を参照してください。Linuxの権限機構全般、OSプロセス、パッケージ管理は再現しません。

`nmap`、`curl`、`dig`、`ping`は **lab.local / 10.10.10.10 の架空応答** です。外部へ通信しません。脆弱性演習も架空データの簡易モデルで、実際のSQLエンジン・Webサーバー・OSコマンドは起動しません。HTML演習は構造の説明を表示し、入力HTMLやスクリプトは実行しません。

JavaScript演習は実コードを実行します。Workerに外部通信禁止のCSPを設定し、通信APIを無効化し、時間制限を設けています。ユーザー自身の学習用コードを扱うもので、多人数から敵対的コードを受け付ける汎用コード実行サービスではありません。解答・採点データはクライアントにあり、競技用の不正防止システムではありません。

このアプリにPython実行、実機Kali、Burp Proxy、Windows/ADラボ、VPN、任意ターゲットの攻撃機能は含まれません。実機での権限昇格・ピボット・本格的なAD検証などは、許可された隔離ラボで別途学ぶ段階です。OSCP対策の完全版や合格保証ではありません。

## データ保存

データはブラウザ・オリジン単位です。ドメイン変更、端末変更、ブラウザデータ削除では引き継がれません。書き出しを活用してください。読み込みでは進捗・メモ・復習・学習日数を復元し、実習端末は初期状態から再開します。実習内容に本物の秘密情報を入力しないでください。

## 開発・確認

依存パッケージなし。ES Modules対応の静的HTTPサーバーで `public` を公開します。`file://` でHTMLを直接開く方式は使いません。

```sh
npm test
python3 -m http.server 8000 --directory public
```

`npm test` は40レッスンの構造、全端末課題の参考解法と達成条件、全コード課題の入出力、Web演習の再現と修正、主要な仮想シェルの挙動を検証します。

## ファイル

- `public/content.js`: 独自教材・問題・ヒント・参考解答
- `public/engine.js`: 仮想シェルと脆弱性の学習モデル
- `public/runner.js`: JavaScript実行Worker
- `public/app.js`: UI・採点・記録
- `public/style.css`: レスポンシブ表示
- `netlify.toml`: 公開先・CSP等の設定
- `tests.mjs`: 自動検証

## 参考

公開カリキュラムを学習分野・順序の参考とし、文章、問題、解答、データは独自に作成しています。有料教材・実際の試験問題の複製はありません。

- [TryHackMe Pre Security](https://tryhackme.com/path/outline/presecurity)
- [TryHackMe Jr Penetration Tester](https://tryhackme.com/path/outline/jrpenetrationtester)
- [OffSec PEN-200](https://www.offsec.com/courses/pen-200/)
- [GNU Coreutils](https://www.gnu.org/software/coreutils/manual/coreutils.html)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [MDN JavaScript Guide](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide)

カリキュラム参照日: 2026-10-28。TryHackMe・OffSecその他の公式教材、提携サービス、認定試験ではありません。
