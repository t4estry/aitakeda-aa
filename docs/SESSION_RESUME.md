# SESSION_RESUME — 次セッション起点ドキュメント

> **新セッションを開始したら、まずこのファイルを最初に読むこと。**
> 「現在地」「全URL/ID」「再開手順」「凍結中の判断」を1枚に集約。
> 詳細は本ファイル末尾の「リンク先一覧」から各設計書へ辿る。

最終更新：2026-04-20
プロジェクト：**AITAKEDA Aromatic Architects 特設ブランディングサイト**
担当：武田惇奨（実装）／武田愛（運用・編集）

---

## 0. 30 秒サマリー

- 本サイトは **武田愛（調香師）** の個人ブランディングサイト。物販なし、法人向け調香が主軸。
- 技術構成：**Astro 5.x + Tailwind v4 + MDX + TinaCMS Cloud + Cloudflare Pages + Apps Script（Gmail+Sheets+reCAPTCHA v3）**
- **Phase 0〜7-1 は完了済み。本番サイトは noindex で稼働中、武田愛さんのレビュー待ち**。
- ローカルパスは **2026-04-20 に Desktop → Documents/code/ へ移動済み**。
- 武田愛さんへのレビュー依頼は Notion タスク **TSK-15194** で発行済み。

---

## 1. ローカルパス

```
~/Documents/code/ai-takeda-site/
├── docs/                ← 設計書群（このファイル含む）
└── site/                ← Astro プロジェクト本体
    ├── content/         ← TinaCMS 編集対象（MDX/JSON）
    ├── src/
    ├── tina/config.ts
    ├── scripts/apps-script/   ← Google Apps Script ソース（clasp 管理）
    └── .env             ← Tina Cloud credentials（commit 済 .gitignore）
```

**注意**：`launch.json` には旧パス `ai-takeda-site/site` が残るが、これは Desktop 上のシンボル名扱い。実際は `~/Documents/code/ai-takeda-site/site` で動かす。

---

## 2. 現在の公開状況

| 種別 | URL | 状態 |
|---|---|---|
| 本番（カスタムドメイン） | https://aroma.4est.co.jp | noindex 中、関係者のみ閲覧 |
| Cloudflare 自動 URL | https://aitakeda-aa.pages.dev | 同上（プレビュー） |
| Tina admin | https://aroma.4est.co.jp/admin/index.html | Cloud 接続済 |
| GitHub repo | https://github.com/t4estry/aitakeda-aa | **Public（Private 化判断保留中）** |
| Cloudflare Pages dashboard | https://dash.cloudflare.com → Pages → aitakeda-aa | s.takeda@4est.co.jp |
| Apps Script project | https://script.google.com/d/1-6iG2YSUOIqh4LYMrWtE8k-BRJV1GphTF3wUYzUuCwIMM8C9kKRoMF-k/edit | s.takeda@ オーナー |
| 問い合わせログ | https://docs.google.com/spreadsheets/d/1d2nphl4C-JMQ74DzsGc3n1DusIcSNaO5YJw9q48TDdw/edit | 共有ドライブ `AAA_WEB問い合わせログ` |

---

## 3. 全クレデンシャル・全 ID

### 3.1 Tina Cloud
- Client ID：`9c0ec3e0-4eea-437a-afd1-aa442d6e0457`
- Token：`558768e91f0cf14fdeaf1557bbefd179033d2028`
- Branch：`main`
- **Path to Tina Config：`site`**（※ `site/tina` ではなくここが今回のハマりどころ。次回設定変更時も `site` を維持）
- ローカルでは `site/.env` に `NEXT_PUBLIC_TINA_CLIENT_ID` と `TINA_TOKEN` が記載済
- Cloudflare Pages 環境変数にも同 2 値を設定済（Production / Preview 両方）

### 3.2 Apps Script Web App（Contact フォーム送信先）
- Web App URL：`https://script.google.com/macros/s/AKfycbxT7QY6DdqT4sdkyXOPlkqc7HMDjKBiOvmiR5vAbl4TcRkzudzcYODqs7LyKDO2J6U/exec`
- バージョン：1（2026-04-19 初回デプロイ）
- 実行アカウント：s.takeda@4est.co.jp
- アクセス：Anyone anonymous（reCAPTCHA v3 + honeypot で保護）

### 3.3 Apps Script Script Properties
| Key | Value |
|---|---|
| `SHEET_ID` | `1d2nphl4C-JMQ74DzsGc3n1DusIcSNaO5YJw9q48TDdw` |
| `RECAPTCHA_SECRET` | `6Lcs8r0sAAAAAJLPxUC7PUdpEUShjUP8a_Jv9ujR` |
| `ADMIN_EMAIL` | `a.takeda@4est.co.jp` |
| `BRAND_NAME` | `AITAKEDA Aromatic Architects` |

### 3.4 reCAPTCHA v3
- Site Key（公開）：`6Lcs8r0sAAAAAMQGPnGoftPkZpxw3jDUVjoEDOVx`（`site/src/config/site.ts` に記載）
- Secret（秘密）：上記 Apps Script Script Properties に保管
- 登録ドメイン：`localhost` / `aroma.4est.co.jp`

### 3.5 GitHub
- Repo：`t4estry/aitakeda-aa`（**Public**）
- Owner：t4estry organization
- 権限管理：Cloudflare Pages・Tina Cloud それぞれの GitHub App から閲覧/書込可
- ローカルからの push：**Claude Code の Bash 経由は認証不可**。**GitHub Desktop で実施**するのが現状の運用

### 3.6 ドメイン・DNS
- `aroma.4est.co.jp` は **お名前.com** で管理（4est.co.jp 配下のサブドメイン）
- お名前.com 側に CNAME を 1 行だけ追加：`aroma → aitakeda-aa.pages.dev`
- 4est.co.jp の MX（Google Workspace）には影響なし
- 将来 `ai-takeda.jp` 等の独自ドメインへ移行する場合は 301 リダイレクトで SEO 継承

---

## 4. 開発を再開する手順

```bash
# 1. プロジェクトへ移動
cd ~/Documents/code/ai-takeda-site/site

# 2. 依存確認（必要なら）
npm install

# 3. ローカル起動（Tina admin 含む）
npm run dev:tina
# → http://localhost:4321        本体
# → http://localhost:4321/admin  Tina（ローカルモード）

# Tina admin を起動せず純粋な Astro だけ動かす場合
npm run dev

# 本番ビルド（Tina Cloud に繋がる）
npm run build

# Tina Cloud を介さず純 Astro だけビルドしたい場合
npm run build:astro-only
```

### git push の運用
- Claude Code の Bash からは GitHub 認証が通らない（過去ハマり）。
- **GitHub Desktop** を使って commit & push を実施するのが現状フロー。
- push されると Cloudflare Pages が自動でビルド & デプロイ（main → Production、その他 → Preview）。

### Apps Script の更新
```bash
cd ~/Documents/code/ai-takeda-site/site/scripts/apps-script
clasp push          # ローカル .gs を Apps Script へ同期
# その後ブラウザで「デプロイを管理 → 編集 → 新しいバージョン → デプロイ」
# Web App URL は維持される（環境変数の差し替え不要）
```

---

## 5. ファイル / 設計書ガイド（リンク先一覧）

- `docs/PROGRESS.md` — Phase ごとの進捗ログ。**作業終了時に必ず追記**
- `docs/DESIGN_SPEC.md` — トークン・カラー・タイポ・グリッド等の不変設計
- `docs/BRAND.md` — トーン・用語集・NG ワード
- `docs/CONTENT.md` — 各セクション本文ドラフト
- `docs/COMPONENTS.md` — 11 個のデザインコンポーネント仕様
- `docs/TINA_SCHEMA.md` — TinaCMS 8 コレクションのフィールド定義
- `docs/PHASE_6_APPS_SCRIPT.md` — Apps Script 設計＋全 ID 詳細
- `docs/SESSION_RESUME.md` — **本ファイル（次セッション起点）**

未作成：
- `docs/EDIT_GUIDE.md` — 武田愛さん向け Tina 操作マニュアル（必要になったら作る）
- `docs/DEPLOY.md` — 詳細デプロイ手順（現状は PHASE_6 と本ファイルで足りている）

---

## 6. 完成・稼働中の機能（2026-04-20 時点）

### 6.1 ページ
- `/` Top 長尺（Hero / Philosophy / Profile / Service+ProcessFlow / Works抜粋 / Forest Backbone / Products / News抜粋 / Contact）
- `/works` 一覧（カテゴリ別集計付き）
- `/works/[slug]` 詳細（70vh 画像ヒーロー + MDX 本文 + 関連 Works 2 件 + CTA）
- `/news` 一覧
- `/news/[slug]` 詳細
- `/playground` コンポーネント検証用（noindex）
- `/admin/index.html` TinaCMS 編集画面（Cloud 接続済）

### 6.2 主な機能
- **Carousel**：Works (lg:1.25枚) と Products (lg:2.5枚) を CSS scroll-snap で水平スライダー化、PC はオーバーレイ前後ボタン＋カウンター＋キーボード矢印
- **ScentParticles**：HTML5 Canvas で「分子ネットワーク」を描画。カーソル/クリック/タッチ連動。`MAX_PARTICLES=130` で軽量化済。無効化したい場合は `BaseLayout.astro` の import 1 行をコメントアウト
- **Hero 風なびきスクロール**：背景画像が右へドリフト＋ブラー、テキストはわずかに浮上。`prefers-reduced-motion` で完全停止
- **Profile 右フラッシュ**：ポートレートが viewport 右端までブリードアウト、テキストは左で他セクションと整列（`md:mr-[calc((100vw-min(100vw,1440px))/-2-6rem)]`）
- **Contact フォーム E2E**：reCAPTCHA v3 → Apps Script doPost → 管理者通知メール + 入力者自動返信メール + スプシ 1 行追記。本送信成功確認済

### 6.3 TinaCMS 8 コレクション
`siteSettings / home / profile / services（5件）/ processSteps（6件）/ products（4件）/ works（3件）/ news`
- 単一ドキュメント系は `allowedActions: { create:false, delete:false }` で誤操作防止
- 武田愛さん本人が Tina 管理画面から本番編集できる状態

---

## 7. 残作業 / 凍結中の判断

| # | 項目 | ステータス | 次アクション |
|---|---|---|---|
| 1 | **Phase 4：実素材差替**（Hero/Profile/Works/商品 写真、実事例 3〜5 件） | 武田愛さん素材待ち | Notion TSK-15194 で依頼済。素材到着後に Tina 経由で差替 |
| 2 | **noindex 解除** | 公開準備中 | Cloudflare Pages 環境変数に `PUBLIC_SITE_PUBLIC=true` を追加で公開検索可になる |
| 3 | **Private 化判断** | 保留 | DX 支援者として Private 推奨。武田惇奨さんの最終判断待ち |
| 4 | EDIT_GUIDE.md 作成 | 必要時 | 武田愛さんが Tina で詰まった時に作る |
| 5 | 屋号正式確定 | 仮確定済 | `AITAKEDA Aromatic Architects`（短縮 `AITAKEDA`）。約半年後にロゴ制作と合わせて再確認 |

### Open Questions（未解決の照会）
- Q2 / Q12：プロフィール写真と Hero/Works 用素材 → 武田愛
- Q3：Works 公開可能事例（クライアント名 or 匿名表記）3〜5 件 → 武田愛
- Q5：SNS（Instagram 等）の有無 → 武田愛
- Q8：Service 料金レンジの公開可否 → 武田愛
- Q10：会社住所の詳細 → 武田惇奨
- Q9：英文タグライン `AROMATIC DESIGN FROM THE FOREST` の最終採用可否 → 武田愛

---

## 8. 重要な決定事項（再現性のため）

過去のハマりどころと、二度同じことをやらないための要点：

1. **Tina Cloud の "Path to Tina Config" は `site`**（`site/tina` にすると "Branch 'main' not found" になる）
2. **Tailwind v4 のブレークポイント**は `tokens.css` 内 `@theme` で `--breakpoint-md` 等を明示定義しないと生成されない
3. **Tina の単一ドキュメント取得**は `getEntry(...)` が ID 解決で詰まるため `getCollection(name)[0].data` を使う
4. **Tina build の初回は `--skip-cloud-checks`** が必要（package.json の `build` スクリプトに既に含む）
5. **Apps Script 連携**：Resend ではなく Apps Script を選択。Workspace 統合・ログのスプシ化・追加コスト 0 を優先
6. **Form の CORS 回避**：fetch POST は `text/plain` で送る（Apps Script doPost が JSON.parse する）
7. **clasp 利用時の罠**：`clasp create` が `appsscript.json` を上書きすることがある。Manifest（V8 + OAuth scopes + Web App config）は git 管理し、`clasp push` 時の上書き選択で `y` を選ぶ
8. **GitHub への push** は GitHub Desktop で。Claude Code の Bash からは認証不可
9. **`.git` フォルダを Google Drive に置かない**（同期競合で破損）
10. **Notion 日時設定**は `notion-create-pages` の `date:期間:start` ではなく `API-patch-page`（生 Notion API）で `+09:00` 付きで送る

---

## 9. 関連 Notion / 外部リンク

- **Notion PJ ページ**：[26調香デザイン](https://www.notion.so/2fecf864b3d780528abeca97d670bc3f)
- **Notion レビュー依頼タスク**：[TSK-15194 校正・素材差替のレビュー依頼](https://www.notion.so/347cf864b3d781099fc2cbbf4e64de5a)（担当：武田愛）
- 親会社サイト：https://4est.co.jp/
- 師匠サイト（参考）：https://ts-aromatique.com/
- デザイン参照：https://www.flyhyer.com/
- 元プラン：`~/.claude/plans/ui-https-www-flyhyer-com-happy-hammock.md`

---

## 10. 次セッションの開始テンプレ

新セッションで以下を貼ると素早く文脈復元できる：

```
~/Documents/code/ai-takeda-site/docs/SESSION_RESUME.md を読んで
現在地と残作業を把握してください。その上で本日の作業内容を相談します。
```

または特定のフェーズを進めたい場合：

```
@docs/SESSION_RESUME.md @docs/PROGRESS.md @docs/DESIGN_SPEC.md を読み込み、
[Phase 4 / noindex 解除 / EDIT_GUIDE 作成 / その他] を進めます。
完了条件と次アクションを提示してください。
```
