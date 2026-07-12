export const OG_IMAGE = '/images/qedit-og.png';

export const OG_DEFAULTS = {
  locale: 'en_US',
  type: 'website' as const,
  siteName: 'QEDIT',
  images: [OG_IMAGE],
};

export const TWITTER_DEFAULTS = {
  card: 'summary_large_image' as const,
  images: [OG_IMAGE],
};