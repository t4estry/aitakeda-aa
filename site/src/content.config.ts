/**
 * Astro Content Collections 設定
 * Tina と共有する content/ ディレクトリを loader で参照。
 * docs/TINA_SCHEMA.md の仕様に準拠。
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ========== 単一ドキュメント系（1ファイル固定） ==========

const siteSettings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './content/site' }),
  schema: z.object({
    brandName: z.string(),
    tagline: z.string(),
    legalName: z.string(),
    locationLabel: z.string().optional(),
    contactEmail: z.string(),
    instagramUrl: z.string().nullable(),
    ogpImage: z.string().nullable(),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './content/home' }),
  schema: z.object({
    hero: z.object({
      tagline: z.string(),
      headline: z.string(),
      sub: z.string(),
      backgroundImage: z.string(),
      overlay: z.enum(['none', 'soft', 'strong']).default('soft'),
    }),
    philosophy: z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()),
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
      paragraphs: z.array(z.string()),
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
    portrait: z.string().nullable().optional(),
    portraitNote: z.string().optional(),
    bioParagraphs: z.array(z.string()),
    affiliations: z.array(z.string()).optional(),
    career: z.array(
      z.object({
        year: z.string(),
        text: z.string(),
      })
    ),
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
    cover: z.string(),
    summary: z.string(),
    year: z.string().optional(),
    tags: z.array(z.string()).optional(),
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
    image: z.string(),
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
