# COMPONENTS.md — コンポーネント仕様一覧

> 2026-04-18 時点の `site/src/components/` に存在する実装。各コンポーネントの責務・props・使用箇所を記録。

---

## design/

Top・下層ページで共用するデザインシステム。`src/styles/tokens.css` のトークンに収束させ、色・フォント・グリッドの追加は禁止（DESIGN_SPEC §7）。

### `Nav.astro`

上部ナビゲーション。

| prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `brandName` | string | ✓ | 左端に表示するブランド表記 |
| `links` | `{label, href}[]` | ✓ | ナビメニュー項目 |
| `overlay` | boolean | – | true で Hero 画像上の透明ナビ（デフォルト false） |

使用：index / works / news 系全ページ。

---

### `Hero.astro`

トップのメインビジュアル。背景画像あり／なし両対応。

| prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `tagline` | string | ✓ | 上部小見出し（英文） |
| `headline` | string | ✓ | 大見出し（`\n` で改行） |
| `sub` | string | ✓ | サブテキスト（`\n` で改行） |
| `backgroundImage` | string | – | 指定時は min-height 88vh のフルワイド |
| `overlay` | `none \| soft \| strong` | – | 背景画像の暗転度合い（デフォルト soft） |

使用：index。

**スクロール連動エフェクト**（背景画像がある場合のみ）：
- 背景画像：右へドリフト + スケール 1→1.08 + ブラー 0→8px + フェード 1→0.05（風に流される印象）
- オーバーレイ：透明度が薄くなる
- テキスト：わずかに上昇（-40px）+ 遅めのフェード（1→0.4）で主役として残る
- `prefers-reduced-motion` で自動停止
- 実装：`<script is:inline>` + `requestAnimationFrame`

---

### `SectionHeader.astro`

セクションごとの見出しブロック。

| prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `label` | string | ✓ | 英文小見出し（例：SERVICE） |
| `heading` | string | ✓ | 和文見出し |
| `id` | string | – | アンカー ID |
| `align` | `left \| center` | – | 揃え方（デフォルト left） |
| `number` | string | – | 装飾番号（例：`05 SERVICES`） |

使用：index・Works一覧・News一覧。

---

### `ServiceCard.astro`

サービス紹介1枚。primary フラグで大判化（主軸サービス用）。

| prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `number` | string | ✓ | 01〜05 等 |
| `labelEn` | string | ✓ | 英文ラベル |
| `title` | string | ✓ | 和文タイトル |
| `body` | string | ✓ | 本文 |
| `primary` | boolean | – | true で col-span-2 の主軸カード表示 |

使用：index の SERVICE セクション。

---

### `ProcessFlow.astro`

お仕事の流れ（フェーズデザイン型）。PC 水平 / SP 垂直のコネクトライン付き。

| prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `steps` | `Step[]` | ✓ | 各ステップ配列 |
| `durationLabel` | string | – | 末尾の期間ラベル |
| `label` | string | – | セクションラベル（デフォルト `PROCESS`） |
| `heading` | string | – | 見出し（デフォルト `プロジェクトの進め方。`） |

`Step` 型：`{ number, labelEn, title, body, ongoing? }`。ongoing=true で塗りノード。

使用：index の SERVICE セクション。

---

### `WorkCard.astro`

事例カード。4:5 の grayscale カバー画像 + メタ + タイトル + 概要。

| prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `cover` | string | ✓ | カバー画像 URL |
| `category` | string | ✓ | カテゴリラベル |
| `title` | string | ✓ | タイトル |
| `client` | string | – | クライアント表記 |
| `year` | string | – | 年（右端） |
| `summary` | string | ✓ | 概要 |
| `href` | string | – | クリック遷移先（デフォルト `#`） |
| `coverAspect` | string | – | カバー画像のアスペクトクラス。デフォルト `aspect-[4/5]` (portrait)。複数クラスで responsive 指定可能 |

使用：
- index の WORKS 抜粋：`aspect-[3/4] md:aspect-[5/4]`（モバイル portrait、PC landscape）
- /works 一覧：デフォルト `aspect-[4/5]`

---

### `ProductCard.astro`

商品カード。1:1 画像 + 価格 + 外部 STORE リンク。

| prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `image` | string | ✓ | 商品画像 URL |
| `name` | string | ✓ | 商品名（和文） |
| `nameEn` | string | – | 英文サブネーム |
| `volume` | string | ✓ | 容量表記 |
| `price` | string | ✓ | 価格表記 |
| `externalUrl` | string | ✓ | 外部遷移先（4est.co.jp） |

使用：index の PRODUCTS セクション。

---

### `Button.astro`

CTA / リンクボタン。4バリアント × 2サイズ。

| prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `href` | string | – | 指定で `<a>`、未指定で `<button>` |
| `variant` | `primary \| outline \| text \| ghost` | – | デフォルト primary（ink 塗り） |
| `size` | `md \| lg` | – | デフォルト md |
| `external` | boolean | – | true で target=_blank |
| `type` | `button \| submit` | – | button 時のみ |
| `class` | string | – | 追加クラス |

使用：index・Works・News 全域の CTA。

---

### `ContactForm.astro`

問い合わせフォーム（UI のみ）。**Phase 6 で backend 結線予定**。

項目：お名前 / 会社名・ご所属 / メール / カテゴリ（空間香・商品・講演・その他）/ 本文。送信先は `SITE.contactEmail`。

使用：index の CONTACT セクション。

---

### `Carousel.astro`

水平カルーセル（CSS scroll-snap + 最小限JS）。

| prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `label` | string | – | ARIA ラベル |
| `gap` | string | – | Tailwind の gap クラス（デフォルト `gap-5 md:gap-6`） |
| `showControls` | boolean | – | 前後ボタン表示（デフォルト true） |
| `showCounter` | boolean | – | `01/04` カウンタ表示（デフォルト true） |
| `buttonTop` | string | – | サムネイル上にオーバーレイするボタンの縦位置％（デフォルト `40%`） |

使い方：スロットに `.carousel-item` クラスを付けた要素を並べる。アイテム幅は親側で指定。

- モバイル：スワイプで自然スナップ（ボタン非表示、`hidden md:flex`）
- PC：**サムネイル上にオーバーレイした前後ボタン**（丸型、半透明 ink 背景 + 白アイコン）／ キーボード矢印 / カウンタは下部中央
- 端に達するとボタンが自動的に opacity 0 で消える

使用：index の WORKS 抜粋（buttonTop=42%）、PRODUCTS セクション（buttonTop=32%）。

---

### `Footer.astro`

ダーク基調フッター。ブランド表記 + 運営 + 外部リンク + © コピーライト。

props なし。`SITE` config から自動取得。

使用：全ページ。

---

## effects/

### `ScentParticles.astro`

**香りの分子構造を組み合わせる**というメタファーを視覚化する Canvas 2D エフェクト。カーソル／クリック／タッチで点（分子）が生成され、近傍同士が細い接続線（結合）で結ばれて分子ネットワークを形成する（particles.js 風、ただしカーソル連動でのみ発生）。

**主要パラメータ**（`CONFIG` オブジェクト）：
- `MAX_PARTICLES`: 同時存在する最大粒数
- `EMIT_ON_MOVE / CLICK / TOUCH`: 各イベントで生成する粒数・速度・サイズ・寿命
- `LINE_DIST`: 線で結ぶ距離閾値（120px）
- `LINE_WIDTH`: 線の太さ（0.6px）
- `DOT_ALPHA_PEAK` / `LINE_ALPHA_PEAK`: 最大透明度

**完全無効化**：`BaseLayout.astro` の import 1行を外すだけ。
**表現調整**：上記 CONFIG を編集。詳細は Notion タスク「PJ26調香デザイン｜ScentParticles 修正・削除依頼のしかた」参照。

使用：BaseLayout（全ページ共通）。

---

## layouts/

### `BaseLayout.astro`

全ページ共通の HTML スケルトン。

| prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `title` | string | – | `<title>` 用（ブランド名が自動付与される） |
| `description` | string | – | meta description |

- Google Fonts を `<link>` で読み込み
- `<ScentParticles />` を `<body>` 末尾に配置
- global.css / tokens.css を適用

使用：全ページ。
