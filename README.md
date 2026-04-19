# AITAKEDA Aromatic Architects — 特設サイト

調香師 武田愛（AI TAKEDA）の個人ブランディングサイト。愛媛県内子町の林業バックボーンを軸に、法人向けオリジナル調香を主軸サービスとして訴求する。

## 技術スタック

| 層 | 採用 |
|---|---|
| フレームワーク | Astro 5.x |
| スタイリング | Tailwind CSS v4 + CSS変数トークン |
| コンテンツ | MDX + JSON（`content/` 配下）、TinaCMS で編集可 |
| Contact フォーム | Google Apps Script + Gmail + Google Sheets + reCAPTCHA v3 |
| ホスティング | Cloudflare Pages（予定） |

## ディレクトリ構成

```
ai-takeda-site/
├── docs/                         … 設計ドキュメント（不変の仕様書群）
│   ├── DESIGN_SPEC.md
│   ├── BRAND.md
│   ├── CONTENT.md
│   ├── PROGRESS.md
│   ├── COMPONENTS.md
│   ├── TINA_SCHEMA.md
│   └── PHASE_6_APPS_SCRIPT.md
└── site/                         … Astro プロジェクト
    ├── src/
    │   ├── components/design/    … デザインシステム（12 コンポーネント）
    │   ├── components/effects/   … ScentParticles 等
    │   ├── config/site.ts        … 屋号・URL・メール・SNS 一元化
    │   ├── content.config.ts     … Astro Content Collections 定義
    │   ├── layouts/
    │   ├── pages/
    │   └── styles/
    ├── content/                  … Tina 編集可能なコンテンツ
    ├── tina/config.ts            … TinaCMS スキーマ（8 コレクション）
    └── scripts/apps-script/      … Contact フォーム backend（Apps Script）
```

## ローカル開発

```bash
cd site
npm install
npm run dev          # Astro のみ
npm run dev:tina     # Astro + Tina 管理画面を同時起動
```

- http://localhost:4321/ — 公開ページ
- http://localhost:4321/admin/index.html — Tina 管理画面（ローカルモード）

## 詳細設計

`docs/` 配下の `.md` を参照。特に `PROGRESS.md` に現在の実装状況を記録。

## 運用メモ

- コンテンツ編集：Tina 管理画面（本番デプロイ後は Tina Cloud 経由）
- Contact フォーム：Google Apps Script（`site/scripts/apps-script/`）で動作。詳細は `docs/PHASE_6_APPS_SCRIPT.md` 参照
- 画像素材：Phase 4 で実写真に差し替え予定（現在はダミー）
