export type CuisineSlug =
  | 'italian'
  | 'german'
  | 'japanese'
  | 'gourmet'
  | 'indian'
  | 'fusion';

export type CuisineCard = {
  slug: CuisineSlug;
  label: string;
  subtitle: string;
  image: string;
  emoji: string;
};

export const CUISINE_CARDS: CuisineCard[] = [
  {
    slug: 'italian',
    label: 'Italian cuisine',
    subtitle: 'Pasta, pizza & dolce vita',
    image: 'assets/img/images/italien_card.png',
    emoji: '🍝',
  },
  {
    slug: 'german',
    label: 'German cuisine',
    subtitle: 'Hearty comfort food',
    image: 'assets/img/images/german_card.png',
    emoji: '🥨',
  },
  {
    slug: 'japanese',
    label: 'Japanese cuisine',
    subtitle: 'Sushi, ramen & more',
    image: 'assets/img/images/japanese_card.png',
    emoji: '🥢',
  },
  {
    slug: 'gourmet',
    label: 'Gourmet cuisine',
    subtitle: 'Fine dining at home',
    image: 'assets/img/images/gourmet_card.png',
    emoji: '✨',
  },
  {
    slug: 'indian',
    label: 'Indian cuisine',
    subtitle: 'Spices & vibrant flavours',
    image: 'assets/img/images/indian_card.png',
    emoji: '🍛',
  },
  {
    slug: 'fusion',
    label: 'Fusion cuisine',
    subtitle: 'Creative & playful mixes',
    image: 'assets/img/images/fusion_card.png',
    emoji: '🍽️',
  },
];
