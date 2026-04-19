import { defineConfig } from 'tinacms';

/**
 * TinaCMS スキーマ — docs/TINA_SCHEMA.md に準拠
 * 武田愛さんが全コンテンツを編集できる構成。
 * 表示順は使用頻度順（News → Works → Top → Profile → Products → Services → Process → Site）
 */

// ブランチ自動検出（Cloudflare Pages / Vercel / GitHub Actions / ローカル）
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,

  // Tina Cloud 接続用認証情報（環境変数経由で設定）
  // ローカル: site/.env、本番: Cloudflare Pages の環境変数
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? '',
  token: process.env.TINA_TOKEN ?? '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      // ================= お知らせ =================
      {
        name: 'news',
        label: 'お知らせ（NEWS）',
        path: 'content/news',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'タイトル',
            isTitle: true,
            required: true,
          },
          {
            type: 'datetime',
            name: 'date',
            label: '公開日',
            required: true,
          },
          {
            type: 'rich-text',
            name: 'body',
            label: '本文',
            isBody: true,
          },
        ],
      },

      // ================= 事例 WORKS =================
      {
        name: 'works',
        label: '事例（WORKS）',
        path: 'content/works',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'タイトル',
            isTitle: true,
            required: true,
          },
          {
            type: 'datetime',
            name: 'date',
            label: '公開日',
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: 'カテゴリ',
            required: true,
            options: [
              { value: '空間香', label: '空間香' },
              { value: '商品香', label: '商品香' },
              { value: '講演', label: '講演' },
              { value: '執筆', label: '執筆' },
              { value: 'その他', label: 'その他' },
            ],
          },
          {
            type: 'string',
            name: 'client',
            label: 'クライアント名（任意・匿名表記可）',
          },
          {
            type: 'string',
            name: 'year',
            label: '年（例：2025）',
          },
          {
            type: 'image',
            name: 'cover',
            label: 'カバー画像（縦 4:5 推奨）',
          },
          {
            type: 'string',
            name: 'summary',
            label: '概要（1文・一覧カードに表示）',
            ui: { component: 'textarea' },
            required: true,
          },
          {
            type: 'string',
            name: 'tags',
            label: 'タグ',
            list: true,
          },
          {
            type: 'rich-text',
            name: 'body',
            label: '本文',
            isBody: true,
          },
        ],
      },

      // ================= トップページ =================
      {
        name: 'home',
        label: 'トップページ',
        path: 'content/home',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'object',
            name: 'hero',
            label: 'Hero（最上部）',
            fields: [
              {
                type: 'string',
                name: 'tagline',
                label: 'Hero 英文キャッチ（上）',
                description: '例：AROMATIC DESIGN FROM THE FOREST',
              },
              {
                type: 'string',
                name: 'headline',
                label: 'Hero 和文見出し（大）',
                ui: { component: 'textarea' },
                description: '改行で折り返し可',
              },
              {
                type: 'string',
                name: 'sub',
                label: 'Hero サブテキスト',
                ui: { component: 'textarea' },
              },
              {
                type: 'image',
                name: 'backgroundImage',
                label: 'Hero 背景画像（2000×1200 以上・モノクロ調推奨）',
              },
              {
                type: 'string',
                name: 'overlay',
                label: '画像暗転の強さ',
                options: [
                  { value: 'none', label: 'なし' },
                  { value: 'soft', label: '薄い（推奨）' },
                  { value: 'strong', label: '濃い' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'philosophy',
            label: 'PHILOSOPHY（調香の哲学）',
            fields: [
              {
                type: 'string',
                name: 'heading',
                label: '見出し（和文）',
              },
              {
                type: 'string',
                name: 'paragraphs',
                label: '本文（段落ごとに追加）',
                list: true,
                ui: { component: 'textarea' },
              },
            ],
          },
          {
            type: 'object',
            name: 'service',
            label: 'SERVICE（サービス見出し部）',
            fields: [
              {
                type: 'string',
                name: 'heading',
                label: '見出し',
              },
              {
                type: 'string',
                name: 'number',
                label: '装飾番号（例：05 SERVICES）',
              },
            ],
          },
          {
            type: 'object',
            name: 'process',
            label: 'PROCESS（プロジェクトの進め方 見出し部）',
            fields: [
              {
                type: 'string',
                name: 'heading',
                label: '見出し',
              },
              {
                type: 'string',
                name: 'durationLabel',
                label: '期間ラベル（例：ヒアリングから納品まで 約8週間）',
              },
            ],
          },
          {
            type: 'object',
            name: 'works',
            label: 'WORKS（事例 見出し部）',
            fields: [
              {
                type: 'string',
                name: 'heading',
                label: '見出し',
              },
            ],
          },
          {
            type: 'object',
            name: 'forest',
            label: 'FROM THE FOREST（森林バックボーン）',
            fields: [
              {
                type: 'string',
                name: 'heading',
                label: '見出し（改行可）',
                ui: { component: 'textarea' },
              },
              {
                type: 'string',
                name: 'paragraphs',
                label: '本文（段落ごとに追加）',
                list: true,
                ui: { component: 'textarea' },
              },
              {
                type: 'string',
                name: 'ctaLabel',
                label: 'CTA テキスト',
              },
              {
                type: 'string',
                name: 'ctaUrl',
                label: 'CTA リンク先 URL',
              },
            ],
          },
          {
            type: 'object',
            name: 'products',
            label: 'PRODUCTS（商品 見出し部）',
            fields: [
              {
                type: 'string',
                name: 'heading',
                label: '見出し',
              },
              {
                type: 'string',
                name: 'lead',
                label: 'リード文',
                ui: { component: 'textarea' },
              },
            ],
          },
          {
            type: 'object',
            name: 'news',
            label: 'NEWS（お知らせ 見出し部）',
            fields: [
              {
                type: 'string',
                name: 'heading',
                label: '見出し',
              },
            ],
          },
          {
            type: 'object',
            name: 'contact',
            label: 'CONTACT（問い合わせ 見出し部）',
            fields: [
              {
                type: 'string',
                name: 'heading',
                label: '見出し',
              },
              {
                type: 'string',
                name: 'lead',
                label: 'リード文',
                ui: { component: 'textarea' },
              },
            ],
          },
        ],
      },

      // ================= プロフィール =================
      {
        name: 'profile',
        label: 'プロフィール',
        path: 'content/profile',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'string',
            name: 'name',
            label: '名前（和文）',
            required: true,
          },
          {
            type: 'string',
            name: 'nameEn',
            label: '名前（欧文・大見出し用）',
            required: true,
          },
          {
            type: 'string',
            name: 'jobTitle',
            label: '肩書き',
            required: true,
          },
          {
            type: 'image',
            name: 'portrait',
            label: 'ポートレート画像（縦 3:4 推奨）',
          },
          {
            type: 'string',
            name: 'portraitNote',
            label: '画像キャプション（英文小・任意）',
          },
          {
            type: 'string',
            name: 'bioParagraphs',
            label: '自己紹介文（段落ごとに追加）',
            list: true,
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'affiliations',
            label: '所属リスト（任意）',
            list: true,
          },
          {
            type: 'object',
            name: 'career',
            label: '経歴',
            list: true,
            fields: [
              {
                type: 'string',
                name: 'year',
                label: '年（例：2020）',
              },
              {
                type: 'string',
                name: 'text',
                label: '内容',
              },
            ],
          },
        ],
      },

      // ================= 商品 =================
      {
        name: 'products',
        label: '商品',
        path: 'content/products',
        format: 'mdx',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'number',
            name: 'order',
            label: '並び順（小さい順に表示）',
            required: true,
          },
          {
            type: 'string',
            name: 'name',
            label: '商品名（和文）',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'nameEn',
            label: '英文サブネーム（例：ROOM SPRAY）',
          },
          {
            type: 'image',
            name: 'image',
            label: '商品画像（正方形推奨）',
          },
          {
            type: 'string',
            name: 'volume',
            label: '容量（例：150ml）',
            required: true,
          },
          {
            type: 'string',
            name: 'price',
            label: '価格（例：¥1,980）',
            required: true,
          },
          {
            type: 'string',
            name: 'externalUrl',
            label: '4est ストア URL',
            required: true,
          },
        ],
      },

      // ================= サービス =================
      {
        name: 'services',
        label: 'サービス',
        path: 'content/services',
        format: 'mdx',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'number',
            name: 'order',
            label: '並び順（小さい順に表示）',
            required: true,
          },
          {
            type: 'string',
            name: 'number',
            label: '番号（例：01）',
            required: true,
          },
          {
            type: 'string',
            name: 'labelEn',
            label: '英文ラベル（例：ORIGINAL BLEND FOR BUSINESS）',
            required: true,
          },
          {
            type: 'string',
            name: 'title',
            label: '和文タイトル',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'body',
            label: '本文（1〜3文推奨）',
            ui: { component: 'textarea' },
            required: true,
          },
          {
            type: 'boolean',
            name: 'primary',
            label: '主軸サービス（大きく表示）',
          },
        ],
      },

      // ================= プロセス =================
      {
        name: 'processSteps',
        label: 'プロセス（進め方）',
        path: 'content/process-steps',
        format: 'mdx',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'number',
            name: 'order',
            label: '並び順（小さい順に表示）',
            required: true,
          },
          {
            type: 'string',
            name: 'number',
            label: '番号（例：01）',
            required: true,
          },
          {
            type: 'string',
            name: 'labelEn',
            label: '英文ラベル（例：HEARING）',
            required: true,
          },
          {
            type: 'string',
            name: 'title',
            label: '和文タイトル（例：ヒアリング）',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'body',
            label: '本文',
            ui: { component: 'textarea' },
            required: true,
          },
          {
            type: 'boolean',
            name: 'ongoing',
            label: '納品後フェーズ（STEP 06 用、塗りノード表示）',
          },
        ],
      },

      // ================= サイト基本情報 =================
      {
        name: 'siteSettings',
        label: 'サイト基本情報',
        path: 'content/site',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'string',
            name: 'brandName',
            label: 'ブランド名',
            required: true,
          },
          {
            type: 'string',
            name: 'tagline',
            label: '英文タグライン',
            required: true,
          },
          {
            type: 'string',
            name: 'legalName',
            label: '運営会社名',
            required: true,
          },
          {
            type: 'string',
            name: 'locationLabel',
            label: '所在地ラベル',
          },
          {
            type: 'string',
            name: 'contactEmail',
            label: '問い合わせ受信メール（サイト非表示・フォーム送信先のみ）',
            required: true,
          },
          {
            type: 'string',
            name: 'instagramUrl',
            label: 'Instagram URL（未設定なら非表示）',
          },
          {
            type: 'image',
            name: 'ogpImage',
            label: 'OGP 画像（SNS シェア用 1200×630）',
          },
        ],
      },
    ],
  },
});
