# Phase 6 — Contact フォーム backend（Google Apps Script 連携）

> Resend SaaS 案から **Google Apps Script 経由の送信** に設計変更。
> 4est.co.jp が既に Google Workspace 運用のため、送信元・スパム対策・ログまで Workspace 内で完結させる。

---

## アーキテクチャ

```
[ブラウザ]
   │ POST（form data + reCAPTCHA token）
   ▼
[Apps Script Web App（script.google.com）]
   │ オーナー: s.takeda@4est.co.jp で実行
   │
   ├─▶ reCAPTCHA v3 API：スコア判定（0.5 未満は拒否）
   │
   ├─▶ Gmail API：
   │    ├─ 管理者通知（a.takeda@4est.co.jp 宛、Reply-To: 入力者）
   │    └─ 入力者自動返信（お礼 + 入力内容のコピー）
   │
   └─▶ Google Sheets：問い合わせログに1行追記
```

---

## 相乗効果（Workspace 統合）

- **送信元が 4est.co.jp の真の Gmail アドレス** → DKIM/SPF は Workspace 管理、到達率最大
- **返信が Gmail スレッドとして継続** → 通常の問い合わせ対応と同じ UX
- **全送信をスプシで自動ログ化** → ミニ CRM として機能
- **追加 SaaS ゼロ、追加費用ゼロ**（Workspace 有料枠内）
- **Calendar 連携素地あり**（将来、面談日程調整の自動化が容易）

---

## 役割分担

| 工程 | 担当 | ツール |
|---|---|---|
| Apps Script `.gs` コード作成 | Claude Code | ローカルファイル（`site/scripts/apps-script/`） |
| clasp 導入・初回 login | 武田惇奨 | ターミナル（1回のみ） |
| Apps Script プロジェクト作成 | Claude Code | clasp CLI |
| スプレッドシート新規作成 | 武田惇奨 | ブラウザ（s.takeda@ で作成 → a.takeda@ 共有） |
| スプシ ID を `.env` 等に設定 | 武田惇奨 | ターミナル |
| reCAPTCHA v3 鍵登録 | 武田惇奨 | [google.com/recaptcha](https://www.google.com/recaptcha/) |
| Web App デプロイ | Claude Code | clasp deploy（初回のみ UI 確認が必要な場合あり） |
| ContactForm のフロント更新 | Claude Code | ローカルファイル |

---

## 必要な事前準備（武田惇奨さん）

### A. スプレッドシート作成
1. Google ドライブで新規スプレッドシート作成（オーナー：s.takeda@4est.co.jp）
2. ファイル名：`AAA_WEB問い合わせログ`（仮）
3. 共有：a.takeda@4est.co.jp を閲覧権限で追加
4. ヘッダ行を1行目に：
   | 受信日時 | 名前 | 会社名 | メール | カテゴリ | 本文 | reCAPTCHA スコア |
5. URL から **スプシ ID** を控える（`/d/XXXXXX/edit` の `XXXXXX` 部分）
6. （後で）共有ドライブに移動予定

### B. reCAPTCHA v3 鍵登録
1. [reCAPTCHA 管理画面](https://www.google.com/recaptcha/admin) で新規サイト登録
2. タイプ：**reCAPTCHA v3**
3. ドメイン：`ai-takeda.jp`（暫定）／`localhost`（開発用）
4. **サイトキー**（公開）と**シークレットキー**（秘密）を控える

### C. clasp 導入
```bash
npm install -g @google/clasp
clasp login   # ブラウザが開き Google OAuth。s.takeda@4est.co.jp でログイン
```

---

## Apps Script の構成（予定）

配置：`site/scripts/apps-script/`

```
apps-script/
├── .clasp.json                … プロジェクト ID（clasp create で生成）
├── appsscript.json            … マニフェスト（OAuth スコープ、V8 ランタイム）
├── Code.gs                    … doPost エントリーポイント
├── mail.gs                    … Gmail 2通送信ロジック
├── recaptcha.gs               … v3 スコア検証
├── sheet.gs                   … スプシ 1行追記
└── templates.gs               … メール本文テンプレート（管理者・自動返信）
```

### `appsscript.json` 必要スコープ
```json
{
  "timeZone": "Asia/Tokyo",
  "dependencies": {},
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/script.send_mail",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/script.external_request"
  ],
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  }
}
```

### Script Properties（Apps Script の環境変数）
Apps Script の「プロジェクトの設定 > スクリプト プロパティ」で設定：
- `SHEET_ID` … 問い合わせログのスプシ ID
- `RECAPTCHA_SECRET` … reCAPTCHA v3 シークレットキー
- `ADMIN_EMAIL` … `a.takeda@4est.co.jp`
- `REPLY_FROM_ALIAS` … 送信時に使う名前表示（例：`AI TAKEDA <a.takeda@4est.co.jp>`）

---

## サブフェーズ

### Phase 6a：Apps Script コード作成（Claude Code）
- `.gs` ファイル群を書く
- サンプルデータで単体テスト用の関数も含める

### Phase 6b：事前準備の完了
- 武田惇奨さん：スプシ作成、reCAPTCHA 登録、clasp login
- ID・鍵を Apps Script の Script Properties に設定

### Phase 6c：プロジェクト作成＆初回デプロイ
- `clasp create --type webapp` で新規プロジェクト
- `clasp push` でコードアップロード
- ブラウザで 1 回だけ「Web App としてデプロイ」の UI 操作（承認を与える）
- 発行された Web App URL を控える

### Phase 6d：ContactForm のフロント接続
- サイトキーを `SITE` config に追加
- `ContactForm.astro` を更新：
  - `<script src="https://www.google.com/recaptcha/api.js?render=SITE_KEY">` 挿入
  - 送信時に `grecaptcha.execute()` でトークン取得
  - fetch で Web App URL に POST
  - 成功／失敗の inline 表示

### Phase 6e：動作検証
- ダミー送信でメール 2通＋スプシ 1行を実測確認
- スパム模擬：reCAPTCHA スコア低のシミュレーション（dev モード）

### Phase 6f（Phase 7 と合流）
- 本番ドメイン確定後、reCAPTCHA に本番ドメイン追加
- Web App URL を Cloudflare Pages に環境変数として反映（フォーム送信先）

---

## 送信メールのテンプレート

### 管理者通知（a.takeda@4est.co.jp 宛）
```
Subject: 【新規お問い合わせ】{category} | {name} 様

以下のお問い合わせを受け付けました。

─────────────────────────────
お名前：{name}
ご所属：{company}
メール：{email}
カテゴリ：{categoryLabel}

ご相談内容：
{message}

─────────────────────────────

受信日時：{jstNow}
reCAPTCHA スコア：{score}

（このメールに直接返信すると、Reply-To で入力者に送信されます）
```

### 入力者自動返信（フォーム入力者 宛）
```
Subject: お問い合わせありがとうございます | AI TAKEDA

{name} 様

AI TAKEDA 特設サイトへのお問い合わせ、
誠にありがとうございます。
以下の内容で承りました。

─────────────────────────────
お名前：{name}
ご所属：{company}
カテゴリ：{categoryLabel}
ご相談内容：
{message}
─────────────────────────────

内容確認のうえ、3営業日以内に担当よりご返信いたします。
今しばらくお待ちくださいませ。

AI TAKEDA
調香師 武田 愛
株式会社武田林業 調香部門
愛媛県喜多郡内子町
```

---

## セキュリティ・運用ノート

- Web App は `Anyone anonymous` 公開だが、**reCAPTCHA v3 + honeypot field** で bot 対策
- CORS：Apps Script doPost は自動的に CORS ヘッダを返す（明示的対応不要）
- レート制限：Apps Script の 1日クォータは Workspace で 20,000 呼び出し／日＋メール 1500通／日 → 通常運用で全く問題なし
- エラー時：Apps Script 実行ログ（`console.log`）は Stackdriver に記録される
- スプシ共有：s.takeda@ オーナー／a.takeda@ 閲覧者で作成後、共有ドライブに移動可能（権限は維持）

---

## デプロイ情報（2026-04-19 配備）

### Web App URL（本番 = フォーム送信先）
```
https://script.google.com/macros/s/AKfycbxT7QY6DdqT4sdkyXOPlkqc7HMDjKBiOvmiR5vAbl4TcRkzudzcYODqs7LyKDO2J6U/exec
```

### 関連 ID
- Apps Script プロジェクト URL: https://script.google.com/d/1-6iG2YSUOIqh4LYMrWtE8k-BRJV1GphTF3wUYzUuCwIMM8C9kKRoMF-k/edit
- デプロイ ID: `AKfycbxT7QY6DdqT4sdkyXOPlkqc7HMDjKBiOvmiR5vAbl4TcRkzudzcYODqs7LyKDO2J6U`
- バージョン: 1（2026-04-19 10:22 初回デプロイ）

### Script Properties（Apps Script 側に設定済）
| プロパティ | 値 |
|---|---|
| `SHEET_ID` | `1d2nphl4C-JMQ74DzsGc3n1DusIcSNaO5YJw9q48TDdw` |
| `RECAPTCHA_SECRET` | `6Lcs8r0sAAAAAJLPxUC7PUdpEUShjUP8a_Jv9ujR` |
| `ADMIN_EMAIL` | `a.takeda@4est.co.jp` |
| `BRAND_NAME` | `AITAKEDA Aromatic Architects` |

### ヘルスチェック結果
```bash
$ curl -s https://script.google.com/macros/s/AKfycbxT7QY6DdqT4sdkyXOPlkqc7HMDjKBiOvmiR5vAbl4TcRkzudzcYODqs7LyKDO2J6U/exec
{"ok":true,"service":"AI TAKEDA Contact","version":"1.0.0"}
```
→ 2026-04-19 時点で正常稼働を確認。

### 関連スプレッドシート
https://docs.google.com/spreadsheets/d/1d2nphl4C-JMQ74DzsGc3n1DusIcSNaO5YJw9q48TDdw/edit

---

## 屋号決定（2026-04-19 仮確定）

- **正式屋号**: `AITAKEDA Aromatic Architects`
- **短縮名**（Nav / Footer 用）: `AITAKEDA`
- **既存タグライン**: `AROMATIC DESIGN FROM THE FOREST`（継続使用）

サイト側への反映は Phase 6 完了後に Tina 経由で編集。

---

## Open Questions（解決済み）

- [x] ~~スプシのファイル名~~ → `AAA_WEB問い合わせログ` で確定
- [x] ~~reCAPTCHA 登録ドメイン~~ → 暫定 `localhost` / 本番確定後追加予定
- [x] ~~送信元の表示名~~ → `AITAKEDA Aromatic Architects`
