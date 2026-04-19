# PROGRESS.md — AI TAKEDA 特設サイト 進捗ログ

> Claude Code は作業開始時に本ファイルを読み、作業終了時に必ず追記する。
> 「与件を忘れない」ための一次メモリ。セッションごとに現在地を明示。

最終更新：2026-04-18

---

## Now（現在位置）

**Phase 3 シリーズ完了 — Phase 5（Tina 拡張）着手前**

### 現在動作しているページ

| パス | 説明 |
|---|---|
| `/` | Top 長尺ページ（Hero 画像ヒーロー / Philosophy / Profile / Service + ProcessFlow 6ステップ / Works抜粋 / Forest Backbone / Products / News抜粋 / Contact） |
| `/works` | 事例一覧（ヒーロー型ヘッダー + カテゴリ別集計 + グリッド + ENQUIRY CTA） |
| `/works/[slug]` | 事例詳細（70vh 画像ヒーロー + メタストリップ + MDX本文 + 関連 Works 2件 + CTA） |
| `/news` | お知らせ一覧 |
| `/news/[slug]` | お知らせ詳細 |
| `/playground` | コンポーネント検証用（非公開想定） |
| `/admin/index.html` | TinaCMS 編集画面（ローカルモード） |

### 現在のファイル構成

```
site/
├── astro.config.mjs              … Tailwind v4 + MDX 統合
├── package.json                  … dev / dev:tina / build スクリプト
├── public/
│   └── logo/tflogo_bk.png        … 武田林業仮ロゴ
├── content/                      … TinaCMS + Astro 共用コンテンツ
│   ├── home/home.json            … Top の Hero 文言（Tina 管理）
│   ├── news/20260418-launch.mdx  … お知らせ 1件
│   └── works/*.mdx               … 事例 3件
├── tina/
│   └── config.ts                 … Tina スキーマ（home + news のみ・Phase 5 で拡張予定）
└── src/
    ├── config/site.ts            … 屋号・URL・メール・SNS 一元化
    ├── content.config.ts         … Astro Content Collection（works + news）
    ├── layouts/BaseLayout.astro  … 全ページ共通レイアウト + ScentParticles
    ├── styles/
    │   ├── tokens.css            … デザイントークン（カラー/タイポ/ブレークポイント）
    │   └── global.css            … 全体リセット + フォント読み込み
    ├── pages/
    │   ├── index.astro           … Top（content collection から動的に Works/News 取得）
    │   ├── works/index.astro     … Works 一覧
    │   ├── works/[slug].astro    … Works 詳細
    │   ├── news/index.astro      … News 一覧
    │   ├── news/[slug].astro     … News 詳細
    │   └── playground.astro      … コンポーネント確認用
    └── components/
        ├── design/               … デザインシステム（11個）
        │   ├── Nav.astro              … 上部ナビ（overlay モード対応）
        │   ├── Hero.astro             … 背景画像 + オーバーレイ
        │   ├── SectionHeader.astro    … 英文ラベル + 和文見出し
        │   ├── ServiceCard.astro      … サービス紹介カード
        │   ├── ProcessFlow.astro      … 6ステップ フェーズ図
        │   ├── WorkCard.astro         … 事例カード
        │   ├── ProductCard.astro      … 商品カード
        │   ├── Button.astro           … 4バリアント CTA
        │   ├── Carousel.astro         … 水平スライダー（CSS scroll-snap）
        │   ├── ContactForm.astro      … 問い合わせフォーム（UIのみ）
        │   └── Footer.astro           … ダーク基調のフッター
        └── effects/
            └── ScentParticles.astro   … 香りビジュアル化（Canvas）
```

詳細なコンポーネント仕様は `docs/COMPONENTS.md` 参照。

次：**Phase 5（Tina スキーマ本番仕様への拡張）** 着手。サブフェーズに分割して進行。

### Phase 5 進捗

- [x] **Phase 5a**: 全コンテンツタイプのスキーマ設計（`docs/TINA_SCHEMA.md`）完了
- [x] **Phase 5b-1**: content ファイル群の作成完了
  - `content/site/settings.json`（屋号・タグライン・連絡先）
  - `content/home/home.json`（Hero / Philosophy / Forest / Service / Products / Contact 等の全セクションテキスト）
  - `content/profile/profile.json`（名前・経歴・自己紹介・ポートレート）
  - `content/services/*.mdx`（5件：法人調香／空間演出／商品開発／講演／執筆）
  - `content/process-steps/*.mdx`（6件：HEARING → ... → PARTNERSHIP）
  - `content/products/*.mdx`（4件：ANTOKINO HINOKI／cucunoci kuromoji／カードスプレー／ヴィヒタ）
- [x] **Phase 5b-2**: `src/content.config.ts` に8コレクション定義（siteSettings, home, profile, works, news, services, processSteps, products）。zod スキーマで型安全を担保。Astro dev が `Synced content` でエラーなく再同期完了
- [x] **Phase 5b-3**: `src/pages/index.astro` と `src/components/design/Footer.astro` を全面的に content collection 参照に差し替え。ハードコード配列（services 5件、processSteps 6件、products 4件、philosophyParagraphs 3件、careerRecords 4件、Hero/Forest/Contact 等のテキスト）を全て `content/` から動的取得。単一ドキュメントは `getCollection('siteSettings')[0].data` で取得（`getEntry` だと ID 解決に問題があった）。`.astro` キャッシュをクリアして dev サーバー再起動で新コレクションを認識。全セクション（Hero / Philosophy / Profile / Service / ProcessFlow / Works / Forest / Products / News / Contact / Footer）で視覚検証完了
- [x] **Phase 5b-4**: `tina/config.ts` を 8 コレクション構成に拡張（news / works / home / profile / products / services / processSteps / siteSettings）。日本語ラベル・textarea UI・select options・list・image・rich-text など各種 Tina field type を正しく指定。単一ドキュメント系は `allowedActions: { create: false, delete: false }` で新規作成・削除を封じる。Tina GraphQL で全 8 コレクション稼働を確認、admin UI でサービス5件が日本語タイトルで一覧表示されるところまで検証完了。**武田愛さんが TinaCMS 管理画面から全項目を編集できる状態が達成された**
- [x] 2026-04-18 Phase 6 設計変更：Resend → **Google Apps Script（Workspace 相乗効果重視）** に切替決定。詳細は `docs/PHASE_6_APPS_SCRIPT.md` 参照
- [x] 2026-04-19 Phase 6a: Apps Script コード（`.gs` 7ファイル）作成。`site/scripts/apps-script/` 配下
- [x] 2026-04-19 Phase 6b 事前準備: Google Sheets、reCAPTCHA v3 登録、clasp login 完了
- [x] 2026-04-19 Phase 6b デプロイ: `clasp create` → `clasp push` → Script Properties 設定 → Web App 配備。URL: `https://script.google.com/macros/s/AKfycbxT7QY6DdqT4sdkyXOPlkqc7HMDjKBiOvmiR5vAbl4TcRkzudzcYODqs7LyKDO2J6U/exec`。ヘルスチェック成功
- [x] 2026-04-19 屋号（仮）確定：`AITAKEDA Aromatic Architects`（短縮名 `AITAKEDA`）
- [x] 2026-04-19 Phase 6c: `ContactForm.astro` を刷新。reCAPTCHA v3 動的ロード、honeypot field、fetch POST（text/plain で CORS プリフライト回避）、成功/失敗の inline ステータス表示、送信中ボタン制御。`site/src/config/site.ts` に `contactEndpoint` と `recaptchaSiteKey` を一元化
- [x] 2026-04-19 Phase 6c 検証: フォーム DOM 構造（9 inputs + submit）、reCAPTCHA スクリプト動的ロード、grecaptcha.execute() からトークン取得（2169 chars）まで成功。実送信の E2E テストはユーザー手動で実施予定
- [x] 2026-04-19 Phase 6 E2E テスト: 本送信が全通し成功（管理者通知＋自動返信＋スプシ記録）。メール文面調整（reCAPTCHA スコア行削除、送信者宛に所属名冒頭付与、屋号 `AITAKEDA Aromatic Architects` 採用）は `mail.gs` 反映済。`clasp push` + 新バージョンデプロイの UI 手順はユーザー実行
- [x] 2026-04-19 問い合わせログスプシを共有ドライブに移動＋名前を **`AAA_WEB問い合わせログ`** に変更。ID 不変のため Apps Script 側の修正は不要
- [x] 2026-04-19 Phase 7-0: GitHub リポジトリ `t4estry/aitakeda-aa`（Public）作成 + 2コミット push 済
- [x] 2026-04-19 Phase 7-0: Cloudflare Pages プレビューデプロイ成功（`https://aitakeda-aa.pages.dev`、noindex 有効）
- [x] 2026-04-19 Phase 7-0: 本番公開ドメインを `aroma.4est.co.jp`（4est.co.jp のサブドメイン）に決定。お名前.com で DNS 設定、Cloudflare Pages の Custom Domain に追加予定。将来独自ドメインに移行する場合は 301 リダイレクトで SEO 継承
- [x] **Carousel 導入**（Phase 5a中の寄り道）：Works と Products を水平スライダー化
  - `Carousel.astro`（CSS scroll-snap + JS for buttons/counter）
  - Works: モバイル 1枚 + peek ／ md 2枚 ／ **lg 1.25枚**
  - Products: モバイル 1.5枚 ／ md 2.5枚 ／ **lg 2.5枚**
  - モバイル：自然なスワイプスナップ／PC：**サムネイル上にオーバーレイした前後ボタン**＋「01 / 03」カウンタ＋キーボード矢印操作
  - 縦スクロール距離を大きく短縮、離脱リスク低減
  - ボタン位置は `buttonTop` prop で親から制御可（Works 38% / Products 32%）
  - WorkCard に `coverAspect` prop 追加：カルーセル内は **mobile `aspect-[3/4]` portrait / md+ `aspect-[5/4]` landscape** のレスポンシブ切替（スマホでは縦長、PCでは横長）、/works 一覧は `aspect-[4/5]` を維持
- [ ] Phase 5b: ハードコード配列を content 化（services / products / process-steps / profile / site-settings を MDX/JSON に移行）
- [ ] Phase 5c: `tina/config.ts` を 8 コレクション構成に拡張
- [ ] Phase 5d: 編集テスト＋`docs/EDIT_GUIDE.md` 作成
- [ ] Phase 5e: Tina Cloud 接続（Phase 7 と合流可）

---

## Done

- [x] 2026-04-18 参考サイト（flyhyer / ts-aromatique / 4est）の調査完了
- [x] 2026-04-18 既存ビジネス資料（Desktop 配下の香り製品関連 docx/xlsx）の読解
- [x] 2026-04-18 プラン作成・ユーザー承認（`~/.claude/plans/ui-https-www-flyhyer-com-happy-hammock.md`）
- [x] 2026-04-18 プロジェクトディレクトリ作成：`~/Desktop/ai-takeda-site/`
- [x] 2026-04-18 `docs/DESIGN_SPEC.md` 初版
- [x] 2026-04-18 `docs/BRAND.md` 初版
- [x] 2026-04-18 `docs/CONTENT.md` 初版（`[TBD]` 多数あり）
- [x] 2026-04-18 `docs/PROGRESS.md`（本ファイル）初版
- [x] 2026-04-18 Phase 0 の Open Questions 回答反映（Q1/Q4/Q6/Q7/Q11/Q12）
- [x] 2026-04-18 Phase 1a: Astro 6.1 プロジェクト作成（`site/`）
- [x] 2026-04-18 Phase 1a: Tailwind v4 + @tailwindcss/vite 導入
- [x] 2026-04-18 Phase 1a: `@astrojs/mdx` 導入
- [x] 2026-04-18 Phase 1a: `src/config/site.ts` 一元化設定
- [x] 2026-04-18 Phase 1a: `src/styles/tokens.css` でデザイントークン実装
- [x] 2026-04-18 Phase 1a: `src/layouts/BaseLayout.astro`、`src/pages/index.astro` でHero暫定実装
- [x] 2026-04-18 Phase 1a: 武田林業ロゴを `public/logo/tflogo_bk.png` に仮配置
- [x] 2026-04-18 Phase 1a: dev サーバー検証（desktop 1440 / mobile 375 でレンダリング確認）
- [x] 2026-04-18 Phase 1b: `tinacms@3.7.2` + `@tinacms/cli@2.2.2` インストール
- [x] 2026-04-18 Phase 1b: `tina/config.ts` に home（single）・news（collection）の最小スキーマ
- [x] 2026-04-18 Phase 1b: `content/home/home.json`・`content/news/20260418-launch.mdx` 雛形
- [x] 2026-04-18 Phase 1b: `npm run dev:tina` スクリプト追加（tinacms dev -c "astro dev"）
- [x] 2026-04-18 Phase 1b: `/admin/index.html` で home.json 編集フォームの表示確認（日本語ラベル正常）
- [x] 2026-04-18 Phase 2a: 7コンポーネント生成（Nav / Footer / Hero / SectionHeader / ServiceCard / WorkCard / ProductCard）
- [x] 2026-04-18 Phase 2b: `/playground` ページで全コンポーネント一覧表示
- [x] 2026-04-18 Phase 2c: Tailwind v4 ブレークポイント問題を `tokens.css` の `--breakpoint-*` 明示で解決
- [x] 2026-04-18 Phase 2c: desktop 1440 / mobile 375 でレスポンシブ確認
- [x] 2026-04-18 Phase 3a: `Button.astro`（primary/outline/text/ghost）追加
- [x] 2026-04-18 Phase 3a: `ContactForm.astro`（UI のみ、カテゴリ4種ラジオ付き）追加
- [x] 2026-04-18 Phase 3b: `src/pages/index.astro` を 9 セクション構成に刷新
- [x] 2026-04-18 Phase 3b: Forest Backbone セクション（反転配色）実装
- [x] 2026-04-18 Phase 3b: Service に「相談する」CTA、Works に「すべての事例を見る →」、Products に「STORE を見る」CTA を配置
- [x] 2026-04-18 Phase 3c: desktop 1440 / mobile 375 で全セクション検証完了
- [x] 2026-04-18 **flyhyer 風リファイン**：Hero に全面背景画像 + soft overlay、タイトルを text-8xl → text-7xl に縮小
- [x] 2026-04-18 Nav を overlay モード対応（Hero 画像上に透明配置）
- [x] 2026-04-18 カラートークン追加：`paper-alt`（セクション交互用）、`mist`（副次テキスト）
- [x] 2026-04-18 セクション背景にリズム付与：paper ⇄ paper-alt 交互で視線誘導
- [x] 2026-04-18 Button を `rounded-xs`（2px）でわずかに丸め、primary を moss → ink に変更
- [x] 2026-04-18 Footer を `bg-ink text-paper` に統一（dark footer でサイトを引き締め）
- [x] 2026-04-18 `Noto Sans JP` 追加、UI ラベル（dl、経歴リスト等）を sans-serif に部分適用
- [x] 2026-04-18 Nav 項目を 6 → 5 に整理（News を削除、記事蓄積後に復活）
- [x] 2026-04-18 **ProcessFlow.astro** コンポーネント追加（5ステップフロー図）
- [x] 2026-04-18 Service セクションに ProcessFlow を配置（HEARING → CONCEPT → **調香** → REVIEW → DELIVERY）
- [x] 2026-04-18 「調香」のみ専門用語、他は一般的なデザイン業務フロー語彙で統一
- [x] 2026-04-18 ProcessFlow に STEP 06「PARTNERSHIP / 継続伴走」追加（納品後の定期納品＋継続フォロー、香り視点のビジネス伴走）
- [x] 2026-04-18 ProcessFlow を 6 ステップ対応：mobile 1col / tablet md:3col / desktop lg:6col
- [x] 2026-04-18 Step 06 は `ongoing: true` で視覚差別化（paper 背景、番号色を ember→moss）
- [x] 2026-04-18 ProcessFlow を**フェーズデザイン型**に再設計：番号ノード（円）＋コネクトライン
  - PC (lg+): 水平ラインが6つの円ノードを貫通、text は円の下に center 揃え
  - SP/Tablet: 垂直ラインが左側に通り、6つの円が縦に並ぶ。text は円の右側
  - Step 06 は ongoing プロパティで moss 塗りノード、他は paper-alt＋ink 枠ノード
- [x] 2026-04-18 Phase 3d-1: `src/content.config.ts` で works / news コレクション定義（glob loader）
- [x] 2026-04-18 Phase 3d-2: サンプル MDX 投入（Works 3件、News 1件）
- [x] 2026-04-18 Phase 3d-3,4: `/works` 一覧 + `/works/[slug]` 詳細（Hero + MDX body + NEXT CTA）
- [x] 2026-04-18 Phase 3d-5,6: `/news` 一覧 + `/news/[slug]` 詳細
- [x] 2026-04-18 Phase 3d-7: index.astro の works/news を content collection 参照に刷新
- [x] 2026-04-18 Phase 3d-8: 7ルート（/, /works, /works/[slug]×3, /news, /news/[slug]）全 200 OK 確認
- [x] 2026-04-18 **Hero 風なびきスクロールエフェクト**：背景画像がスクロールに応じて右にドリフト + ブラー + フェード
  - テキストはわずかに上昇 + 遅めフェードで主役として残る
  - オーバーレイも連動して薄くなる
  - `requestAnimationFrame` 経由、`prefers-reduced-motion` で完全停止
- [x] 2026-04-18 **Profile レイアウト右寄せ**：ポートレートを PC で viewport 右端までフラッシュ（`md:pr-0` + `col-start-8`）、テキストは左側に配置し左に大きな余白を意図的に作る編集型レイアウトに変更。モバイルは従来通りの縦スタック
- [x] 2026-04-18 Profile 追加調整：`max-w-[1440px]` を外し、広い viewport でも右の auto-margin が出ないよう修正。左 padding を `md:pl-48`（192px、従来の2倍）に拡大。1920px での検証で imgRight=1905=docClientW と完全フラッシュを確認
- [x] 2026-04-18 **Profile 最終修正**：上記方式だと他セクションと左揃えがズレる問題が発覚。`max-w-[1440px] mx-auto px-4 md:px-24` を復元して**他セクションと完全整列**。画像だけ `md:mr-[calc((100vw-min(100vw,1440px))/-2-6rem)]` の負マージンで viewport 右端までブリードアウト。テキスト幅は cols 1-5（narrower）にして画像との間に cols 6-7 の余白を確保（＝左余白が大きい視覚効果）。1280/1440/1920 の3viewport でラベル整列＋右端フラッシュを実測確認
- [x] 2026-04-18 ~~ScentParticles 表現更新（水溶インク放射グラデーション版）~~ → 次項目で分子構造風に再更新
- [x] 2026-04-18 **ScentParticles 表現を分子構造風に変更**：particles.js 風の「点＋近傍間接続線」のネットワーク描画に再設計
  - 近距離（`LINE_DIST = 120px`）の粒同士を細線で接続
  - 線のアルファ = 距離減衰 × 両端の寿命 × `LINE_ALPHA_PEAK`
  - 点は `DOT_ALPHA_PEAK` のソリッド描画
  - カーソル軌跡が分子鎖状に、クリックが分子クラスター状に形成される
  - 「調香＝分子構造の組み合わせ」のメタファーを視覚化
  - モーション・サイズ範囲・粒数上限は全て踏襲（物理挙動は変更なし）
- [x] 2026-04-18 ScentParticles の ambient 生成を無効化（`AMBIENT_RATE = 0`）。カーソル停止中は新規粒を出さず、実際の mousemove/click/touch のみがトリガーに
- [x] 2026-04-18 ScentParticles 密度調整：MAX_PARTICLES 220→130、EMIT_ON_MOVE.count 2→1、EMIT_ON_CLICK.count 28→14、EMIT_ON_TOUCH.count 3→2。アクション・デザインはそのまま、分子表現の密度だけ抑制
- [x] 2026-04-18 **下層ページのflyhyer.com風リファイン**：投稿内容が変わっても崩れない堅牢な構造
  - `/works` 一覧：ヒーロー型ヘッダー（大見出し＋左7/右4の12col分割で説明＋カテゴリ別集計）＋ paper-alt グリッド ＋ 下部 ENQUIRY CTA
  - `/works/[slug]` 詳細：70vh フルワイド画像ヒーロー＋overlay Nav ＋ 4カラムメタストリップ ＋ 780px中央寄せ本文 ＋ 関連 Works（2件）＋ 下部 CTA
  - `/news` 一覧：大きな「お知らせ。」見出し ＋ paper-alt のリスト（→ホバーで矢印スライド）
  - `/news/[slug]` 詳細：シンプルな 780px コラム、日付＋見出し＋本文構成
  - prose-like スタイルを拡張（blockquote / em / a / hr / img / code を追加）してMDX本文の崩れ防止
- [x] 2026-04-18 **ScentParticles エフェクト**追加：「見えない香りをまとう」UI の実装
  - `src/components/effects/ScentParticles.astro`（Canvas + RAF + pointer events）
  - カーソル移動・クリック・タッチ・スワイプで微細な ink 粒が広がり、2〜3秒で消失
  - 暗背景（Hero 画像、Forest、Footer）上では paper 色に自動切替して視認性確保
  - `prefers-reduced-motion` で完全停止、`pointer-events: none` で操作妨げなし
  - MAX_PARTICLES 220 上限、mousemove 35ms throttle で軽量化
  - BaseLayout.astro の1行 import を外すだけで完全に無効化可能な構造

---

## Doing

- [x] ~~Phase 5: Tina スキーマを本番仕様に拡張~~ → 完了（Phase 5a〜5b-4）
- [ ] **Phase 6: Contact フォーム backend（Google Apps Script + Gmail + Sheets + reCAPTCHA v3 構成に設計変更）**。詳細は `docs/PHASE_6_APPS_SCRIPT.md`
- [ ] Phase 4: 実写真・実事例の受領と差し替え
- [ ] Phase 0 docs を武田愛さん本人に校閲依頼（BRAND / CONTENT）

---

## Next（Phase 1 への進行条件）

以下が揃った時点で Phase 1 に進む：

1. [x] ~~Open Questions のうち「師匠/IAPA扱い」「問い合わせ先メール」「SNS有無」「ロゴ有無」の4項が確定~~ → 師匠／メール／ロゴは確定。SNS は Phase 3 で確認に後ろ倒し
2. [ ] CONTENT.md の `[TBD]` のうち Hero／Profile／Service 料金レンジの3箇所が確定（Contactメールは a.takeda@4est.co.jp で確定、サイト非掲載）
3. [x] ~~ドメイン確定~~ → 保留（屋号確定後に検討、site.config.ts に一元化）

---

## Decisions Log（確定した判断、履歴）

| 日付 | 決定 | 根拠 |
|---|---|---|
| 2026-04-18 | Astro 5.x + Tailwind v4 + MDX 採用 | 静的書き出し／MDX／SEOで最適 |
| 2026-04-18 | TinaCMS を編集UIに採用（Canva連携は却下） | Googleスライド相当のWYSIWYG、デザイン崩壊リスク最小 |
| 2026-04-18 | Cloudflare Pages でホスティング | 無料・TTFB速い・Registrar統合 |
| 2026-04-18 | ドメインは独自（ai-takeda.jp 推奨） | 個人ブランド独立、親会社サイトから切り離し |
| 2026-04-18 | 言語は日本語のみ（英語は装飾） | ユーザー確認済 |
| 2026-04-18 | 主軸サービスは「法人向けオリジナル調香」 | ユーザー確認済、TS AROMATIQUE 相当のサブ4本 |
| 2026-04-18 | 物販機能は持たせない／4est.co.jp へ外部送客 | 既存チャネルの役割分担 |
| 2026-04-18 | Phase 0 では DESIGN_SPEC / BRAND / CONTENT / PROGRESS の4本のみ作成（COMPONENTS/EDIT_GUIDE/DEPLOY は各 Phase で作成） | 段階的スコープ管理、トークン節約 |
| 2026-04-18 | 問い合わせ受信先は a.takeda@4est.co.jp（非公開、フォーム送信のみ） | ユーザー確定 |
| 2026-04-18 | ドメインと屋号は保留。site.config.ts に `SITE_URL` と `BRAND_NAME` を一元化し、確定時に1箇所差し替える方針 | 屋号未定につき先行実装を優先 |
| 2026-04-18 | TinaCMS は **local mode で運用**。Tina Cloud は Phase 7 デプロイ時に要否判断（無料枠 1 ユーザーあり） | 開発中はローカル filesystem で十分、クラウド連携は本番運用時に検討 |
| 2026-04-18 | `npm run build` は純 Astro のまま（`build:with-tina` は別途）。Tina Cloud なしでも本番ビルド可能にするため | クラウド未設定での build エラーを回避 |
| 2026-04-18 | Tailwind v4 の `--breakpoint-*` は `@theme` に明示定義が必要（自動継承されないケースあり） | md:/lg: 等のレスポンシブ utilities が生成されず、Nav が崩壊する事象から発見 |
| 2026-04-18 | フォント指定は Tailwind v4 の `font-<name>` ではなく arbitrary value `font-[var(--font-display-jp)]` で統一 | 生成されない場合のフォールバックとして確実な方式 |
| 2026-04-18 | Hero を画像＋テキスト構成に変更（flyhyer.com の主訴求手法を踏襲） | ユーザーのトンマナ要望に対応、imageryで世界観を先に伝える |
| 2026-04-18 | primary ボタン色を ink（黒）に変更、moss はホバー遷移色へ | flyhyer のプライマリCTAのコントラスト強度に合わせる |
| 2026-04-18 | セクション背景を paper ⇄ paper-alt の交互リズムに | 単一背景で間延びするのを防ぎ、flyhyer 的な静かな動きを作る |
| 2026-04-18 | Footer を dark ink 基調に統一 | サイト全体を引き締め、Forest Backbone との連続性を持たせる |

---

## Open Questions（未解決）

| # | 質問 | 必要タイミング | 誰に |
|---|---|---|---|
| ~~Q1~~ | ~~ブランドロゴ~~ → 無。約半年後に制作予定。**当面は武田林業ロゴ（`tflogo_bk.png`）を仮置き**。[アイコンフォルダ](/Users/s.takeda4est.co.jp/Library/CloudStorage/GoogleDrive-s.takeda@4est.co.jp/共有ドライブ/80TAKEDAFORESTRY/81WEBとSNS/icon/) | ✅ 暫定確定 | — |
| Q2 | プロフィール写真の撮影状況。横顔／手元中心の撮影が必要 | Phase 4 着手前 | 武田愛 |
| Q12 | 写真素材（Hero/Philosophy/Works用）の実素材 → **Phase 1-3 はダミー運用、Phase 4 開始時に一括受領の方針で合意**（TinaCMSで後日差し替え可能） | Phase 4 着手前 | 武田愛 |
| Q3 | Works 公開可能な事例（クライアント名・匿名）3〜5件 | Phase 4 着手前 | 武田愛 |
| ~~Q4~~ | ~~問い合わせ受信用メールアドレス~~ → **a.takeda@4est.co.jp**（2026-04-18 確定／サイト非掲載、フォーム送信先のみ） | ✅ 解決 | — |
| Q5 | SNS（Instagram 等）の有無・連携希望 | Phase 3 | 武田愛 |
| ~~Q6~~ | IAPA / TOMOKO SAITO 師匠の扱い → **師匠 記載不可／IAPA 所属記載は可**（2026-04-18 確定） | ✅ 解決 | — |
| Q7 | ドメイン確定（ai-takeda.jp / aitakeda.com / 他） → **保留**。屋号未定のため、屋号確定後に検討 | Phase 7 直前でOK | 武田惇奨 |
| Q11 | 屋号（ブランド名）の確定。現行 docs は仮で "AI TAKEDA" を採用中 | Phase 3 着手前 | 武田愛・惇奨 |
| Q8 | Service 料金レンジの公開可否（¥XXX,XXX〜 表記） | Phase 3 | 武田愛 |
| Q9 | 英語キャッチ `AROMATIC DESIGN FROM THE FOREST` の採用可否 | Phase 3 | 武田愛 |
| Q10 | 会社住所の詳細（愛媛県喜多郡内子町 以降） | Phase 6 | 武田惇奨 |

---

## Blocker（進行を止めている要因）

現時点なし。Phase 1 は上記 Next セクションの条件が揃い次第着手可能。

---

## Changelog（ファイル更新履歴）

- 2026-04-18 PROGRESS.md 初版
- 2026-04-18 DESIGN_SPEC.md / BRAND.md / CONTENT.md 初版
