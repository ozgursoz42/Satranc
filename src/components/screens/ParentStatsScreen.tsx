import React from 'react';
import { ArrowLeft, Star, Award, TrendingUp, Swords, Volume2, VolumeX } from 'lucide-react';
import { PlayerProfile, ScreenType } from '../../types/game';
import { getChessLessons } from '../../data/chessLessonsData';
import { loadStats, AVATAR_LIST } from '../../utils/storage';
import { sound } from '../../utils/sound';
import { Language, getTranslation } from '../../utils/i18n';

interface ParentStatsScreenProps {
  profile: PlayerProfile;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ParentStatsScreen: React.FC<ParentStatsScreenProps> = ({
  profile,
  soundEnabled = true,
  onToggleSound,
  onBack,
}) => {
  const currentLang: Language = profile.language || 'tr';
  const tr = getTranslation(currentLang);
  const lessons = getChessLessons(currentLang);
  const stats = loadStats();
  const avatarObj = AVATAR_LIST.find((a) => a.id === profile.avatar) || AVATAR_LIST[0];

  const moduleProgress = lessons.map((mod) => {
    const totalMissions = mod.missions.length + 1;
    let done = 0;
    mod.missions.forEach((m) => {
      if ((profile.completedMissions || {})[m.id]) done++;
    });
    if ((profile.completedMissions || {})[`${mod.id}_quiz`]) done++;
    const pct = Math.round((done / totalMissions) * 100);

    return {
      name: mod.name,
      icon: mod.icon,
      pct,
      isCompleted: pct === 100,
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-3 sm:p-6 select-none">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header Card */}
        <div className="flex items-center justify-between bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playTap();
                onBack();
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 transition-all cursor-pointer shadow-xs"
              title={tr.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-display font-black text-slate-900">
                {tr.statsTitle}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {tr.statsSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="hidden xs:flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-xl font-display font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{profile.stars} {tr.stars}</span>
            </div>

            {onToggleSound && (
              <button
                onClick={() => {
                  sound.playTap();
                  onToggleSound();
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  soundEnabled
                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                }`}
                title={soundEnabled ? 'Mute' : 'Unmute'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Player Profile Summary Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${avatarObj.color} text-white flex items-center justify-center text-3xl shadow-inner border border-white`}>
              {avatarObj.emoji}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
                {currentLang === 'en' ? 'Player Profile' : 'Oyuncu Profili'}
              </div>
              <h3 className="text-2xl font-display font-black text-slate-900">
                {profile.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentLang === 'en' ? 'Joined: ' : 'Başlangıç: '}{new Date(profile.createdAt).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'tr-TR')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-amber-700 font-black text-lg font-mono">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{profile.stars}</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{tr.stars}</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-black text-lg font-mono">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{(profile.unlockedBadges || []).length}</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{currentLang === 'en' ? 'Badges' : 'Rozet'}</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-sky-700 font-black text-lg font-mono">
                <Swords className="w-4 h-4 text-sky-600" />
                <span>{stats.gamesPlayed}</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{currentLang === 'en' ? 'Matches' : 'Maç'}</div>
            </div>
          </div>
        </div>

        {/* Detailed Module Mastery Progress */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-display font-bold text-base">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span>{tr.performanceTitle}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {moduleProgress.map((mod) => (
              <div
                key={mod.name}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 text-slate-900">
                    <span>{mod.icon}</span>
                    <span>{mod.name}</span>
                  </div>
                  <span className={mod.isCompleted ? 'text-emerald-700 font-black' : 'text-amber-700 font-black'}>
                    {mod.pct}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      mod.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${mod.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Match Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
            <div className="text-2xl font-black text-emerald-700 font-mono">{stats.gamesWon}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{currentLang === 'en' ? 'Matches Won' : 'Kazanılan Maç'}</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
            <div className="text-2xl font-black text-rose-700 font-mono">{stats.gamesLost}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{currentLang === 'en' ? 'Matches Lost' : 'Kaybedilen Maç'}</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
            <div className="text-2xl font-black text-sky-700 font-mono">{stats.gamesDrawn}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{currentLang === 'en' ? 'Draws' : 'Berabere'}</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
            <div className="text-2xl font-black text-amber-700 font-mono">{stats.totalHintsUsed}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{currentLang === 'en' ? 'Hints Used' : 'Kullanılan İpucu'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
