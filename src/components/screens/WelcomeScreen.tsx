import React from 'react';
import {
  Settings,
  Swords,
  BookOpen,
  Star,
  GraduationCap,
  Trophy,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { PlayerProfile, ScreenType } from '../../types/game';
import { AVATAR_LIST } from '../../utils/storage';
import { sound } from '../../utils/sound';
import { ChessPieceSvg } from '../common/ChessPieceSvg';
import { getThemeById } from '../../data/themes';
import { Language, getTranslation } from '../../utils/i18n';

interface WelcomeScreenProps {
  profile: PlayerProfile;
  hasSavedGame: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  profile,
  onNavigate,
}) => {
  const currentLang: Language = profile.language || 'tr';
  const tr = getTranslation(currentLang);

  const avatarObj = AVATAR_LIST.find((a) => a.id === profile.avatar) || AVATAR_LIST[0];
  const activeTheme = getThemeById(profile.selectedTheme || 'classic_wood', currentLang);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-amber-50/70 via-white to-slate-100 select-none text-slate-800">
      <div className="relative z-10 max-w-xl w-full text-center flex flex-col items-center">
        {/* Main Chess Emblem */}
        <div className="relative mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 p-1 shadow-xl shadow-amber-500/20 flex items-center justify-center border-2 border-white">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center shadow-inner">
              <ChessPieceSvg type="n" color="b" size={64} theme={activeTheme} pieceSet={profile.selectedPieceSet} />
            </div>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="mb-5">
          <h1 className="text-4xl sm:text-6xl font-display font-black text-slate-900 tracking-tight">
            {currentLang === 'en' ? 'CHESS' : 'SATRANÇ'}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 font-display mt-1.5 max-w-md mx-auto">
            {tr.welcomeTagline}
          </p>
        </div>

        {/* Interactive Active Player Card */}
        <button
          onClick={() => {
            sound.playTap();
            onNavigate('PROFILE_SETUP');
          }}
          className="group bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-amber-400 rounded-2xl p-3.5 mb-5 flex items-center justify-between w-full max-w-md shadow-xs hover:shadow-md transition-all cursor-pointer text-left"
          title="Profile Menu"
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${avatarObj.color} flex items-center justify-center text-2xl shadow-inner border border-white group-hover:scale-105 transition-transform`}
            >
              {avatarObj.emoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentLang === 'en' ? 'Active Player (Switch)' : 'Aktif Oyuncu (Değiştir)'}</span>
              </div>
              <div className="font-display font-black text-base text-slate-900 flex items-center gap-1.5">
                <span>{profile.name}</span>
                <span className="text-xs font-normal text-slate-400 group-hover:text-amber-600 transition-colors">
                  ✎
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-display font-bold text-xs shadow-xs">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{profile.stars} {tr.stars}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-3">
          {/* 1. PLAY CHESS BUTTON */}
          <button
            onClick={() => {
              sound.playTap();
              onNavigate('ARENA');
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-black text-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer border border-amber-400/50"
          >
            <Swords className="w-6 h-6" />
            <span>{tr.btnPlayChess}</span>
          </button>

          {/* 2. LEARN CHESS BUTTON */}
          <button
            onClick={() => {
              sound.playTap();
              onNavigate('LESSONS');
            }}
            className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-display font-black text-xl shadow-md border-2 border-slate-200 hover:border-amber-400 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <GraduationCap className="w-6 h-6 text-amber-600" />
            <span>{tr.btnLearnChess}</span>
          </button>

          {/* Secondary Hub Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {/* Piece Encyclopedia */}
            <button
              onClick={() => {
                sound.playTap();
                onNavigate('PIECES');
              }}
              className="py-3 px-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-display font-bold text-xs border border-slate-200 shadow-xs active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>{tr.btnPiecesGuide}</span>
            </button>

            {/* Achievements */}
            <button
              onClick={() => {
                sound.playTap();
                onNavigate('ACHIEVEMENTS');
              }}
              className="py-3 px-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-display font-bold text-xs border border-slate-200 shadow-xs active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>{tr.btnAchievements}</span>
            </button>

            {/* Settings & Themes */}
            <button
              onClick={() => {
                sound.playTap();
                onNavigate('SETTINGS');
              }}
              className="py-3 px-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-display font-bold text-xs border border-slate-200 shadow-xs active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-700" />
              <span>{tr.btnSettings}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
