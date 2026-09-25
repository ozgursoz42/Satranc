import React from 'react';
import { Volume2 } from 'lucide-react';
import { sound } from '../../utils/sound';

interface PikoGuideProps {
  text: string;
  mood?: 'happy' | 'thinking' | 'danger' | 'celebrate' | 'curious';
  showVoiceButton?: boolean;
  className?: string;
}

export const PikoGuide: React.FC<PikoGuideProps> = ({
  text,
  mood = 'happy',
  showVoiceButton = true,
  className = '',
}) => {
  const getPikoEmoji = () => {
    switch (mood) {
      case 'thinking':
        return '🤔';
      case 'danger':
        return '⚡';
      case 'celebrate':
        return '🎉';
      case 'curious':
        return '💡';
      case 'happy':
      default:
        return '🧙‍♂️';
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.speakPiko(text);
  };

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-2xl border bg-slate-900 border-slate-800 text-slate-200 shadow-md ${className}`}
    >
      {/* Mentor Avatar */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-inner">
          {getPikoEmoji()}
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-display">
            Satranç Rehberi
          </span>
          {showVoiceButton && (
            <button
              onClick={handleSpeak}
              className="text-slate-400 hover:text-amber-400 p-1 rounded-md transition-colors cursor-pointer"
              title="Sesli Oku"
              aria-label="Sesli Oku"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-300">{text}</p>
      </div>
    </div>
  );
};
