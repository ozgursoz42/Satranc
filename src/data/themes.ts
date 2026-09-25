import { Language } from '../utils/i18n';

export interface ChessTheme {
  id: string;
  name: string;
  nameEn?: string;
  tagline: string;
  taglineEn?: string;
  previewColors: [string, string, string, string]; // [lightSquare, darkSquare, whitePiece, blackPiece]
  board: {
    light: string;
    dark: string;
    border: string;
    borderColor: string;
    coordLight: string;
    coordDark: string;
    selectedSquare: string;
    validMoveDot: string;
    captureRing: string;
    checkSquare: string;
    lastMove: string;
  };
  pieces: {
    whiteFill: string;
    whiteFillSecondary: string;
    whiteStroke: string;
    whiteShadow: string;
    blackFill: string;
    blackFillSecondary: string;
    blackStroke: string;
    blackShadow: string;
  };
  ui: {
    cardBg: string;
    accentColor: string;
    badgeBg: string;
    borderStyle: string;
  };
}

export const CHESS_THEMES: ChessTheme[] = [
  {
    id: '3d_royal',
    name: '👑 3D Kraliyet Ahşabı',
    nameEn: '👑 3D Royal Wood',
    tagline: 'Derinlikli 3D ahşap dokusu ve kabartmalı tahta',
    taglineEn: 'Rich 3D woodgrain texture and embossed borders',
    previewColors: ['#FFF8ED', '#85522B', '#FFFFFF', '#1C1917'],
    board: {
      light: 'radial-gradient(circle at 35% 30%, #FFFBF5 0%, #EBD7B8 75%, #D4BE9B 100%)',
      dark: 'radial-gradient(circle at 35% 30%, #9E6B40 0%, #784822 75%, #563013 100%)',
      border: 'linear-gradient(135deg, #4A2814 0%, #2E1609 35%, #6A3E20 65%, #1F0D05 100%)',
      borderColor: '#A0663C',
      coordLight: '#784822',
      coordDark: '#FFFBF5',
      selectedSquare: 'rgba(245, 158, 11, 0.65)',
      validMoveDot: 'rgba(34, 197, 94, 0.9)',
      captureRing: 'rgba(239, 68, 68, 0.9)',
      checkSquare: 'rgba(239, 68, 68, 0.8)',
      lastMove: 'rgba(217, 119, 6, 0.45)',
    },
    pieces: {
      whiteFill: '#FFFFFF',
      whiteFillSecondary: '#F8FAFC',
      whiteStroke: '#1E293B',
      whiteShadow: 'none',
      blackFill: '#111827',
      blackFillSecondary: '#1F2937',
      blackStroke: '#030712',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-amber-950/20 border-amber-800/30',
      accentColor: '#D97706',
      badgeBg: 'bg-amber-500/10 text-amber-900 border-amber-400',
      borderStyle: 'border-amber-800/40',
    },
  },
  {
    id: '3d_crystal',
    name: '💎 3D Kristal & Safir',
    nameEn: '💎 3D Crystal & Sapphire',
    tagline: '3D parlayan safir kareler ve kristal taş yansımaları',
    taglineEn: 'Luminous sapphire squares and crystal highlights',
    previewColors: ['#E0F2FE', '#1E3A8A', '#F8FAFC', '#0B132B'],
    board: {
      light: 'radial-gradient(circle at 35% 30%, #F0F9FF 0%, #BAE6FD 75%, #7DD3FC 100%)',
      dark: 'radial-gradient(circle at 35% 30%, #1E40AF 0%, #172554 75%, #0B132B 100%)',
      border: 'linear-gradient(135deg, #0C1A30 0%, #0369A1 50%, #0284C7 100%)',
      borderColor: '#38BDF8',
      coordLight: '#172554',
      coordDark: '#F0F9FF',
      selectedSquare: 'rgba(56, 189, 248, 0.65)',
      validMoveDot: 'rgba(16, 185, 129, 0.9)',
      captureRing: 'rgba(244, 63, 94, 0.9)',
      checkSquare: 'rgba(239, 68, 68, 0.8)',
      lastMove: 'rgba(14, 165, 233, 0.45)',
    },
    pieces: {
      whiteFill: '#FFFFFF',
      whiteFillSecondary: '#F0F9FF',
      whiteStroke: '#0369A1',
      whiteShadow: 'none',
      blackFill: '#0B132B',
      blackFillSecondary: '#1C2541',
      blackStroke: '#38BDF8',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-sky-950/20 border-sky-800/30',
      accentColor: '#0284C7',
      badgeBg: 'bg-sky-500/10 text-sky-900 border-sky-400',
      borderStyle: 'border-sky-800/40',
    },
  },
  {
    id: 'classic_wood',
    name: 'Klasik Ahşap',
    nameEn: 'Classic Wood',
    tagline: 'Geleneksel turnuva ahşabı & ceviz ağacı',
    taglineEn: 'Traditional tournament walnut & maple board',
    previewColors: ['#F0D9B5', '#B58863', '#FFFBEB', '#382513'],
    board: {
      light: '#F0D9B5',
      dark: '#B58863',
      border: 'linear-gradient(135deg, #5C3D2E 0%, #3B2418 100%)',
      borderColor: '#784E34',
      coordLight: '#B58863',
      coordDark: '#F0D9B5',
      selectedSquare: 'rgba(245, 158, 11, 0.55)',
      validMoveDot: 'rgba(34, 197, 94, 0.85)',
      captureRing: 'rgba(239, 68, 68, 0.85)',
      checkSquare: 'rgba(239, 68, 68, 0.75)',
      lastMove: 'rgba(217, 119, 6, 0.35)',
    },
    pieces: {
      whiteFill: '#FFFFFF',
      whiteFillSecondary: '#F8FAFC',
      whiteStroke: '#334155',
      whiteShadow: 'none',
      blackFill: '#111827',
      blackFillSecondary: '#1F2937',
      blackStroke: '#030712',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-amber-900/10 border-amber-800/20',
      accentColor: '#D97706',
      badgeBg: 'bg-amber-500/10 text-amber-800 border-amber-300',
      borderStyle: 'border-amber-700/30',
    },
  },
  {
    id: 'emerald',
    name: 'Zümrüt Yeşili',
    nameEn: 'Emerald Green',
    tagline: 'Modern şampiyona ve turnuva yeşili',
    taglineEn: 'FIDE standard championship emerald green',
    previewColors: ['#FFFFDD', '#86A666', '#FFFFFF', '#23381B'],
    board: {
      light: '#FFFFDD',
      dark: '#86A666',
      border: 'linear-gradient(135deg, #1B4D2E 0%, #0F2E1B 100%)',
      borderColor: '#2D6A4F',
      coordLight: '#86A666',
      coordDark: '#FFFFDD',
      selectedSquare: 'rgba(250, 204, 21, 0.6)',
      validMoveDot: 'rgba(22, 163, 74, 0.85)',
      captureRing: 'rgba(220, 38, 38, 0.85)',
      checkSquare: 'rgba(239, 68, 68, 0.75)',
      lastMove: 'rgba(234, 179, 8, 0.35)',
    },
    pieces: {
      whiteFill: '#FFFFFF',
      whiteFillSecondary: '#F0FDF4',
      whiteStroke: '#1E3A1E',
      whiteShadow: 'none',
      blackFill: '#1C3119',
      blackFillSecondary: '#2D4E28',
      blackStroke: '#0D1A0B',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-emerald-900/10 border-emerald-800/20',
      accentColor: '#059669',
      badgeBg: 'bg-emerald-500/10 text-emerald-800 border-emerald-300',
      borderStyle: 'border-emerald-700/30',
    },
  },
  {
    id: 'ocean_blue',
    name: 'Gece Mavisi',
    nameEn: 'Midnight Ocean Blue',
    tagline: 'Derin okyanus dalgaları & buz mavisi',
    taglineEn: 'Deep oceanic blues and icy contrasts',
    previewColors: ['#DEE3E6', '#8CA2AD', '#F0F9FF', '#1E293B'],
    board: {
      light: '#DEE3E6',
      dark: '#8CA2AD',
      border: 'linear-gradient(135deg, #0F172A 0%, #020617 100%)',
      borderColor: '#334155',
      coordLight: '#8CA2AD',
      coordDark: '#DEE3E6',
      selectedSquare: 'rgba(56, 189, 248, 0.55)',
      validMoveDot: 'rgba(14, 165, 233, 0.85)',
      captureRing: 'rgba(239, 68, 68, 0.85)',
      checkSquare: 'rgba(239, 68, 68, 0.75)',
      lastMove: 'rgba(56, 189, 248, 0.35)',
    },
    pieces: {
      whiteFill: '#F8FAFC',
      whiteFillSecondary: '#E2E8F0',
      whiteStroke: '#0F172A',
      whiteShadow: 'none',
      blackFill: '#0F172A',
      blackFillSecondary: '#1E293B',
      blackStroke: '#020617',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-slate-900/10 border-slate-800/20',
      accentColor: '#0284C7',
      badgeBg: 'bg-sky-500/10 text-sky-800 border-sky-300',
      borderStyle: 'border-sky-700/30',
    },
  },
  {
    id: 'carbon_dark',
    name: 'Modern Karbon',
    nameEn: 'Modern Carbon Dark',
    tagline: 'Minimalist grafit & platin tonları',
    taglineEn: 'Minimalist dark graphite & platinum accents',
    previewColors: ['#E2E8F0', '#64748B', '#FFFFFF', '#090D16'],
    board: {
      light: '#E2E8F0',
      dark: '#64748B',
      border: 'linear-gradient(135deg, #18181B 0%, #09090B 100%)',
      borderColor: '#27272A',
      coordLight: '#64748B',
      coordDark: '#E2E8F0',
      selectedSquare: 'rgba(250, 204, 21, 0.6)',
      validMoveDot: 'rgba(16, 185, 129, 0.85)',
      captureRing: 'rgba(244, 63, 94, 0.85)',
      checkSquare: 'rgba(239, 68, 68, 0.8)',
      lastMove: 'rgba(251, 191, 36, 0.35)',
    },
    pieces: {
      whiteFill: '#FFFFFF',
      whiteFillSecondary: '#F1F5F9',
      whiteStroke: '#1E293B',
      whiteShadow: 'none',
      blackFill: '#09090B',
      blackFillSecondary: '#18181B',
      blackStroke: '#000000',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-zinc-900/10 border-zinc-800/20',
      accentColor: '#3F3F46',
      badgeBg: 'bg-zinc-500/10 text-zinc-800 border-zinc-300',
      borderStyle: 'border-zinc-700/30',
    },
  },
  {
    id: 'royal_amethyst',
    name: 'Kraliyet Moru',
    nameEn: 'Royal Amethyst',
    tagline: 'Asil ametist & leylak zarafeti',
    taglineEn: 'Noble amethyst & delicate lilac refinement',
    previewColors: ['#F3E8FF', '#A855F7', '#FAF5FF', '#3B0764'],
    board: {
      light: '#F3E8FF',
      dark: '#9333EA',
      border: 'linear-gradient(135deg, #3B0764 0%, #1E0038 100%)',
      borderColor: '#6B21A8',
      coordLight: '#9333EA',
      coordDark: '#F3E8FF',
      selectedSquare: 'rgba(251, 191, 36, 0.6)',
      validMoveDot: 'rgba(168, 85, 247, 0.85)',
      captureRing: 'rgba(244, 63, 94, 0.85)',
      checkSquare: 'rgba(239, 68, 68, 0.75)',
      lastMove: 'rgba(216, 180, 254, 0.4)',
    },
    pieces: {
      whiteFill: '#FAF5FF',
      whiteFillSecondary: '#F3E8FF',
      whiteStroke: '#4C1D95',
      whiteShadow: 'none',
      blackFill: '#2E1065',
      blackFillSecondary: '#4C1D95',
      blackStroke: '#0F0426',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-purple-900/10 border-purple-800/20',
      accentColor: '#9333EA',
      badgeBg: 'bg-purple-500/10 text-purple-800 border-purple-300',
      borderStyle: 'border-purple-700/30',
    },
  },
  {
    id: 'terracotta',
    name: 'Sıcak Toprak',
    nameEn: 'Warm Terracotta',
    tagline: 'Güneşte pişmiş kiremit & altın kum',
    taglineEn: 'Sun-baked terracotta and golden desert sands',
    previewColors: ['#FEF3C7', '#D97706', '#FFFBEB', '#451A03'],
    board: {
      light: '#FEF3C7',
      dark: '#D97706',
      border: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
      borderColor: '#92400E',
      coordLight: '#D97706',
      coordDark: '#FEF3C7',
      selectedSquare: 'rgba(234, 88, 12, 0.6)',
      validMoveDot: 'rgba(22, 163, 74, 0.85)',
      captureRing: 'rgba(220, 38, 38, 0.85)',
      checkSquare: 'rgba(239, 68, 68, 0.8)',
      lastMove: 'rgba(245, 158, 11, 0.4)',
    },
    pieces: {
      whiteFill: '#FFFBEB',
      whiteFillSecondary: '#FEF3C7',
      whiteStroke: '#78350F',
      whiteShadow: 'none',
      blackFill: '#451A03',
      blackFillSecondary: '#78350F',
      blackStroke: '#1C0A00',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-amber-900/10 border-amber-800/20',
      accentColor: '#D97706',
      badgeBg: 'bg-amber-500/10 text-amber-800 border-amber-300',
      borderStyle: 'border-amber-700/30',
    },
  },
  {
    id: 'cyber_neon',
    name: 'Siber Neon',
    nameEn: 'Cyber Neon Matrix',
    tagline: 'Fütüristik neon turkuaz & koyu mat matris',
    taglineEn: 'Futuristic electric cyan & dark matrix grids',
    previewColors: ['#A5F3FC', '#0891B2', '#ECFEFF', '#042F2E'],
    board: {
      light: '#CFFAFE',
      dark: '#0891B2',
      border: 'linear-gradient(135deg, #083344 0%, #02141C 100%)',
      borderColor: '#0E7490',
      coordLight: '#0891B2',
      coordDark: '#CFFAFE',
      selectedSquare: 'rgba(34, 211, 238, 0.6)',
      validMoveDot: 'rgba(45, 212, 191, 0.85)',
      captureRing: 'rgba(244, 63, 94, 0.85)',
      checkSquare: 'rgba(239, 68, 68, 0.85)',
      lastMove: 'rgba(6, 182, 212, 0.4)',
    },
    pieces: {
      whiteFill: '#ECFEFF',
      whiteFillSecondary: '#CFFAFE',
      whiteStroke: '#0E7490',
      whiteShadow: 'none',
      blackFill: '#042F2E',
      blackFillSecondary: '#115E59',
      blackStroke: '#011A19',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-cyan-900/10 border-cyan-800/20',
      accentColor: '#06B6D4',
      badgeBg: 'bg-cyan-500/10 text-cyan-800 border-cyan-300',
      borderStyle: 'border-cyan-700/30',
    },
  },
  {
    id: 'rose_sakura',
    name: 'Gül Kurusu & Sakura',
    nameEn: 'Rose Sakura Blossom',
    tagline: 'Yumuşak pastel pembe & gül yaprağı',
    taglineEn: 'Soft pastel cherry blossom and rose petals',
    previewColors: ['#FFE4E6', '#FB7185', '#FFF1F2', '#4C0519'],
    board: {
      light: '#FFE4E6',
      dark: '#FB7185',
      border: 'linear-gradient(135deg, #881337 0%, #4C0519 100%)',
      borderColor: '#BE123C',
      coordLight: '#FB7185',
      coordDark: '#FFE4E6',
      selectedSquare: 'rgba(244, 63, 94, 0.55)',
      validMoveDot: 'rgba(225, 29, 72, 0.85)',
      captureRing: 'rgba(159, 18, 57, 0.85)',
      checkSquare: 'rgba(239, 68, 68, 0.85)',
      lastMove: 'rgba(251, 113, 133, 0.4)',
    },
    pieces: {
      whiteFill: '#FFF1F2',
      whiteFillSecondary: '#FFE4E6',
      whiteStroke: '#881337',
      whiteShadow: 'none',
      blackFill: '#4C0519',
      blackFillSecondary: '#881337',
      blackStroke: '#200008',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-rose-900/10 border-rose-800/20',
      accentColor: '#E11D48',
      badgeBg: 'bg-rose-500/10 text-rose-800 border-rose-300',
      borderStyle: 'border-rose-700/30',
    },
  },
  {
    id: 'forest_moss',
    name: 'Orman Doğası',
    nameEn: 'Forest Moss & Birch',
    tagline: 'Doğal yosun yeşili & huş ağacı',
    taglineEn: 'Natural woodland moss green and birch bark',
    previewColors: ['#ECFCCB', '#65A30D', '#F7FEE7', '#1A2E05'],
    board: {
      light: '#ECFCCB',
      dark: '#65A30D',
      border: 'linear-gradient(135deg, #365314 0%, #1A2E05 100%)',
      borderColor: '#4D7C0F',
      coordLight: '#65A30D',
      coordDark: '#ECFCCB',
      selectedSquare: 'rgba(234, 179, 8, 0.6)',
      validMoveDot: 'rgba(34, 197, 94, 0.85)',
      captureRing: 'rgba(220, 38, 38, 0.85)',
      checkSquare: 'rgba(239, 68, 68, 0.8)',
      lastMove: 'rgba(163, 230, 53, 0.4)',
    },
    pieces: {
      whiteFill: '#F7FEE7',
      whiteFillSecondary: '#ECFCCB',
      whiteStroke: '#3F6212',
      whiteShadow: 'none',
      blackFill: '#1A2E05',
      blackFillSecondary: '#365314',
      blackStroke: '#0D1702',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-lime-900/10 border-lime-800/20',
      accentColor: '#65A30D',
      badgeBg: 'bg-lime-500/10 text-lime-800 border-lime-300',
      borderStyle: 'border-lime-700/30',
    },
  },
  {
    id: 'obsidian_marble',
    name: 'Mermer & Obsidyen',
    nameEn: 'Marble & Obsidian',
    tagline: 'Yüksek kontrastlı şık monokrom turnuva tahtası',
    taglineEn: 'High contrast sleek monochrome master board',
    previewColors: ['#F1F5F9', '#334155', '#FFFFFF', '#020617'],
    board: {
      light: '#F8FAFC',
      dark: '#475569',
      border: 'linear-gradient(135deg, #0F172A 0%, #020617 100%)',
      borderColor: '#1E293B',
      coordLight: '#475569',
      coordDark: '#F8FAFC',
      selectedSquare: 'rgba(250, 204, 21, 0.6)',
      validMoveDot: 'rgba(59, 130, 246, 0.85)',
      captureRing: 'rgba(239, 68, 68, 0.85)',
      checkSquare: 'rgba(239, 68, 68, 0.85)',
      lastMove: 'rgba(148, 163, 184, 0.4)',
    },
    pieces: {
      whiteFill: '#FFFFFF',
      whiteFillSecondary: '#E2E8F0',
      whiteStroke: '#0F172A',
      whiteShadow: 'none',
      blackFill: '#090D16',
      blackFillSecondary: '#1E293B',
      blackStroke: '#000000',
      blackShadow: 'none',
    },
    ui: {
      cardBg: 'bg-slate-900/10 border-slate-800/20',
      accentColor: '#475569',
      badgeBg: 'bg-slate-500/10 text-slate-800 border-slate-300',
      borderStyle: 'border-slate-700/30',
    },
  },
];

export const getThemeById = (id?: string, lang: Language = 'tr'): ChessTheme => {
  const base = (!id ? CHESS_THEMES[0] : CHESS_THEMES.find((t) => t.id === id)) || CHESS_THEMES[0];
  if (lang === 'en') {
    return {
      ...base,
      name: base.nameEn || base.name,
      tagline: base.taglineEn || base.tagline,
    };
  }
  return base;
};

export const getThemes = (lang: Language = 'tr'): ChessTheme[] => {
  if (lang === 'en') {
    return CHESS_THEMES.map((base) => ({
      ...base,
      name: base.nameEn || base.name,
      tagline: base.taglineEn || base.tagline,
    }));
  }
  return CHESS_THEMES;
};
