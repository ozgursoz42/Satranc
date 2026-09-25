import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Award, Star, ChevronRight, Volume2, VolumeX, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LessonModule, PlayerProfile } from '../../types/game';
import { sound } from '../../utils/sound';
import { saveActiveProfile } from '../../utils/storage';
import { getChessLessons } from '../../data/chessLessonsData';
import { ChessPieceSvg } from '../common/ChessPieceSvg';
import { getThemeById } from '../../data/themes';
import { Language, getTranslation } from '../../utils/i18n';

interface QuizScreenProps {
  lesson: LessonModule;
  profile: PlayerProfile;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onBack: () => void;
  onReturnToLessons: () => void;
  onProfileUpdated: (profile: PlayerProfile) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  lesson: initialLesson,
  profile,
  soundEnabled = true,
  onToggleSound,
  onBack,
  onReturnToLessons,
  onProfileUpdated,
}) => {
  const currentLang: Language = profile.language || 'tr';
  const tr = getTranslation(currentLang);
  const lessons = getChessLessons(currentLang);
  const lesson = lessons.find((l) => l.id === initialLesson.id) || initialLesson;

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const activeTheme = getThemeById(profile.selectedTheme || 'classic_wood', currentLang);

  const question = lesson.quiz[currentQIndex] || lesson.quiz[0];

  const handleSelectOption = (option: { id: string; text: string; isCorrect: boolean }) => {
    if (isAnswered) return;
    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.isCorrect) {
      sound.playCorrect();
      setCorrectCount((prev) => prev + 1);
      setScore((prev) => prev + 20);
    } else {
      sound.playWrong();
      setWrongCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < lesson.quiz.length - 1) {
      sound.playTap();
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizCompleted(true);
    const isPassed = wrongCount <= 1;

    if (isPassed) {
      sound.playVictory();
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}

      const lessonIdx = lessons.findIndex((r) => r.id === lesson.id);
      const nextLessonIndex = Math.max(profile.unlockedLessonIndex || 0, lessonIdx + 1);

      const newBadges = [...(profile.unlockedBadges || [])];
      if (!newBadges.includes(lesson.badgeId)) {
        newBadges.push(lesson.badgeId);
        sound.playUnlock();
      }

      const updatedMissions = {
        ...(profile.completedMissions || {}),
        [`${lesson.id}_quiz`]: 3,
      };

      const updatedProfile: PlayerProfile = {
        ...profile,
        stars: profile.stars + score,
        unlockedLessonIndex: Math.min(6, nextLessonIndex),
        unlockedBadges: newBadges,
        completedMissions: updatedMissions,
      };

      saveActiveProfile(updatedProfile);
      onProfileUpdated(updatedProfile);
    } else {
      sound.playWrong();
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setWrongCount(0);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const isPassed = wrongCount <= 1;

  if (isQuizCompleted) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center animate-in zoom-in-95 select-none">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 relative overflow-hidden text-slate-800">
          {isPassed ? (
            /* PASSED VIEW (0 or 1 mistake) */
            <>
              <div className="w-20 h-20 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center text-4xl mx-auto shadow-xs">
                <Award className="w-10 h-10 text-amber-600" />
              </div>

              <div>
                <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase mb-2">
                  {tr.quizPassedBadge}
                </div>
                <h2 className="text-2xl font-display font-black text-slate-900">
                  {tr.quizCompletedTitle}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {tr.quizSuccessSubtitle}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{currentLang === 'en' ? 'Correct' : 'Doğru'}</div>
                  <div className="text-lg font-display font-black text-emerald-700">
                    {correctCount} / {lesson.quiz.length}
                  </div>
                </div>
                <div className="border-x border-amber-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{tr.quizMistakesLabel}</div>
                  <div className={`text-lg font-display font-black ${wrongCount === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {wrongCount} / 1
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{tr.score}</div>
                  <div className="text-lg font-display font-black text-amber-700">+{score} ⭐</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{currentLang === 'en' ? 'Badge Earned' : 'Kazanılan Rozet'}</div>
                    <div className="text-xs font-bold text-slate-800">{lesson.badgeName}</div>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-600">✓ {currentLang === 'en' ? 'Unlocked' : 'Açıldı'}</span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={onReturnToLessons}
                  className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{currentLang === 'en' ? 'Back to Academy' : 'Ders Listesine Dön'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRetakeQuiz}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{tr.retakeQuizBtn}</span>
                </button>
              </div>
            </>
          ) : (
            /* FAILED VIEW (> 1 mistake) */
            <>
              <div className="w-20 h-20 rounded-2xl bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center text-4xl mx-auto shadow-xs">
                <ShieldAlert className="w-10 h-10 text-rose-600" />
              </div>

              <div>
                <div className="inline-block px-3 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold uppercase mb-2">
                  {tr.quizFailedBadge}
                </div>
                <h2 className="text-2xl font-display font-black text-slate-900">
                  {tr.quizFailedTitle}
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  {tr.quizFailedSubtitle}
                </p>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{currentLang === 'en' ? 'Correct' : 'Doğru Cevap'}</div>
                  <div className="text-xl font-display font-black text-slate-800">
                    {correctCount} / {lesson.quiz.length}
                  </div>
                </div>
                <div className="border-l border-rose-200">
                  <div className="text-[10px] font-bold text-rose-600 uppercase">{tr.quizMistakesLabel}</div>
                  <div className="text-xl font-display font-black text-rose-600">
                    {wrongCount} <span className="text-xs font-semibold text-rose-500">({currentLang === 'en' ? 'Max: 1' : 'Maks: 1'})</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-left flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {tr.quizMustRetakeNotice}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleRetakeQuiz}
                  className="w-full py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-display font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{tr.retakeQuizBtn}</span>
                </button>

                <button
                  onClick={onReturnToLessons}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{currentLang === 'en' ? 'Back to Academy' : 'Ders Listesine Dön'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-3 sm:p-6 select-none">
      <div className="max-w-xl mx-auto space-y-4">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playTap();
                onBack();
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
              title={tr.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                {lesson.name}
              </div>
              <h2 className="text-base sm:text-lg font-display font-black text-slate-900">
                {tr.quizTitleText}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mistake Counter / Rule badge */}
            <div
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                wrongCount === 0
                  ? 'bg-slate-50 border-slate-200 text-slate-600'
                  : wrongCount === 1
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
              }`}
              title={currentLang === 'en' ? 'Max 1 mistake allowed to pass' : 'Geçmek için en fazla 1 hata yapılabilir'}
            >
              <span>{currentLang === 'en' ? 'Mistake:' : 'Hata:'}</span>
              <span className="font-extrabold">{wrongCount}/1</span>
            </div>

            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
              {currentQIndex + 1} / {lesson.quiz.length}
            </span>

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

        {/* Rule Reminder Banner */}
        <div className="bg-amber-50/70 border border-amber-200/80 px-4 py-2 rounded-xl flex items-center justify-between text-xs text-amber-900 font-medium">
          <span>
            📌 {currentLang === 'en' ? 'Rule: You can make at most 1 mistake to pass the lesson.' : 'Kural: Dersi geçebilmek için en fazla 1 hata yapabilirsin.'}
          </span>
          <span className="font-bold text-[11px] text-amber-800 shrink-0 ml-2">
            {tr.quizMaxMistakesRule}
          </span>
        </div>

        {/* Question Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              {lesson.pieceKey === 'tactics' ? (
                <span className="text-2xl">⚡</span>
              ) : (
                <ChessPieceSvg type={lesson.pieceKey} color="w" size={32} theme={activeTheme} />
              )}
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                {currentLang === 'en' ? `Question ${currentQIndex + 1}` : `Soru ${currentQIndex + 1}`}
              </span>
              <h3 className="text-base sm:text-lg font-display font-black text-slate-900 mt-0.5">
                {question.question}
              </h3>
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5 pt-1">
            {question.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnStyle = 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 shadow-xs';
                } else {
                  btnStyle = 'bg-slate-50/50 border-slate-100 text-slate-400';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border-2 text-left font-display font-bold text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt.text}</span>
                  {isAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Action */}
          {isAnswered && (
            <div className="pt-2 space-y-4 animate-in fade-in">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">{currentLang === 'en' ? 'Explanation: ' : 'Açıklama: '}</span>
                {question.explanation}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>
                  {currentQIndex < lesson.quiz.length - 1
                    ? tr.nextQuestionBtn
                    : tr.finishQuizBtn}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
