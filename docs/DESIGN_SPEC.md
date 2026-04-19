# DESIGN_SPEC.md — AI TAKEDA 特設サイト 設計図（不変）

> 本ファイルは実装の一次情報源。Claude Code は作業開始時に必ず先頭で読み込む。
> カラー・フォント・グリッド・禁止事項の変更には必ず人間の承認を要する。

---

## 1. プロジェクト概要

- **クライアント**：株式会社武田林業／武田愛（調香師）
- **目的**：調香師「AI TAKEDA」個人ブランディングの特設WEBサイト
- **役割分担**：物販・会社案内は親会社 4est.co.jp が担う。本サイトは「法人向けオリジナル調香」を主軸にしたPRサイト
- **差別化軸**：愛媛県内子町の林業バックボーン／未利用材を原料にした自社蒸留／林業プレーヤー当事者としての香り作り
- **所属記載ルール**：IAPA 所属の記載は可。師匠個人名の記載は不可。

## 2. 参照サイト

| サイト | 参照領域 |
|---|---|
| https://www.flyhyer.com/ | デザイン・UI（モノトーン、グリッド、ビジネス好感、シンプル、余白の沈黙） |
| https://ts-aromatique.com/ | 情報構造（PHILOSOPHY → PROFILE → SERVICE → WORKS → NEWS → CONTACT） |
| https://4est.co.jp/ | 親会社／物販送客先／林業バックボーン |

## 3. サイト構造

```
/                      Top（Hero / Philosophy / Profile / Service / Works抜粋 / Products / News抜粋 / Contact）
/works                 事例一覧（グリッド）
/works/[slug]          事例詳細（MDX）
/news                  お知らせ一覧
/news/[slug]           お知らせ詳細（MDX）
```

Topはアンカー遷移（#philosophy, #service …）。Products CTAは 4est.co.jp へ外部遷移。

## 4. 技術スタック

| 層 | 採用 |
|---|---|
| フレームワーク | Astro 5.x（静的書き出し、MDX、島構成） |
| 言語 | TypeScript strict |
| スタイリング | Tailwind CSS v4 + CSS変数トークン |
| コンテンツ | MDX + JSON（content/ 配下） |
| 編集UI | **TinaCMS**（Git backend、WYSIWYG） |
| 素材制作 | Canva（従属ツール・画像書き出しのみ） |
| ホスティング | Cloudflare Pages（無料枠） |
| フォーム | Cloudflare Pages Functions + Resend + Turnstile |
| ドメイン | ai-takeda.jp（推奨）／aitakeda.com（第二） |

## 5. デザインシステム

### 5.1 カラートークン

```css
:root {
  --ink:    #111111; /* 本文・見出し */
  --paper:  #F6F3EE; /* 背景：和紙の白 */
  --fog:    #D9D4CB; /* 罫線・区切り */
  --moss:   #2F3A2E; /* アクセント1：深い苔緑（CTA・リンクホバー） */
  --ember:  #8A5A3B; /* アクセント2：ヒノキ樹皮（数字・年号装飾） */
}
```

配分：モノトーン 8〜9割、moss 1割、ember 0〜1割。

### 5.2 タイポグラフィ

- 和文本文：**Noto Serif JP** 400 / 500
- 和文見出し：**Shippori Mincho B1** 600
- 欧文装飾：**Cormorant Garamond** Italic または **Syne**
- 欧文キャプション：**Inter** 400

スケール（Tailwind）：`xs 12 / sm 14 / base 16 / lg 18 / 2xl 24 / 4xl 40 / 6xl 64 / 8xl 104`。見出しは `clamp()` で流体。

### 5.3 グリッド・スペーシング

- 12カラム、ガター 24px、max-width 1440px、左右パディング 96px（モバイル 16px）
- 8pxベース：`space-2=16, space-4=32, space-8=64, space-16=128, space-24=192`
- セクション間：192px（沈黙の演出）

### 5.4 アニメーション

- 基本静止。スクロール時の fade-in / translate-y のみ（duration 400ms、ease-out）
- `prefers-reduced-motion` に完全対応

## 6. 編集可能領域（TinaCMS）

| 対象 | 編集可 |
|---|---|
| Hero見出し／サブ／画像 | ○ |
| Philosophy 本文 | ○ |
| Profile テキスト／顔写真／経歴リスト | ○ |
| Service 5枚カード（主1＋従4） | ○ |
| Works（無制限追加・編集） | ○ |
| Products 4枚（説明・画像・外部リンク） | ○ |
| News（無制限追加・編集） | ○ |
| フッター・OGP・連絡先メタ | ○ |
| カラー／フォント／グリッド／アニメーション | **×（開発者のみ）** |

## 7. 禁止事項（Claude Code 向け）

- ❌ DESIGN_SPEC.md に無いカラー／フォント／スペーシングを追加する
- ❌ 文言をコンポーネントにハードコードする（必ず content/ または props から供給）
- ❌ 外部UIライブラリ（MUI、Chakra、shadcn、daisyUI 等）を導入する
- ❌ JavaScript を不要な箇所に島として差し込む（Astroデフォルト=静的HTMLが原則）
- ❌ 画像を未最適化で使う（必ず Astro `<Image>` で AVIF/WebP に変換）
- ❌ Phase 完了前に次 Phase に進む（PROGRESS.md と人間承認が必須）

## 8. 受け入れ基準

- Lighthouse Performance ≥ 95 / Accessibility 100 / Best Practices 100 / SEO 100
- 主要ページで axe-core エラー 0
- `prefers-reduced-motion` で全アニメーション停止
- モバイル 375px / タブレット 768px / デスクトップ 1440px の3幅で崩れなし
- 武田愛さんが EDIT_GUIDE.md のみで本文・画像・事例追加を1人で完了できる

## 9. 制作フェーズ

| Phase | 内容 | 成果物 |
|---|---|---|
| 0 | 設計図作成（本ファイル含む） | docs/*.md |
| 1 | Astro + Tailwind + MDX + TinaCMS 初期化 | site/ スキャフォールド |
| 2 | tokens.css + frontend-design skill で7コンポーネント生成 | src/components/design/* |
| 3 | Top長尺ページ → Works/News 詳細ページ組み立て | src/pages/* |
| 4 | 既存資料（Desktop PDFs、Aromamori写真）からコンテンツ投入 | content/* |
| 5 | TinaCMS スキーマ確定／Cloud接続／武田愛さんに権限付与 | tina/config.ts |
| 6 | フォーム・SEO・OGP・構造化データ | functions/, src/components/seo |
| 7 | Cloudflare Pages デプロイ／独自ドメイン接続／検収 | 本番環境 |

## 9.5 アセット運用（暫定）

- **ロゴ**：正式ロゴは約半年後制作予定。それまでは武田林業ロゴ（`tflogo_bk.png`）を仮置き。
  - ソース：`/Users/s.takeda4est.co.jp/Library/CloudStorage/GoogleDrive-s.takeda@4est.co.jp/共有ドライブ/80TAKEDAFORESTRY/81WEBとSNS/icon/tflogo_bk.png`
  - 設置先：`site/public/logo/tflogo_bk.png`（Phase 1 でコピー）
  - 差し替え時は同じファイル名で上書きすれば全箇所反映されるようパスを一元化
- **写真**：Phase 1-3 はダミー（unsplash 等の無償素材、または単色プレースホルダー）で進行。Phase 4 冒頭で実素材を一括受領して差し替える。
- **屋号／ドメイン**：未定。`src/config/site.ts` に `BRAND_NAME` / `SITE_URL` を一元化し、確定時に1ファイル書き換えで全反映。

## 10. 参照 md ファイル

- `docs/BRAND.md` — 声・トーン・用語集
- `docs/CONTENT.md` — 本文ドラフト・CTA文言
- `docs/PROGRESS.md` — 進捗ログ・決定事項・未解決項目
- `docs/COMPONENTS.md` — 生成コンポーネントの責務（Phase 2 で作成）
- `docs/EDIT_GUIDE.md` — 武田愛さん向け運用マニュアル（Phase 5 で作成）
- `docs/DEPLOY.md` — デプロイ手順（Phase 7 で作成）
