/**
 * Astro Content Collections 設定
 * Tina と共有する content/ ディレクトリを loader で参照。
 * docs/TINA_SCHEMA.md の仕様に準拠。
 *
 * 設計方針（再発防止のため 2026-05-09 に強化）:
 * 1. 画像/URL フィールドは sanitizeImageUrl で `/imageshttp...` バグを自動補正
 *    （Tina admin の画像入力 UI が外部 URL に "/images" を勝手に prepend する事象への対処）
 * 2. 配列・オプショナル要素は default([]) / .optional() で
 *    Tina で「全削除」されても build が落ちないようにする
 * 3. ネストオブジェクトは required を維持（構造ごと消えるリスクは低い）
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ========== ヘルパー ==========

/**
 * Tina の画像入力 UI が外部 URL の頭に "/images" を勝手に付けることがあるため、
 * "/imageshttp..." または "/imageshttps..." の形式を検知して補正する。
 * 通常の "/images/local-file.jpg" 形式（ローカルアップロード）はそのまま通す。
 */
const sanitizeImageUrl = (v: string | null | undefined): string | null | undefined => {
  if (!v) return v;
  if (v.startsWith('/imageshttp://') || v.startsWith('/imageshttps://')) {
    return v.slice('/images'.length);
  }
  return v;
};

/** 画像 URL: 必須 */
const imageUrl = z.string().transform(sanitizeImageUrl).pipe(z.string());

/** 画像 URL: 任意（null/undefined OK） */
const imageUrlNullable = z
  .string()
  .nullable()
  .optional()
  .transform(sanitizeImageUrl);

// ========== 単一ドキュメント系（1ファイル固定） ==========

const siteSettings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './content/site' }),
  schema: z.object({
    brandName: z.string(),
    tagline: z.string(),
    legalName: z.string(),
    locationLabel: z.string().optional(),
    contactEmail: z.string(),
    instagramUrl: z.string().nullable().optional(),
    ogpImage: imageUrlNullable,
  }),
});

const home = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './content/home' }),
  schema: z.object({
    hero: z.object({
      tagline: z.string(),
      headline: z.string(),
      sub: z.string(),
      backgroundImage: imageUrl,
      overlay: z.enum(['none', 'soft', 'strong']).default('soft'),
    }),
    philosophy: z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()).optional().default([]),
    }),
    service: z.object({
      heading: z.string(),
      number: z.string().optional(),
    }),
    process: z.object({
      heading: z.string(),
      durationLabel: z.string().optional(),
    }),
    works: z.object({
      heading: z.string(),
    }),
    forest: z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()).optional().default([]),
      ctaLabel: z.string().optional(),
      ctaUrl: z.string().optional(),
    }),
    products: z.object({
      heading: z.string(),
      lead: z.string(),
    }),
    news: z.object({
      heading: z.string(),
    }),
    contact: z.object({
      heading: z.string(),
      lead: z.string(),
    }),
  }),
});

const profile = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './content/profile' }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string(),
    jobTitle: z.string(),
    portrait: imageUrlNullable,
    portraitNote: z.string().optional(),
    bioParagraphs: z.array(z.string()).optional().default([]),
    affiliations: z.array(z.string()).optional().default([]),
    career: z
      .array(
        z.object({
          year: z.string(),
          text: z.string(),
        })
      )
      .optional()
      .default([]),
  }),
});

// ========== コレクション系（複数アイテム） ==========

const works = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/works' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    client: z.string().optional(),
    category: z.enum(['空間香', '商品香', '講演', '執筆', 'その他']),
    cover: imageUrl,
    summary: z.string(),
    year: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/services' }),
  schema: z.object({
    order: z.number(),
    number: z.string(),
    labelEn: z.string(),
    title: z.string(),
    body: z.string(),
    primary: z.boolean().default(false),
  }),
});

const processSteps = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/process-steps' }),
  schema: z.object({
    order: z.number(),
    number: z.string(),
    labelEn: z.string(),
    title: z.string(),
    body: z.string(),
    ongoing: z.boolean().default(false),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/products' }),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    nameEn: z.string().optional(),
    image: imageUrl,
    volume: z.string(),
    price: z.string(),
    externalUrl: z.string(),
  }),
});

export const collections = {
  siteSettings,
  home,
  profile,
  works,
  news,
  services,
  processSteps,
  products,
};
