import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Palette,
  User,
  Check,
  Eye,
  Trash2,
  ArrowLeft,
  Save,
  Sparkles,
  Star,
  Type,
  Globe,
} from 'lucide-react';
import { GameSettings, PlayerProfile, ScreenType, PieceType } from '../../types/game';
import { getThemes, getThemeById } from '../../data/themes';
import { getPieceFontSets, getPieceFontSetById } from '../../data/pieceSets';
import { AVATAR_LIST, saveActiveProfile, saveSettings } from '../../utils/storage';
import { sound } from '../../utils/sound';
import { ChessPieceSvg } from '../common/ChessPieceSvg';
import { Language, t, getTranslation } from '../../utils/i18n';

interface SettingsScreenProps {
  settings: GameSettings;
  profile: PlayerProfile;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onUpdateProfile: (newProfile: PlayerProfile) => void;
  onNavigate: (screen: ScreenType) => void;
  onResetAllData: () => void;
}

const PREVIEW_PIECES: PieceType[] = ['p', 'n', 'b', 'r', 'q', 'k'];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  profile,
  soundEnabled = true,
  onToggleSound,
  onUpdateSettings,
  onUpdateProfile,
  onNavigate,
  onResetAllData,
}) => {
  const currentLang: Language = settings.language || profile.language || 'tr';
  const tr = getTranslation(currentLang);

  const [activeTab, setActiveTab] = useState<'language' | 'themes' | 'pieceSets' | 'profile' | 'audio' | 'gameplay'>('language');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Profile Edit In-Place State
  const [editName, setEditName] = useState(profile.name);
  const [editAvatar, setEditAvatar] = useState(profile.avatar || 'grandmaster');
  const [saveFeedback, setSaveFeedback] = useState(false);

  const activeThemeId = profile.selectedTheme || settings.boardTheme || 'classic_wood';
  const activeTheme = getThemeById(activeThemeId, currentLang);
  const activePieceSetId = profile.selectedPieceSet || 'standard_serif';
  const activePieceSet = getPieceFontSetById(activePieceSetId, currentLang);

  const themesList = getThemes(currentLang);
  const pieceSetsList = getPieceFontSets(currentLang);

  const handleSelectLanguage = (lang: Language) => {
    sound.playStar();
    const updatedSettings: GameSettings = { ...settings, language: lang };
    const updatedProfile: PlayerProfile = { ...profile, language: lang };
    onUpdateSettings(updatedSettings);
    onUpdateProfile(updatedProfile);
    saveSettings(updatedSettings);
    saveActiveProfile(updatedProfile);
  };

  const handleSelectTheme = (themeId: string) => {
    sound.playMove();
    const updatedSettings = { ...settings, boardTheme: themeId };
    const updatedProfile = { ...profile, selectedTheme: themeId };
    onUpdateSettings(updatedSettings);
    onUpdateProfile(updatedProfile);
    saveSettings(updatedSettings);
    saveActiveProfile(updatedProfile);
  };

  const handleSelectPieceSet = (setId: string) => {
    sound.playMove();
    const updatedProfile = { ...profile, selectedPieceSet: setId };
    onUpdateProfile(updatedProfile);
    saveActiveProfile(updatedProfile);
  };

  const handleSaveProfileChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    sound.playStar();
    const updatedProfile: PlayerProfile = {
      ...profile,
      name: editName.trim(),
      avatar: editAvatar,
    };
    onUpdateProfile(updatedProfile);
    saveActiveProfile(updatedProfile);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-3 sm:p-6 select-none">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header Card */}
        <div className="flex items-center justify-between bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playTap();
                onNavigate('WELCOME');
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 transition-all cursor-pointer shadow-xs"
              title={tr.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-display font-black text-slate-900">
                {tr.settingsTitle}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {tr.settingsSubtitle}
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {/* TAB: LANGUAGE */}
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('language');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'language'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs'
            }`}
          >
            <Globe className="w-4 h-4 text-slate-800" />
            <span>{tr.tabLanguage}</span>
          </button>

          {/* TAB: THEMES */}
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('themes');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'themes'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>{tr.tabThemes} ({themesList.length})</span>
          </button>

          {/* TAB: PIECE SETS */}
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('pieceSets');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pieceSets'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs'
            }`}
          >
            <Type className="w-4 h-4 text-slate-800" />
            <span>{tr.tabPieceSets} ({pieceSetsList.length})</span>
          </button>

          {/* TAB: PROFILE */}
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('profile');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{tr.tabProfile}</span>
          </button>

          {/* TAB: AUDIO */}
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('audio');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'audio'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{tr.tabAudio}</span>
          </button>

          {/* TAB: GAMEPLAY */}
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('gameplay');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gameplay'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{tr.tabGameplay}</span>
          </button>
        </div>

        {/* TAB 0: LANGUAGE SELECTION */}
        {activeTab === 'language' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-600" />
                    <span>{tr.languageTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {tr.languageSubtitle}
                  </p>
                </div>
              </div>

              {/* Language Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Turkish Option */}
                <div
                  onClick={() => handleSelectLanguage('tr')}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    currentLang === 'tr'
                      ? 'bg-amber-50/70 border-amber-500 shadow-md scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">🇹🇷</span>
                    <div>
                      <div className="font-display font-black text-base text-slate-900">
                        Türkçe
                      </div>
                      <div className="text-xs text-slate-500">
                        Dersler, ipuçları ve tüm arayüz Türkçe
                      </div>
                    </div>
                  </div>
                  {currentLang === 'tr' ? (
                    <span className="flex items-center gap-1 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      {tr.selected}
                    </span>
                  ) : (
                    <button className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                      {tr.select}
                    </button>
                  )}
                </div>

                {/* English Option */}
                <div
                  onClick={() => handleSelectLanguage('en')}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    currentLang === 'en'
                      ? 'bg-amber-50/70 border-amber-500 shadow-md scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">🇬🇧</span>
                    <div>
                      <div className="font-display font-black text-base text-slate-900">
                        English
                      </div>
                      <div className="text-xs text-slate-500">
                        Lessons, hints and complete interface in English
                      </div>
                    </div>
                  </div>
                  {currentLang === 'en' ? (
                    <span className="flex items-center gap-1 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      {tr.selected}
                    </span>
                  ) : (
                    <button className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                      {tr.select}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: BOARD THEMES */}
        {activeTab === 'themes' && (
          <div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {tr.selectedTheme}: <span className="text-amber-600 font-black">{activeTheme.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeTheme.tagline} • {tr.themeSaveNotice}
                  </p>
                </div>
                {/* Active Mini Board Preview */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-xl border-2 grid grid-cols-2 grid-rows-2 p-1 shadow-sm"
                    style={{
                      background: activeTheme.board.border,
                      borderColor: activeTheme.board.borderColor,
                    }}
                  >
                    <div style={{ background: activeTheme.board.light }} className="flex items-center justify-center rounded-xs">
                      <ChessPieceSvg type="n" color="w" size={24} theme={activeTheme} pieceSet={activePieceSet} />
                    </div>
                    <div style={{ background: activeTheme.board.dark }} className="flex items-center justify-center rounded-xs">
                      <ChessPieceSvg type="q" color="b" size={24} theme={activeTheme} pieceSet={activePieceSet} />
                    </div>
                    <div style={{ background: activeTheme.board.dark }} className="flex items-center justify-center rounded-xs">
                      <ChessPieceSvg type="r" color="b" size={24} theme={activeTheme} pieceSet={activePieceSet} />
                    </div>
                    <div style={{ background: activeTheme.board.light }} className="flex items-center justify-center rounded-xs">
                      <ChessPieceSvg type="p" color="w" size={24} theme={activeTheme} pieceSet={activePieceSet} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {themesList.map((th) => {
                const isSelected = th.id === activeThemeId;

                return (
                  <div
                    key={th.id}
                    onClick={() => handleSelectTheme(th.id)}
                    className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50/50 border-amber-500 shadow-md scale-[1.02]'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Theme Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-display font-extrabold text-base text-slate-900">
                          {th.name}
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 bg-amber-500 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3 stroke-[3]" />
                            {tr.selected}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mb-3 line-clamp-1">
                        {th.tagline}
                      </p>

                      {/* Mini 4x3 Chessboard Visual Preview */}
                      <div
                        className="w-full aspect-[4/3] rounded-xl border-2 p-1.5 shadow-inner grid grid-cols-4 grid-rows-3 gap-0.5 mb-3"
                        style={{
                          background: th.board.border,
                          borderColor: th.board.borderColor,
                        }}
                      >
                        {[
                          { sq: 'l', p: { type: 'r' as const, c: 'b' as const } },
                          { sq: 'd', p: { type: 'n' as const, c: 'b' as const } },
                          { sq: 'l', p: { type: 'b' as const, c: 'b' as const } },
                          { sq: 'd', p: { type: 'q' as const, c: 'b' as const } },
                          { sq: 'd', p: null },
                          { sq: 'l', p: { type: 'p' as const, c: 'w' as const } },
                          { sq: 'd', p: null },
                          { sq: 'l', p: null },
                          { sq: 'l', p: { type: 'p' as const, c: 'w' as const } },
                          { sq: 'd', p: { type: 'n' as const, c: 'w' as const } },
                          { sq: 'l', p: { type: 'b' as const, c: 'w' as const } },
                          { sq: 'd', p: { type: 'k' as const, c: 'w' as const } },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-center rounded-xs"
                            style={{
                              background:
                                item.sq === 'l' ? th.board.light : th.board.dark,
                            }}
                          >
                            {item.p && (
                              <ChessPieceSvg
                                type={item.p.type}
                                color={item.p.c}
                                size={22}
                                theme={th}
                                pieceSet={activePieceSet}
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Color Palette Dots */}
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span>{tr.colorsLabel}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: th.board.light }}
                            title="Light Square"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: th.board.dark }}
                            title="Dark Square"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: th.pieces.whiteFill }}
                            title="White Piece"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: th.pieces.blackFill }}
                            title="Black Piece"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTheme(th.id);
                      }}
                      className={`mt-3.5 w-full py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected ? tr.active : tr.applyThisTheme}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PIECE FONT SETS */}
        {activeTab === 'pieceSets' && (
          <div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {tr.selectedPieceSet}: <span className="text-amber-600 font-black">{activePieceSet.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activePieceSet.description}
                  </p>
                </div>

                {/* Live Preview of all pieces in active font */}
                <div className="flex items-center gap-1.5 p-2 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
                  {PREVIEW_PIECES.map((pt) => (
                    <ChessPieceSvg key={pt} type={pt} color="w" size={26} theme={activeTheme} pieceSet={activePieceSet} />
                  ))}
                  <div className="w-[1px] h-6 bg-slate-300 mx-1" />
                  {PREVIEW_PIECES.map((pt) => (
                    <ChessPieceSvg key={pt} type={pt} color="b" size={26} theme={activeTheme} pieceSet={activePieceSet} />
                  ))}
                </div>
              </div>
            </div>

            {/* 12 Piece Font Sets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pieceSetsList.map((setObj) => {
                const isSelected = setObj.id === activePieceSetId;

                return (
                  <div
                    key={setObj.id}
                    onClick={() => handleSelectPieceSet(setObj.id)}
                    className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50/50 border-amber-500 shadow-md scale-[1.02]'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Set Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="font-display font-black text-base text-slate-900 flex items-center gap-1.5">
                          <span>{setObj.name}</span>
                        </div>
                        {isSelected ? (
                          <span className="flex items-center gap-1 bg-amber-500 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3 stroke-[3]" />
                            {tr.selected}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                            {setObj.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mb-3 line-clamp-1">
                        {setObj.tagline}
                      </p>

                      {/* Visual Piece Font Showcase Lineup (White & Black) */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 mb-3">
                        {/* White Pieces */}
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-bold uppercase text-slate-500">{tr.whitePieceLabel}</span>
                          <div className="flex items-center gap-1.5">
                            {PREVIEW_PIECES.map((pType) => (
                              <ChessPieceSvg
                                key={`w-${pType}`}
                                type={pType}
                                color="w"
                                size={28}
                                theme={activeTheme}
                                pieceSet={setObj}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Black Pieces */}
                        <div className="flex items-center justify-between px-1 pt-1.5 border-t border-slate-200">
                          <span className="text-[10px] font-bold uppercase text-slate-500">{tr.blackPieceLabel}</span>
                          <div className="flex items-center gap-1.5">
                            {PREVIEW_PIECES.map((pType) => (
                              <ChessPieceSvg
                                key={`b-${pType}`}
                                type={pType}
                                color="b"
                                size={28}
                                theme={activeTheme}
                                pieceSet={setObj}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-tight">
                        {setObj.description}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPieceSet(setObj.id);
                      }}
                      className={`mt-3.5 w-full py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected ? tr.active : tr.selectThisPieceSet}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE & ICON EDITING */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    {tr.editProfileTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {tr.editProfileSubtitle}
                  </p>
                </div>
                {saveFeedback && (
                  <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1 rounded-xl font-bold animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-600" />
                    {tr.saved}
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveProfileChanges} className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {tr.playerNameLabel}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={20}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-display font-bold text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Avatar / Icon Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {tr.avatarLabel}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {AVATAR_LIST.map((av) => {
                      const isSelected = editAvatar === av.id;
                      const avatarLabel = currentLang === 'en' && av.labelEn ? av.labelEn : av.label;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            sound.playTap();
                            setEditAvatar(av.id);
                          }}
                          className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 shadow-sm scale-105'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-3xl">{av.emoji}</span>
                          <span className="text-xs font-bold text-slate-800">{avatarLabel}</span>
                          {isSelected && (
                            <span className="text-[10px] text-amber-700 font-black">
                              ✓ {tr.selected}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-sm rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{tr.saveProfileBtn}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Reset All Data Area */}
            <div className="bg-white border border-red-200/80 rounded-2xl p-6 shadow-xs">
              <h4 className="font-display font-bold text-rose-600 text-base mb-1">
                {tr.resetDataTitle}
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                {tr.resetDataDesc}
              </p>

              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl font-display font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{tr.resetDataBtn}</span>
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 p-4 rounded-xl">
                  <span className="text-xs font-bold text-rose-900">
                    {tr.resetConfirmTitle}
                  </span>
                  <button
                    onClick={() => {
                      onResetAllData();
                      setShowResetConfirm(false);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                  >
                    {tr.resetConfirmYes}
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold text-xs cursor-pointer"
                  >
                    {tr.resetConfirmCancel}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIO SETTINGS */}
        {activeTab === 'audio' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-display font-bold text-lg text-slate-900 pb-3 border-b border-slate-100">
              {tr.audioSettingsTitle}
            </h3>

            <div className="space-y-4">
              {/* Sound Effects Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{tr.soundEffects}</div>
                    <div className="text-xs text-slate-500">
                      {tr.soundEffectsDesc}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playTap();
                    const next = !settings.soundEnabled;
                    const upd = { ...settings, soundEnabled: next };
                    onUpdateSettings(upd);
                    saveSettings(upd);
                    if (onToggleSound && next !== soundEnabled) onToggleSound();
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    settings.soundEnabled ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Background Music Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-500 text-white rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{tr.bgMusic}</div>
                    <div className="text-xs text-slate-500">
                      {tr.bgMusicDesc}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playTap();
                    const upd = { ...settings, musicEnabled: !settings.musicEnabled };
                    onUpdateSettings(upd);
                    saveSettings(upd);
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    settings.musicEnabled ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GAMEPLAY PREFERENCES */}
        {activeTab === 'gameplay' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-display font-bold text-lg text-slate-900 pb-3 border-b border-slate-100">
              {tr.gameplaySettingsTitle}
            </h3>

            <div className="space-y-4">
              {/* Highlight Legal Moves */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{tr.highlightMoves}</div>
                  <div className="text-xs text-slate-500">
                    {tr.highlightMovesDesc}
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playTap();
                    const upd = { ...settings, highlightMoves: !settings.highlightMoves };
                    onUpdateSettings(upd);
                    saveSettings(upd);
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    settings.highlightMoves ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.highlightMoves ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Board Coordinates */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{tr.boardCoords}</div>
                  <div className="text-xs text-slate-500">
                    {tr.boardCoordsDesc}
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playTap();
                    const upd = { ...settings, showCoordinates: !settings.showCoordinates };
                    onUpdateSettings(upd);
                    saveSettings(upd);
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    settings.showCoordinates ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      settings.showCoordinates ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
