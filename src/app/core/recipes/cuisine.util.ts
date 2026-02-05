import { Cuisine } from '../../services/recipe-flow.service';

export type CuisineSlug =
  | 'italian'
  | 'german'
  | 'japanese'
  | 'gourmet'
  | 'indian'
  | 'fusion';

export type CuisineHeaderInfo = {
  slug: CuisineSlug;
  label: string;
  emoji: string;
  headerImage: string;
};

export const CUISINE_INFO: Record<CuisineSlug, CuisineHeaderInfo> = {
  italian: {
    slug: 'italian',
    label: 'Italian cuisine',
    emoji: '🍝',
    headerImage: 'assets/img/images/generate_header_italian.png',
  },
  german: {
    slug: 'german',
    label: 'German cuisine',
    emoji: '🥨',
    headerImage: 'assets/img/images/generate_header_german.png',
  },
  japanese: {
    slug: 'japanese',
    label: 'Japanese cuisine',
    emoji: '🥢',
    headerImage: 'assets/img/images/generate_header_japanese.png',
  },
  gourmet: {
    slug: 'gourmet',
    label: 'Gourmet cuisine',
    emoji: '✨',
    headerImage: 'assets/img/images/generate_header_gourmet.png',
  },
  indian: {
    slug: 'indian',
    label: 'Indian cuisine',
    emoji: '🍛',
    headerImage: 'assets/img/images/generate_header_indian.png',
  },
  fusion: {
    slug: 'fusion',
    label: 'Fusion cuisine',
    emoji: '🍽️',
    headerImage: 'assets/img/images/generate_header_fusion.png',
  },
};

export function normalizeCuisineSlug(input: string | null): CuisineSlug {
  const slug = (input ?? 'italian') as CuisineSlug;
  return slug in CUISINE_INFO ? slug : 'fusion';
}

export function slugToCuisine(slug: CuisineSlug): Cuisine {
  const map: Record<CuisineSlug, Cuisine> = {
    italian: 'Italian',
    german: 'German',
    japanese: 'Japanese',
    gourmet: 'Gourmet',
    indian: 'Indian',
    fusion: 'Fusion',
  };
  return map[slug] ?? 'Fusion';
}
