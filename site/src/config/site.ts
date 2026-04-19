/**
 * サイト全体の設定を一元化。
 * 屋号／ドメイン／連絡先のような「後で差し替えたい値」はすべてここへ。
 * 詳細は docs/DESIGN_SPEC.md §9.5 を参照。
 */
export const SITE = {
  // 屋号未定のため暫定。確定時にこの値だけ差し替える。
  brandName: 'AI TAKEDA',
  brandNameEn: 'AI TAKEDA',
  tagline: 'AROMATIC DESIGN FROM THE FOREST',

  // 本番 URL：4est.co.jp のサブドメイン `aroma` として運用
  // （将来的に独自ドメイン移行する場合は 301 リダイレクトで対応）
  url: 'https://aroma.4est.co.jp',

  // 問い合わせフォームの送信先（サイトには非表示）
  contactEmail: 'a.takeda@4est.co.jp',

  // 運営表記
  legalName: '株式会社武田林業 調香部門',
  locationLabel: '愛媛県喜多郡内子町',

  // SNS（未定・Phase 3 で確認）
  social: {
    instagram: null as string | null,
  },

  // 親会社 / 物販送客先
  external: {
    parentSite: 'https://4est.co.jp/',
    storeSite: 'https://4est.co.jp/',
  },

  // Contact フォーム送信先（Apps Script Web App）
  // docs/PHASE_6_APPS_SCRIPT.md 参照
  contactEndpoint:
    'https://script.google.com/macros/s/AKfycbxT7QY6DdqT4sdkyXOPlkqc7HMDjKBiOvmiR5vAbl4TcRkzudzcYODqs7LyKDO2J6U/exec',

  // reCAPTCHA v3 サイトキー（公開用、Git OK）
  recaptchaSiteKey: '6Lcs8r0sAAAAAMQGPnGoftPkZpxw3jDUVjoEDOVx',
} as const;

export type SiteConfig = typeof SITE;
