import React from 'react';
import { Lock, CheckCircle2, Play, ArrowLeft, Star, Volume2, VolumeX } from 'lucide-react';
import { PlayerProfile, LessonModule } from '../../types/game';
import { getChessLessons } from '../../data/chessLessonsData';
import { sound } from '../../utils/sound';
import { ChessPieceSvg } from '../common/ChessPieceSvg';
import { getThemeById } from '../../data/themes';
import { Language, getTranslation } from '../../utils/i18n';

interface LessonsScreenProps {
  profile: PlayerProfile;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onBack: () => void;
  onSelectLesson: (module: LessonModule) => void;
  onStartQuiz: (module: LessonModule) => void;
}

export const LessonsScreen: React.FC<LessonsScreenProps> = ({
  profile,
  soundEnabled = true,
  onToggleSound,
  onBack,
  onSelectLesson,
  onStartQuiz,
}) => {
  const currentLang: Language = profile.language || 'tr';
  const tr = getTranslation(currentLang);
  const lessons = getChessLessons(currentLang);
  const activeTheme = getThemeById(profile.selectedTheme || 'classic_wood', currentLang);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-3 sm:p-6 select-none">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Top Rectangular Control Bar */}
        <div className="flex items-center justify-between bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playTap();
                onBack();
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-800 transition-all cursor-pointer"
              title={tr.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-display font-black text-slate-900">
                {tr.lessonsTitle}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {tr.lessonsSubtitle}
              </p>
            </div>
          </div>

          {/* User Info & Sound Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-display font-bold text-xs shadow-xs">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
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

        {/* Sequential Vertical Pathway */}
        <div className="relative space-y-0 pt-2">
          {lessons.map((mod, index) => {
            const isUnlocked = index <= (profile.unlockedLessonIndex || 0);
            const isCompleted = (profile.unlockedLessonIndex || 0) > index;
            const completedCount = mod.missions.filter(
              (m) => (profile.completedMissions?.[m.id] || 0) > 0
            ).length;
            const progressPercent = Math.round((completedCount / mod.missions.length) * 100);

            return (
              <div key={mod.id} className="relative pb-6 last:pb-0">
                {/* Connecting Dotted Line between modules */}
                {index < lessons.length - 1 && (
                  <div
                    className={`absolute left-8 sm:left-9 top-16 bottom-0 w-0.5 border-l-2 border-dashed z-0 ${
                      isCompleted ? 'border-amber-400' : 'border-slate-300'
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 bg-white border-2 rounded-2xl p-4 sm:p-5 transition-all shadow-xs ${
                    isUnlocked
                      ? 'border-slate-200 hover:border-amber-400 hover:shadow-md'
                      : 'border-slate-200/60 opacity-65 bg-slate-100/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Icon & Info */}
                    <div className="flex items-center gap-4">
                      {/* Step Circle with Icon / Piece */}
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border-2 ${
                          isUnlocked
                            ? isCompleted
                              ? 'bg-amber-100 border-amber-400 text-amber-900'
                              : 'bg-slate-100 border-slate-300 text-slate-800'
                            : 'bg-slate-200 border-slate-300 text-slate-400'
                        }`}
                      >
                        {mod.pieceKey === 'tactics' ? (
                          <span className="text-2xl sm:text-3xl">⚡</span>
                        ) : (
                          <ChessPieceSvg
                            type={mod.pieceKey}
                            color="w"
                            size={44}
                            theme={activeTheme}
                            pieceSet={profile.selectedPieceSet}
                          />
                        )}
                      </div>

                      {/* Module Text Details */}
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {tr.lessonPrefix} {index + 1}
                          </span>
                          {isCompleted && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {tr.completed}
                            </span>
                          )}
                          {!isUnlocked && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">
                              <Lock className="w-3 h-3" />
                              {tr.locked}
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-black text-base sm:text-lg text-slate-900">
                          {mod.name}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md line-clamp-2 mt-0.5">
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions & Progress */}
                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {isUnlocked ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => {
                              sound.playTap();
                              onSelectLesson(mod);
                            }}
                            className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs sm:text-sm rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-slate-950" />
                            <span>{tr.startLessonBtn}</span>
                          </button>

                          {isCompleted && (
                            <button
                              onClick={() => {
                                sound.playTap();
                                onStartQuiz(mod);
                              }}
                              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-display font-bold text-xs rounded-xl border border-slate-300 transition-all cursor-pointer"
                              title={tr.quizBtn}
                            >
                              <span>{tr.quizBtn}</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                          <Lock className="w-4 h-4" />
                          <span>{tr.locked}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar inside Unlocked Card */}
                  {isUnlocked && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-[11px] text-slate-500 font-semibold">
                      <span>{completedCount} / {mod.missions.length} {tr.missionsLabel}</span>
                      <div className="w-28 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
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
