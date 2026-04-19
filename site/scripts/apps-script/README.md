# AI TAKEDA — Contact Form Backend (Google Apps Script)

フォーム送信を受け取り、メール2通＋スプシログ1行を実行する Web App。

## ファイル構成

| ファイル | 役割 |
|---|---|
| `appsscript.json` | マニフェスト（V8 / OAuth スコープ / Web App 設定） |
| `Code.gs` | `doPost()` エントリーポイント、全体フロー制御 |
| `recaptcha.gs` | reCAPTCHA v3 トークン検証 |
| `mail.gs` | 管理者通知＋入力者自動返信の2通送信 |
| `sheet.gs` | 問い合わせログスプシに1行追記 |
| `.claspignore` | clasp push 除外設定 |

## 初回セットアップ手順

### 1. Apps Script プロジェクト作成＆初回 push

```bash
cd site/scripts/apps-script
clasp create --title "AI TAKEDA Contact Form" --type standalone --rootDir .
clasp push
```

`clasp create` で `.clasp.json`（プロジェクト ID 付）が生成される。以降、コード更新時は `clasp push` のみで反映。

### 2. Script Properties を設定

Apps Script エディタ（`clasp open` で開ける）→ **プロジェクトの設定**（⚙️） → **スクリプトプロパティ** で以下の4項目を追加：

| プロパティ名 | 値 |
|---|---|
| `SHEET_ID` | `1d2nphl4C-JMQ74DzsGc3n1DusIcSNaO5YJw9q48TDdw` |
| `RECAPTCHA_SECRET` | `6Lcs8r0sAAAAAJLPxUC7PUdpEUShjUP8a_Jv9ujR` |
| `ADMIN_EMAIL` | `a.takeda@4est.co.jp` |
| `BRAND_NAME` | `AI TAKEDA` |

### 3. Web App としてデプロイ

Apps Script エディタで **デプロイ** → **新しいデプロイ** → 種類：**ウェブアプリ**。設定：

- 説明：`AI TAKEDA Contact v1`
- 次のユーザーとして実行：**自分**（= s.takeda@4est.co.jp）
- アクセスできるユーザー：**全員**

初回は OAuth 承認画面が出る。「許可」で進める。
デプロイ完了後、**ウェブアプリ URL**（`https://script.google.com/macros/s/XXXXX/exec`）が発行される。

**この URL をフロント側の ContactForm から fetch する**。

### 4. 動作確認（GET ヘルスチェック）

ブラウザで Web App URL を直接開く：
```
{"ok":true,"service":"AI TAKEDA Contact","version":"1.0.0"}
```
が表示されれば起動成功。

## 更新フロー（コード修正時）

```bash
cd site/scripts/apps-script
# .gs を編集後
clasp push
# 新バージョンをデプロイしたい場合（必要に応じて）
clasp deploy --description "v1.1"
```

デプロイ URL を変えずに更新したい場合は、Apps Script エディタの「デプロイを管理」から既存デプロイを編集 → 「新しいバージョンをデプロイ」。

## 動作テスト

Apps Script エディタで `Code.gs` を開き、ツールバーから **テスト送信** 用の関数を選んで実行：

```js
// テスト用関数（このコメント部分を Code.gs にコピーして実行可）
function testPost() {
  const mock = {
    postData: {
      contents: JSON.stringify({
        name: 'テスト 太郎',
        company: '株式会社テスト',
        email: 'test@example.com',
        category: 'space',
        message: 'これはテスト送信です。',
        recaptchaToken: 'TEST_TOKEN', // 実際は reCAPTCHA 検証で失敗するため score=null が返る
      }),
    },
  };
  const res = doPost(mock);
  console.log(res.getContent());
}
```

実際のエンドツーエンドテストは、フロント側の ContactForm から本物の reCAPTCHA トークン付きで送信することで行う。

## トラブルシューティング

- **OAuth 同意画面が頻繁に出る**：初回のみ。承認後はトークンが保存される
- **メールが届かない**：Apps Script エディタ > 実行ログを確認。Script Properties の設定漏れが多い
- **スプシに記録されない**：SHEET_ID の設定と、スプシが Apps Script 実行者（s.takeda@）と同じアカウント所有であることを確認
- **reCAPTCHA 失敗**：フロント側のサイトキーとバック側のシークレットキーがペアであること、ドメインが reCAPTCHA 管理画面に登録済みであることを確認
