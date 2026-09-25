import { PlayerProfile, GameSettings, GameStats, DailyQuest } from '../types/game';

const STORAGE_KEY_PROFILES = 'satranc_profiles_v2';
const STORAGE_KEY_ACTIVE_PROFILE_ID = 'satranc_active_profile_id_v2';
const STORAGE_KEY_SETTINGS = 'satranc_settings_v2';
const STORAGE_KEY_STATS = 'satranc_stats_v2';

export const AVATAR_LIST = [
  { id: 'grandmaster', emoji: '🧙‍♂️', label: 'Büyük Usta', labelEn: 'Grandmaster', color: 'from-amber-400 to-orange-500' },
  { id: 'knight_hero', emoji: '🛡️', label: 'Satranç Şövalyesi', labelEn: 'Chess Knight', color: 'from-sky-400 to-blue-500' },
  { id: 'tactician', emoji: '🦉', label: 'Bilge Baykuş', labelEn: 'Wise Owl', color: 'from-indigo-400 to-purple-500' },
  { id: 'champion', emoji: '👑', label: 'Kraliyet Şampiyonu', labelEn: 'Royal Champion', color: 'from-yellow-400 to-amber-600' },
  { id: 'scout', emoji: '🧒', label: 'Genç Usta', labelEn: 'Young Prodigy', color: 'from-emerald-400 to-teal-500' },
  { id: 'lightning', emoji: '⚡', label: 'Yıldırım Taktisyeni', labelEn: 'Blitz Tactician', color: 'from-pink-400 to-rose-500' },
  { id: 'dragon', emoji: '🐉', label: 'Ejderha Açılışı', labelEn: 'Dragon Master', color: 'from-red-400 to-rose-600' },
  { id: 'robot', emoji: '🤖', label: 'Yapay Zeka', labelEn: 'AI Bot', color: 'from-cyan-400 to-blue-600' },
];

export const DEFAULT_SETTINGS: GameSettings = {
  language: 'tr',
  soundEnabled: true,
  musicEnabled: true,
  voiceEnabled: true,
  animationsEnabled: true,
  boardTheme: 'classic_wood',
  highlightMoves: true,
  showCoordinates: true,
  autoQueen: true,
};

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  gamesDrawn: 0,
  totalMovesMade: 0,
  totalPuzzlesSolved: 0,
  totalHintsUsed: 0,
};

export const INITIAL_PROFILE: PlayerProfile = {
  id: 'player_default',
  name: 'Genç Usta',
  avatar: 'grandmaster',
  title: 'Satranç Çırağı',
  stars: 0,
  selectedTheme: 'classic_wood',
  unlockedLessonIndex: 0, // First lesson unlocked
  lessonProgress: {
    pawn: 0,
    knight: 0,
    bishop: 0,
    rook: 0,
    queen: 0,
    king: 0,
    tactics: 0,
  },
  completedMissions: {},
  unlockedBadges: [],
  createdAt: Date.now(),
};

// Storage Helpers
export function loadProfiles(): PlayerProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveProfiles(profiles: PlayerProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profiles:', e);
  }
}

export function getActiveProfileId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE_ID);
  } catch (e) {
    return null;
  }
}

export function setActiveProfileId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PROFILE_ID, id);
  } catch (e) {}
}

export function getActiveProfile(): PlayerProfile {
  const profiles = loadProfiles();
  const activeId = getActiveProfileId();
  if (profiles.length === 0) {
    return INITIAL_PROFILE;
  }
  const found = profiles.find((p) => p.id === activeId);
  return found || profiles[0];
}

export function saveActiveProfile(profile: PlayerProfile): void {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  saveProfiles(profiles);
  setActiveProfileId(profile.id);
}

export function createNewProfile(name: string, avatar: string): PlayerProfile {
  const newProfile: PlayerProfile = {
    ...INITIAL_PROFILE,
    id: 'profile_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: name.trim() || 'Satranç Sever',
    avatar: avatar || 'grandmaster',
    createdAt: Date.now(),
  };
  const profiles = loadProfiles();
  profiles.push(newProfile);
  saveProfiles(profiles);
  setActiveProfileId(newProfile.id);
  return newProfile;
}

export function deleteProfile(id: string): void {
  let profiles = loadProfiles();
  profiles = profiles.filter((p) => p.id !== id);
  saveProfiles(profiles);
  if (getActiveProfileId() === id) {
    if (profiles.length > 0) {
      setActiveProfileId(profiles[0].id);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_PROFILE_ID);
    }
  }
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {}
}

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch (e) {}
}

export function updateStats(updater: (prev: GameStats) => GameStats): GameStats {
  const current = loadStats();
  const next = updater(current);
  saveStats(next);
  return next;
}

export function getTodayQuest(): DailyQuest {
  const todayStr = new Date().toISOString().slice(0, 10);
  const active = getActiveProfile();
  const isClaimed = active.lastDailyQuestDate === todayStr && !!active.dailyQuestClaimed;

  return {
    id: 'quest_' + todayStr,
    title: 'Günün Satranç Görevi',
    description: 'Bugün 5 doğru hamle veya soru tamamla!',
    targetCount: 5,
    currentCount: isClaimed ? 5 : Math.min(5, Object.keys(active.completedMissions || {}).length % 5),
    rewardStars: 25,
    isClaimed,
  };
}

export function claimDailyQuest(): { success: boolean; starsAdded: number } {
  const todayStr = new Date().toISOString().slice(0, 10);
  const active = getActiveProfile();
  if (active.lastDailyQuestDate === todayStr && active.dailyQuestClaimed) {
    return { success: false, starsAdded: 0 };
  }
  active.lastDailyQuestDate = todayStr;
  active.dailyQuestClaimed = true;
  active.stars = (active.stars || 0) + 25;
  saveActiveProfile(active);
  return { success: true, starsAdded: 25 };
}

export function resetAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PROFILES);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_PROFILE_ID);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_STATS);
  } catch (e) {}
}
