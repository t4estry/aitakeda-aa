# TINA_SCHEMA.md — 編集可能コンテンツの全仕様

> Phase 5a 成果物。武田愛さんが TinaCMS 管理画面から編集できる全項目の設計書。
> Phase 5c でこの仕様どおりに `tina/config.ts` を実装する。

---

## 編集できるもの／できないもの

### ✅ 編集できる（Tina 管理画面から）

- Hero の見出し・サブテキスト・背景画像
- Philosophy の本文
- Profile（名前・肩書き・自己紹介・経歴・ポートレート）
- Service 各カード（主軸＋従属）
- プロジェクトの進め方 6 ステップ
- 事例 WORKS（追加・編集・削除 自由）
- お知らせ NEWS（追加・編集・削除 自由）
- 商品 Products（説明文・画像・外部リンク）
- Forest Backbone セクションの本文
- フッター表記（運営会社名・住所ラベル・SNS URL）

### ❌ 編集できない（コードで管理、開発者のみ）

- カラーパレット（ink / paper / moss / ember 等）
- フォント・タイポ・余白・グリッド
- ページ URL 構造・ナビゲーションのリンク先
- ScentParticles の挙動
- 問い合わせフォームの項目
- ドメイン・メタタグ（robots 等の技術設定）

---

## コレクション一覧

| # | 名前 | 種別 | 保存先 | 追加/削除 |
|---|---|---|---|---|
| 1 | サイト基本情報 | 単一 | `content/site/settings.json` | ― |
| 2 | トップページ | 単一 | `content/home/home.json` | ― |
| 3 | プロフィール | 単一 | `content/profile/profile.json` | ― |
| 4 | サービス | 複数 | `content/services/*.mdx` | ✕（固定5件） |
| 5 | プロセス | 複数 | `content/process-steps/*.mdx` | ✕（固定6件） |
| 6 | 事例（WORKS） | 複数 | `content/works/*.mdx` | ✓ 自由に追加 |
| 7 | お知らせ（NEWS） | 複数 | `content/news/*.mdx` | ✓ 自由に追加 |
| 8 | 商品 | 複数 | `content/products/*.mdx` | ✕（固定4件） |

---

## 1. サイト基本情報（site-settings）

**ファイル**：`content/site/settings.json`
**種別**：単一（1ファイル固定）

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `brandName` | ブランド名 | string | ✓ | 例：AI TAKEDA（屋号確定時に差し替え） |
| `tagline` | 英文タグライン | string | ✓ | 例：AROMATIC DESIGN FROM THE FOREST |
| `legalName` | 運営会社名 | string | ✓ | 例：株式会社武田林業 調香部門 |
| `locationLabel` | 所在地ラベル | string | – | 例：愛媛県喜多郡内子町 |
| `contactEmail` | 問い合わせ受信メール | string | ✓ | **サイト非表示、フォーム送信先のみ** |
| `instagramUrl` | Instagram URL | string | – | 未設定ならフッターに表示しない |
| `ogpImage` | OGP 画像 | image | – | SNS シェア用 1200×630 |

---

## 2. トップページ（home）

**ファイル**：`content/home/home.json`
**種別**：単一

### 2.1 Hero

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `hero.tagline` | Hero 英文キャッチ（上） | string | ✓ | 例：AROMATIC DESIGN FROM THE FOREST |
| `hero.headline` | Hero 和文見出し（大） | textarea | ✓ | 改行含む。例：`森の呼吸を、\n調香する。` |
| `hero.sub` | Hero サブテキスト | textarea | ✓ | 改行含む |
| `hero.backgroundImage` | Hero 背景画像 | image | ✓ | 2000×1200 以上推奨、モノクロ調 |
| `hero.overlay` | 画像暗転の強さ | select: none/soft/strong | – | デフォルト soft |

### 2.2 Philosophy

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `philosophy.heading` | 見出し（和文） | string | ✓ | 例：香りは、森との対話。 |
| `philosophy.paragraphs` | 本文（段落のリスト） | string[] | ✓ | 段落ごとに追加・削除可能 |

### 2.3 Forest Backbone

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `forest.heading` | 見出し（和文） | textarea | ✓ | 改行含む |
| `forest.paragraphs` | 本文（段落のリスト） | string[] | ✓ | |
| `forest.ctaLabel` | CTA テキスト | string | – | 例：武田林業の取り組みを見る |
| `forest.ctaUrl` | CTA リンク先 | string | – | 例：https://4est.co.jp/ |

### 2.4 Service セクション見出し

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `service.heading` | 見出し | string | ✓ | 例：香りで、空間とブランドを設計する。 |
| `service.number` | 装飾番号 | string | – | 例：`05 SERVICES` |

### 2.5 Works／Products／News セクション見出し

それぞれ `heading` のみ編集可（`label` の英文は固定で開発者管理）。

### 2.6 Contact セクション

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `contact.heading` | 見出し | string | ✓ | 例：香りのご相談。 |
| `contact.lead` | リード文 | textarea | ✓ | 改行含む |

---

## 3. プロフィール（profile）

**ファイル**：`content/profile/profile.json`
**種別**：単一

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `name` | 名前（和文） | string | ✓ | 例：武田 愛 |
| `nameEn` | 名前（欧文） | string | ✓ | 例：AI TAKEDA |
| `jobTitle` | 肩書き | string | ✓ | 例：調香師／株式会社武田林業 調香部門 |
| `portrait` | ポートレート画像 | image | – | 縦 3:4 推奨 |
| `bioParagraphs` | 自己紹介文（段落リスト） | string[] | ✓ | 2〜3段落 |
| `affiliations` | 所属リスト | string[] | – | 例：["IAPA 所属"] |
| `career` | 経歴 | object[] | ✓ | `{year: string, text: string}` のリスト |

---

## 4. サービス（services）

**ファイル**：`content/services/*.mdx`
**種別**：複数（5件固定、追加・削除は開発者のみ）
**並び順**：`order` フィールドで制御

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `order` | 並び順 | number | ✓ | 1 から開始。小さい順に表示 |
| `number` | 番号表記 | string | ✓ | 例：01 |
| `labelEn` | 英文ラベル | string | ✓ | 例：ORIGINAL BLEND FOR BUSINESS |
| `title` | 和文タイトル | string | ✓ | 例：法人向けオリジナル調香 |
| `body` | 本文 | textarea | ✓ | 1〜3 文推奨 |
| `primary` | 主軸サービスか | boolean | – | true で大判カード表示 |

---

## 5. プロセス（process-steps）

**ファイル**：`content/process-steps/*.mdx`
**種別**：複数（6件固定）

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `order` | 並び順 | number | ✓ | |
| `number` | 番号表記 | string | ✓ | 例：01 |
| `labelEn` | 英文ラベル | string | ✓ | HEARING / CONCEPT / COMPOSITION / REVIEW / DELIVERY / PARTNERSHIP |
| `title` | 和文タイトル | string | ✓ | 例：ヒアリング |
| `body` | 本文 | textarea | ✓ | |
| `ongoing` | 納品後フェーズか | boolean | – | true で塗りノード表示（06用） |

さらに Top 側のプロセス全体見出し：

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `home.process.heading` | プロセス見出し | string | – | 例：プロジェクトの進め方。 |
| `home.process.durationLabel` | 期間ラベル | string | – | 例：ヒアリングから納品まで 約8週間 ／ 以降、継続伴走 |

（この2項目は home.json に含める）

---

## 6. 事例 WORKS（works）

**ファイル**：`content/works/*.mdx`
**種別**：複数（**武田愛さんが自由に追加・編集・削除可能**）

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `title` | タイトル | string | ✓ | 例：ホテル客室向けの香り |
| `date` | 公開日 | date | ✓ | 並び替えに使用 |
| `category` | カテゴリ | select | ✓ | 空間香／商品香／講演／執筆／その他 |
| `client` | クライアント名 | string | – | 匿名表記でも可 |
| `year` | 年 | string | – | 例：2025 |
| `cover` | カバー画像 | image | ✓ | 縦 4:5 推奨（800×1000 以上） |
| `summary` | 概要（1文） | textarea | ✓ | 一覧カードで表示される |
| `tags` | タグ | string[] | – | 検索・絞り込み用 |
| `body` | 本文（MDX） | rich-text | ✓ | h2/h3、箇条書き、強調などが使える |

**本文に含めて欲しい構成例**：
- 背景
- 調香の方向性
- プロセス
- 納品後／継続伴走

---

## 7. お知らせ NEWS（news）

**ファイル**：`content/news/*.mdx`
**種別**：複数（**自由に追加・編集・削除可能**）

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `title` | タイトル | string | ✓ | |
| `date` | 公開日 | date | ✓ | 新しい順に表示 |
| `body` | 本文（MDX） | rich-text | ✓ | |

---

## 8. 商品（products）

**ファイル**：`content/products/*.mdx`
**種別**：複数（4件固定、追加・削除は基本開発者）

| フィールド | Tina ラベル | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `order` | 並び順 | number | ✓ | |
| `name` | 商品名（和文） | string | ✓ | 例：ANTOKINO HINOKI |
| `nameEn` | 英文サブネーム | string | – | 例：ROOM SPRAY |
| `image` | 商品画像 | image | ✓ | 正方形推奨 |
| `volume` | 容量 | string | ✓ | 例：150ml |
| `price` | 価格 | string | ✓ | 例：¥1,980 |
| `externalUrl` | 4est ストア URL | string | ✓ | 外部遷移先 |

---

## 画像ライブラリの運用

TinaCMS の画像アップローダーで `public/images/` 配下に保存される。

推奨フォルダ構成：
```
public/
├── images/
│   ├── hero/          … Hero 背景画像
│   ├── profile/       … ポートレート
│   ├── works/         … Works カバー（slug 名でわかる様に）
│   ├── products/      … 商品画像
│   └── ogp/           … SNS シェア用
└── logo/              … ロゴ（開発者管理）
```

Phase 4（実素材受領）時に、武田愛さんの写真を該当フォルダにアップロードして Tina から参照する。

---

## Tina UI 表示順（管理画面メニュー）

使用頻度の高い順に並べる：

1. お知らせ（NEWS）← 最も頻繁に追加
2. 事例（WORKS）
3. トップページ（home）
4. プロフィール
5. 商品
6. サービス
7. プロセス
8. サイト基本情報

---

## 実装時の注意点（Phase 5c 向け）

- `collections` を上記 8 個で定義
- `home` / `profile` / `site-settings` は `ui.allowedActions: { create: false, delete: false }`
- `services` / `process-steps` / `products` も同様に固定件数、新規作成・削除を封じる
- `works` / `news` は `create: true, delete: true` で自由に
- `works.body` と `news.body` は `type: 'rich-text', isBody: true`
- 日付は `type: 'datetime'`
- 画像は `type: 'image'`
- 並び順は `type: 'number'` で昇順ソート

---

## 武田愛さんへの運用ガイドライン（Phase 5d 作成予定 `EDIT_GUIDE.md` の骨子）

1. **新しい Works を追加する**
   - 管理画面で「事例（WORKS）」→「新規作成」
   - タイトル・日付・カテゴリを埋める
   - カバー画像をアップロード
   - 本文を書く → 保存
2. **新しい お知らせ を追加する**
   - 管理画面で「お知らせ」→「新規作成」→ タイトル・日付・本文で保存
3. **Hero を差し替える**
   - 「トップページ」→ Hero の画像や見出しを編集 → 保存
4. **プロフィールを更新する**
   - 「プロフィール」→ 自己紹介や経歴を編集 → 保存
5. **商品の価格を変更する**
   - 「商品」→ 該当商品を選択 → 価格を更新

---

## 次フェーズで確認したい事項（Phase 5b 着手前）

- [ ] 上記の編集可能項目で過不足ないか（武田愛さん確認）
- [ ] Works カテゴリの選択肢は「空間香／商品香／講演／執筆／その他」で十分か
- [ ] Products の価格・容量は表記ブレがないか（4est.co.jp と合わせる）
- [ ] プロフィールの経歴リストは年表形式でよいか
