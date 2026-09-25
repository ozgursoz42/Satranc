import React from 'react';
import { ArrowLeft, Award, Lock, CheckCircle2, Star, Volume2, VolumeX } from 'lucide-react';
import { PlayerProfile, ScreenType } from '../../types/game';
import { getBadges } from '../../data/chessLessonsData';
import { sound } from '../../utils/sound';
import { Language, getTranslation } from '../../utils/i18n';

interface AchievementsScreenProps {
  profile: PlayerProfile;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  profile,
  soundEnabled = true,
  onToggleSound,
  onBack,
}) => {
  const currentLang: Language = profile.language || 'tr';
  const tr = getTranslation(currentLang);
  const badgesList = getBadges(currentLang);

  const unlockedCount = (profile.unlockedBadges || []).length;
  const totalBadges = badgesList.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-3 sm:p-6 select-none">
      <div className="max-w-5xl mx-auto space-y-4">
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
                {tr.achievementsTitle}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {tr.achievementsSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl font-display font-bold text-xs shadow-xs">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{unlockedCount} / {totalBadges} {tr.badgesCount}</span>
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

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {badgesList.map((badge) => {
            const isUnlocked = (profile.unlockedBadges || []).includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col items-center text-center justify-between ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-sm hover:shadow-md'
                    : 'bg-slate-100/70 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner border ${
                      isUnlocked
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'bg-slate-200 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? badge.icon : <Lock className="w-6 h-6" />}
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 leading-tight">
                    {badge.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="w-full pt-3 border-t border-slate-100">
                  {isUnlocked ? (
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{tr.badgeUnlockedStatus}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 font-semibold bg-slate-200/80 py-1 px-2.5 rounded-lg">
                      🔒 {badge.requirement}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
