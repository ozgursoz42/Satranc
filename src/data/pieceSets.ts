import { Language } from '../utils/i18n';

export interface PieceFontSet {
  id: string;
  name: string;
  nameEn?: string;
  tagline: string;
  taglineEn?: string;
  fontFamily: string;
  fontWeight?: string | number;
  badge: string;
  badgeEn?: string;
  description: string;
  descriptionEn?: string;
}

export const PIECE_FONT_SETS: PieceFontSet[] = [
  {
    id: 'standard_serif',
    name: '1. Standart Turnuva',
    nameEn: '1. Standard Tournament',
    tagline: 'Evrensel standart turnuva satranç glifleri',
    taglineEn: 'Universal standard tournament chess glyphs',
    fontFamily: '"DejaVu Sans", "Apple Symbols", "Segoe UI Symbol", "Lucida Grande", serif',
    fontWeight: 'normal',
    badge: '🏆 Turnuva',
    badgeEn: '🏆 Tournament',
    description: 'Tüm cihaz ve ekranlarda en dengeli ve pürüzsüz görünen klasik satranç fontu.',
    descriptionEn: 'The most balanced and smooth classic chess font across all screens.',
  },
  {
    id: 'royal_antique',
    name: '2. Kraliyet Merriweather',
    nameEn: '2. Royal Merriweather',
    tagline: 'Merriweather & Garamond antik kıvrımlar',
    taglineEn: 'Merriweather & Garamond antique curves',
    fontFamily: '"Merriweather", "EB Garamond", "Georgia", serif',
    fontWeight: 'bold',
    badge: '👑 Kraliyet',
    badgeEn: '👑 Royal',
    description: 'Kraliyet saraylarına yakışır asil ve zarif tırnaklı serif hatları.',
    descriptionEn: 'Noble and elegant serif strokes fit for royal chess palaces.',
  },
  {
    id: 'modern_sans',
    name: '3. Modern Sans & Outfit',
    nameEn: '3. Modern Sans & Outfit',
    tagline: 'Minimalist, tırnaksız ve ultra net hatlar',
    taglineEn: 'Minimalist, clean sans-serif geometry',
    fontFamily: '"Outfit", "Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    fontWeight: '700',
    badge: '⚡ Modern',
    badgeEn: '⚡ Modern',
    description: 'Sadeliği ve netliği sevenler için çağdaş minimalist hatlar.',
    descriptionEn: 'Contemporary minimalist lines for clarity and sleek aesthetics.',
  },
  {
    id: 'gothic_medieval',
    name: '4. Gotik & MedievalSharp',
    nameEn: '4. Gothic & MedievalSharp',
    tagline: 'MedievalSharp & Palatino şövalye stili',
    taglineEn: 'Medieval knight and manuscript heritage',
    fontFamily: '"MedievalSharp", "Palatino Linotype", "Book Antiqua", serif',
    fontWeight: 'bold',
    badge: '⚔️ Ortaçağ',
    badgeEn: '⚔️ Medieval',
    description: 'Ortaçağ şövalyelerini ve tarihi satranç taşlarını anımsatan gotik dokunuş.',
    descriptionEn: 'A gothic touch inspired by medieval knights and historic chess sets.',
  },
  {
    id: 'imperial_cinzel',
    name: '5. İmparatorluk Cinzel',
    nameEn: '5. Imperial Cinzel',
    tagline: 'Cinzel & Roma sütunları heybeti',
    taglineEn: 'Cinzel & majestic Roman architecture',
    fontFamily: '"Cinzel", "Times New Roman", "Cambria", serif',
    fontWeight: '800',
    badge: '🏛️ İmparator',
    badgeEn: '🏛️ Imperial',
    description: 'Roma heykeltıraşlığından esinlenen görkemli ve keskin hatlar.',
    descriptionEn: 'Sharp, statuesque lines inspired by classic Roman stone carving.',
  },
  {
    id: 'playfair_luxury',
    name: '6. Playfair Luxury',
    nameEn: '6. Playfair Luxury',
    tagline: 'Playfair Display yüksek kontrastlı lüks glifler',
    taglineEn: 'High contrast luxury typography',
    fontFamily: '"Playfair Display", "Didot", "Bodoni MT", serif',
    fontWeight: 'bold',
    badge: '✨ Lüks',
    badgeEn: '✨ Luxury',
    description: 'İnce hatlı, yüksek kontrastlı ve estetik kaligrafi taş tasarımı.',
    descriptionEn: 'High-contrast, aesthetic calligraphic piece silhouettes.',
  },
  {
    id: 'retro_courier',
    name: '7. Retro Courier Prime',
    nameEn: '7. Retro Courier Prime',
    tagline: 'Courier Prime nostaljik satranç konsolu',
    taglineEn: 'Nostalgic console & mainframe terminal',
    fontFamily: '"Courier Prime", "Courier New", monospace',
    fontWeight: 'bold',
    badge: '📟 Retro',
    badgeEn: '📟 Retro',
    description: 'Eski nesil satranç bilgisayarlarını ve nostaljik konsolları yaşatan stil.',
    descriptionEn: 'Evoking nostalgic early chess computers and vintage consoles.',
  },
  {
    id: 'classic_lora',
    name: '8. Klasik Lora & Garamond',
    nameEn: '8. Classic Lora & Garamond',
    tagline: 'Lora & EB Garamond edebiyat zarafeti',
    taglineEn: 'Literary elegance and balanced proportions',
    fontFamily: '"Lora", "EB Garamond", "Times New Roman", serif',
    fontWeight: 'bold',
    badge: '📜 Edebi',
    badgeEn: '📜 Literary',
    description: 'Kitap baskılarından ilham alan dengeli ve orantılı taş yapısı.',
    descriptionEn: 'Harmonious letterpress-inspired proportions and detailing.',
  },
  {
    id: 'bold_heavy',
    name: '9. Güçlü & Kalın',
    nameEn: '9. Bold & Heavy',
    tagline: 'Arial Black & Trebuchet tok ve belirgin gövde',
    taglineEn: 'Extra heavy, solid and prominent weight',
    fontFamily: '"Arial Black", "Trebuchet MS", Gadget, sans-serif',
    fontWeight: '900',
    badge: '💥 Güçlü',
    badgeEn: '💥 Powerful',
    description: 'Tahtada maksimum ağırlık ve görkem isteyenler için ekstra kalın gövde.',
    descriptionEn: 'Extra bold body for maximum presence and prominence on board.',
  },
  {
    id: 'championship_lucida',
    name: '10. Şampiyona Lucida',
    nameEn: '10. Championship Lucida',
    tagline: 'Lucida Grande & Segoe UI pürüzsüzlük',
    taglineEn: 'Lucida Grande & smooth speed-chess clarity',
    fontFamily: '"Lucida Grande", "Lucida Sans Unicode", "Segoe UI Symbol", sans-serif',
    fontWeight: 'bold',
    badge: '🥇 Şampiyon',
    badgeEn: '🥇 Champion',
    description: 'Hızlı hamlelerde ve yıldırım maçlarında gözü yormayan berrak hatlar.',
    descriptionEn: 'Crystal clear glyphs optimized for rapid and blitz vision.',
  },
  {
    id: 'legend_wood',
    name: '11. Ahşap Oyması',
    nameEn: '11. Handcrafted Wood',
    tagline: 'Century Schoolbook derin oyma hissi',
    taglineEn: 'Traditional carved walnut and boxwood feel',
    fontFamily: '"Century Schoolbook", "Georgia", serif',
    fontWeight: 'bold',
    badge: '🪵 Ahşap',
    badgeEn: '🪵 Woodcraft',
    description: 'El yapımı ceviz ağacından oyulmuş hissi veren geleneksel taş formu.',
    descriptionEn: 'Traditional artisan feel evoking hand-carved wooden tournament sets.',
  },
  {
    id: 'neo_digital',
    name: '12. Neo-Dijital Monospace',
    nameEn: '12. Neo-Digital Monospace',
    tagline: 'SF Mono & Geleceğin sibernetik satrancı',
    taglineEn: 'SF Mono futuristic cybernetic aesthetic',
    fontFamily: '"SF Mono", "Consolas", "Courier Prime", monospace',
    fontWeight: '600',
    badge: '🚀 Siber',
    badgeEn: '🚀 Cyber',
    description: 'Modern dijital satranç platformlarına özel fütüristik görünüm.',
    descriptionEn: 'Futuristic look tailored for next-gen digital chess mastery.',
  },
];

export function getPieceFontSetById(id?: string, lang: Language = 'tr'): PieceFontSet {
  const base = (!id ? PIECE_FONT_SETS[0] : PIECE_FONT_SETS.find((s) => s.id === id)) || PIECE_FONT_SETS[0];
  if (lang === 'en') {
    return {
      ...base,
      name: base.nameEn || base.name,
      tagline: base.taglineEn || base.tagline,
      badge: base.badgeEn || base.badge,
      description: base.descriptionEn || base.description,
    };
  }
  return base;
}

export function getPieceFontSets(lang: Language = 'tr'): PieceFontSet[] {
  if (lang === 'en') {
    return PIECE_FONT_SETS.map((base) => ({
      ...base,
      name: base.nameEn || base.name,
      tagline: base.taglineEn || base.tagline,
      badge: base.badgeEn || base.badge,
      description: base.descriptionEn || base.description,
    }));
  }
  return PIECE_FONT_SETS;
}
