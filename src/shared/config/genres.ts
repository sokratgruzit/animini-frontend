/**
 * CRITICAL: These keys must exactly match the Prisma Enum 'Genre'
 */
export const GENRES = {
  CYBERPUNK: 'CYBERPUNK',
  SLICE_OF_LIFE: 'SLICE_OF_LIFE',
  DARK_FANTASY: 'DARK_FANTASY',
  SURREAL: 'SURREAL',
  ACTION_CORE: 'ACTION_CORE',
  SCI_FI: 'SCI_FI',
  MYSTERY: 'MYSTERY',
  DRAMA: 'DRAMA',
  POST_APOCALYPTIC: 'POST_APOCALYPTIC',
  MECHA: 'MECHA',
  LOFI_CHILL: 'LOFI_CHILL',
  EXPERIMENTAL: 'EXPERIMENTAL',
  HORROR: 'HORROR',
  ROMANCE: 'ROMANCE',
  COMEDY: 'COMEDY',
  DYSTOPIAN: 'DYSTOPIAN',
} as const;

export type GenreType = keyof typeof GENRES;

/**
 * UI Metadata for labels and descriptions
 */
export const GENRE_METADATA: Record<
  GenreType,
  { label: string; description: string }
> = {
  [GENRES.CYBERPUNK]: {
    label: 'Cyberpunk',
    description: 'High tech, low life, neon aesthetic',
  },
  [GENRES.SLICE_OF_LIFE]: {
    label: 'Slice of Life',
    description: 'Everyday moments and cozy vibes',
  },
  [GENRES.DARK_FANTASY]: {
    label: 'Dark Fantasy',
    description: 'Grim worlds and supernatural magic',
  },
  [GENRES.SURREAL]: {
    label: 'Surreal',
    description: 'Abstract and psychedelic visuals',
  },
  [GENRES.ACTION_CORE]: {
    label: 'Action Core',
    description: 'High-octane movement and sakuga battles',
  },
  [GENRES.SCI_FI]: {
    label: 'Sci-Fi',
    description: 'Space exploration and futurism',
  },
  [GENRES.MYSTERY]: {
    label: 'Mystery',
    description: 'Suspense and psychological puzzles',
  },
  [GENRES.DRAMA]: {
    label: 'Drama',
    description: 'Emotional character-driven narratives',
  },
  [GENRES.POST_APOCALYPTIC]: {
    label: 'Post-Apocalyptic',
    description: 'Survival in ruined worlds',
  },
  [GENRES.MECHA]: {
    label: 'Mecha',
    description: 'Pilotable robots and industrial design',
  },
  [GENRES.LOFI_CHILL]: {
    label: 'Lofi Chill',
    description: 'Calm, visual-focused atmospheric loops',
  },
  [GENRES.EXPERIMENTAL]: {
    label: 'Experimental',
    description: 'Non-traditional animation techniques',
  },
  [GENRES.HORROR]: {
    label: 'Horror',
    description: 'Disturbing visuals and tension',
  },
  [GENRES.ROMANCE]: {
    label: 'Romance',
    description: 'Poetic visuals of relationships',
  },
  [GENRES.COMEDY]: { label: 'Comedy', description: 'Satire and dark humor' },
  [GENRES.DYSTOPIAN]: {
    label: 'Dystopian',
    description: 'Oppressive future regimes',
  },
};

/**
 * Array format for easy mapping in Selects/Filters
 */
export const GENRE_OPTIONS = Object.keys(GENRES).map((key) => ({
  value: key as GenreType,
  label: GENRE_METADATA[key as GenreType].label,
  description: GENRE_METADATA[key as GenreType].description,
}));
