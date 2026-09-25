import React, { useState } from 'react';
import { User, Check, Plus, Trash2, X, Edit2, Save } from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import {
  AVATAR_LIST,
  loadProfiles,
  createNewProfile,
  setActiveProfileId,
  deleteProfile,
  saveActiveProfile,
} from '../../utils/storage';
import { sound } from '../../utils/sound';
import { Language, getTranslation } from '../../utils/i18n';

interface ProfileScreenProps {
  currentProfile: PlayerProfile;
  onProfileChanged: (profile: PlayerProfile) => void;
  onClose: () => void;
  isInitialSetup?: boolean;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentProfile,
  onProfileChanged,
  onClose,
  isInitialSetup = false,
}) => {
  const currentLang: Language = currentProfile.language || 'tr';
  const tr = getTranslation(currentLang);

  const [profiles, setProfiles] = useState<PlayerProfile[]>(loadProfiles());
  const [isCreatingNew, setIsCreatingNew] = useState(isInitialSetup || profiles.length === 0);
  const [isEditingCurrent, setIsEditingCurrent] = useState(false);
  const [nameInput, setNameInput] = useState(currentProfile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(currentProfile.avatar || 'grandmaster');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMsg(currentLang === 'en' ? 'Please enter a valid player name!' : 'Lütfen geçerli bir isim yazın!');
      return;
    }

    if (isCreatingNew) {
      const created = createNewProfile(nameInput.trim(), selectedAvatar);
      sound.playStar();
      setProfiles(loadProfiles());
      onProfileChanged(created);
      setIsCreatingNew(false);
    } else {
      const updated = {
        ...currentProfile,
        name: nameInput.trim(),
        avatar: selectedAvatar,
      };
      saveActiveProfile(updated);
      sound.playTap();
      setProfiles(loadProfiles());
      onProfileChanged(updated);
      setIsEditingCurrent(false);
    }

    if (!isInitialSetup) {
      onClose();
    }
  };

  const handleSwitchProfile = (p: PlayerProfile) => {
    sound.playTap();
    setActiveProfileId(p.id);
    setNameInput(p.name);
    setSelectedAvatar(p.avatar);
    onProfileChanged(p);
    onClose();
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = currentLang === 'en' ? 'Are you sure you want to delete this profile?' : 'Bu profili silmek istediğinize emin misiniz?';
    if (confirm(msg)) {
      deleteProfile(id);
      const updatedList = loadProfiles();
      setProfiles(updatedList);
      if (updatedList.length > 0) {
        onProfileChanged(updatedList[0]);
      } else {
        setIsCreatingNew(true);
      }
    }
  };

  const startEditCurrent = () => {
    setNameInput(currentProfile.name);
    setSelectedAvatar(currentProfile.avatar);
    setIsEditingCurrent(true);
    setIsCreatingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-5 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <h2 className="text-xl font-display font-black text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-600" />
            <span>
              {isInitialSetup
                ? (currentLang === 'en' ? 'Welcome to Chess' : 'Satranca Hoş Geldiniz')
                : isEditingCurrent
                ? (currentLang === 'en' ? 'Edit Profile' : 'Mevcut Profili Düzenle')
                : isCreatingNew
                ? (currentLang === 'en' ? 'Create New Profile' : 'Yeni Profil Oluştur')
                : (currentLang === 'en' ? 'Profile Management' : 'Oyuncu Profili Yönetimi')}
            </span>
          </h2>
          {!isInitialSetup && (
            <button
              onClick={() => {
                sound.playTap();
                onClose();
              }}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Existing Profiles List View */}
        {!isInitialSetup && !isCreatingNew && !isEditingCurrent && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>{currentLang === 'en' ? 'Profiles' : 'Profiller'} ({profiles.length})</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={startEditCurrent}
                  className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'Edit Profile' : 'Profili Düzenle'}</span>
                </button>
                <button
                  onClick={() => {
                    sound.playTap();
                    setIsCreatingNew(true);
                    setNameInput('');
                    setSelectedAvatar('scout');
                  }}
                  className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'New Profile' : 'Yeni Profil'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1">
              {profiles.map((p) => {
                const isSelected = p.id === currentProfile.id;
                const av = AVATAR_LIST.find((a) => a.id === p.avatar) || AVATAR_LIST[0];
                const avLabel = currentLang === 'en' && av.labelEn ? av.labelEn : av.label;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleSwitchProfile(p)}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-2xl">{av.emoji}</span>
                      <div className="truncate">
                        <div className="font-display font-bold text-sm text-slate-900 truncate">{p.name}</div>
                        <div className="text-[11px] text-amber-700 font-bold">
                          ★ {p.stars} {tr.stars}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isSelected ? (
                        <Check className="w-4 h-4 text-amber-600 stroke-[3]" />
                      ) : (
                        profiles.length > 1 && (
                          <button
                            onClick={(e) => handleDeleteProfile(p.id, e)}
                            className="p-1 hover:text-rose-600 text-slate-400 cursor-pointer"
                            title={currentLang === 'en' ? 'Delete Profile' : 'Profili Sil'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Profile Creation / Editing Form */}
        {(isCreatingNew || isEditingCurrent || isInitialSetup) && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {currentLang === 'en' ? 'Player Name:' : 'Oyuncu Adınız:'}
              </label>
              {!isInitialSetup && (
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setIsEditingCurrent(false);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {tr.cancel}
                </button>
              )}
            </div>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={currentLang === 'en' ? 'E.g. Alex, Sarah...' : 'Örn: Mehmet, Ayşe...'}
              maxLength={20}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-display font-bold text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
            />

            {errorMsg && <p className="text-xs text-rose-600 font-bold">{errorMsg}</p>}

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {currentLang === 'en' ? 'Choose Your Avatar:' : 'Profil İkonunuzu / Avatarınızı Seçin:'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_LIST.map((av) => {
                  const label = currentLang === 'en' && av.labelEn ? av.labelEn : av.label;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        setSelectedAvatar(av.id);
                      }}
                      className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        selectedAvatar === av.id
                          ? 'bg-amber-50 border-amber-500 scale-105 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl">{av.emoji}</span>
                      <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-sm rounded-xl transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              {isInitialSetup
                ? (currentLang === 'en' ? 'Start Playing Chess' : 'Satranca Başla')
                : (currentLang === 'en' ? 'Save Profile' : 'Profili Kaydet')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
