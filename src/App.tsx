import React, { useState, useEffect } from 'react';
import { ScreenType, PlayerProfile, GameSettings, LessonModule } from './types/game';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { LessonsScreen } from './components/screens/LessonsScreen';
import { MissionPlayScreen } from './components/screens/MissionPlayScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { GrandArenaScreen } from './components/screens/GrandArenaScreen';
import { PieceBookScreen } from './components/screens/PieceBookScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { ParentStatsScreen } from './components/screens/ParentStatsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import {
  getActiveProfile,
  loadSettings,
  saveSettings,
  saveActiveProfile,
  loadProfiles,
  resetAllData,
} from './utils/storage';
import { sound } from './utils/sound';
import { CHESS_LESSONS } from './data/chessLessonsData';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(getActiveProfile());
  const [settings, setSettings] = useState<GameSettings>(loadSettings());
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('WELCOME');
  const [selectedLesson, setSelectedLesson] = useState<LessonModule>(CHESS_LESSONS[0]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  // Check if first time user
  useEffect(() => {
    const existingProfiles = loadProfiles();
    if (existingProfiles.length === 0) {
      setIsFirstLaunch(true);
      setShowProfileModal(true);
    }
    sound.setSoundEnabled(settings.soundEnabled);
    sound.setVoiceEnabled(settings.voiceEnabled);
  }, []);

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    sound.setSoundEnabled(updated.soundEnabled);
    setSettings(updated);
    saveSettings(updated);
  };

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleProfileUpdated = (newProfile: PlayerProfile) => {
    setProfile(newProfile);
    saveActiveProfile(newProfile);
  };

  const handleSelectLesson = (lesson: LessonModule) => {
    setSelectedLesson(lesson);
    setCurrentScreen('MISSION');
  };

  const handleStartQuiz = (lesson: LessonModule) => {
    setSelectedLesson(lesson);
    setCurrentScreen('QUIZ');
  };

  const handleResetEverything = () => {
    resetAllData();
    const initial = getActiveProfile();
    setProfile(initial);
    setCurrentScreen('WELCOME');
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'WELCOME':
        return (
          <WelcomeScreen
            profile={profile}
            hasSavedGame={profile.stars > 0 || Object.keys(profile.completedMissions || {}).length > 0}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );

      case 'LESSONS':
        return (
          <LessonsScreen
            profile={profile}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            onBack={() => setCurrentScreen('WELCOME')}
            onSelectLesson={handleSelectLesson}
            onStartQuiz={handleStartQuiz}
          />
        );

      case 'MISSION':
        return (
          <MissionPlayScreen
            lesson={selectedLesson}
            profile={profile}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            onBack={() => setCurrentScreen('LESSONS')}
            onStartQuiz={() => setCurrentScreen('QUIZ')}
            onProfileUpdated={handleProfileUpdated}
          />
        );

      case 'QUIZ':
        return (
          <QuizScreen
            lesson={selectedLesson}
            profile={profile}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            onBack={() => setCurrentScreen('MISSION')}
            onReturnToLessons={() => setCurrentScreen('LESSONS')}
            onProfileUpdated={handleProfileUpdated}
          />
        );

      case 'ARENA':
        return (
          <GrandArenaScreen
            profile={profile}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onProfileUpdated={handleProfileUpdated}
          />
        );

      case 'PIECES':
        return (
          <PieceBookScreen
            profile={profile}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            onBack={() => setCurrentScreen('WELCOME')}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );

      case 'ACHIEVEMENTS':
        return (
          <AchievementsScreen
            profile={profile}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            onBack={() => setCurrentScreen('WELCOME')}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );

      case 'STATS':
        return (
          <ParentStatsScreen
            profile={profile}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            onBack={() => setCurrentScreen('WELCOME')}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );

      case 'SETTINGS':
        return (
          <SettingsScreen
            settings={settings}
            profile={profile}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            onUpdateSettings={handleUpdateSettings}
            onUpdateProfile={handleProfileUpdated}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onResetAllData={handleResetEverything}
          />
        );

      case 'PROFILE_SETUP':
        return (
          <div className="p-6">
            <ProfileScreen
              currentProfile={profile}
              isInitialSetup={false}
              onProfileChanged={(updated) => {
                handleProfileUpdated(updated);
                setCurrentScreen('WELCOME');
              }}
              onClose={() => setCurrentScreen('WELCOME')}
            />
          </div>
        );

      default:
        return (
          <WelcomeScreen
            profile={profile}
            hasSavedGame={false}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Main View Area (Top Header Bar completely removed per user request) */}
      <main className="flex-1 w-full">{renderActiveScreen()}</main>

      {/* Initial Launch Modal */}
      {showProfileModal && (
        <ProfileScreen
          currentProfile={profile}
          isInitialSetup={isFirstLaunch}
          onProfileChanged={(updated) => {
            handleProfileUpdated(updated);
            if (isFirstLaunch) {
              setIsFirstLaunch(false);
              setShowProfileModal(false);
              setCurrentScreen('WELCOME');
            }
          }}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}
