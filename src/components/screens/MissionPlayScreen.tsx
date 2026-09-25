import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, RotateCcw, CheckCircle2, ChevronRight, Star, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LessonModule, PlayerProfile, PieceType } from '../../types/game';
import { ChessPieceSvg } from '../common/ChessPieceSvg';
import { sound } from '../../utils/sound';
import { saveActiveProfile } from '../../utils/storage';
import { getThemeById } from '../../data/themes';
import { getChessLessons } from '../../data/chessLessonsData';
import { Language, getTranslation } from '../../utils/i18n';

interface MissionPlayScreenProps {
  lesson: LessonModule;
  profile: PlayerProfile;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onBack: () => void;
  onStartQuiz: () => void;
  onProfileUpdated: (profile: PlayerProfile) => void;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const MissionPlayScreen: React.FC<MissionPlayScreenProps> = ({
  lesson: initialLesson,
  profile,
  soundEnabled = true,
  onToggleSound,
  onBack,
  onStartQuiz,
  onProfileUpdated,
}) => {
  const currentLang: Language = profile.language || 'tr';
  const tr = getTranslation(currentLang);
  const lessons = getChessLessons(currentLang);
  const lesson = lessons.find((l) => l.id === initialLesson.id) || initialLesson;

  const [activeMissionIndex, setActiveMissionIndex] = useState(0);
  const currentMission = lesson.missions[activeMissionIndex] || lesson.missions[0];
  const activeTheme = getThemeById(profile.selectedTheme || 'classic_wood', currentLang);

  // Game board state
  const [pieceSquare, setPieceSquare] = useState<string>(currentMission.boardSetup.piece.startSquare);
  const [pieceType, setPieceType] = useState(currentMission.boardSetup.piece.type);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [enemies, setEnemyPieces] = useState(currentMission.boardSetup.enemyPieces || []);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState(currentMission.pikoSpeech);
  const [showPromotionModal, setShowPromotionModal] = useState(false);

  useEffect(() => {
    resetMission(activeMissionIndex);
  }, [activeMissionIndex, lesson]);

  const resetMission = (index: number) => {
    const mission = lesson.missions[index] || lesson.missions[0];
    setPieceSquare(mission.boardSetup.piece.startSquare);
    setPieceType(mission.boardSetup.piece.type);
    setSelectedSquare(null);
    setValidMoves([]);
    setEnemyPieces(mission.boardSetup.enemyPieces || []);
    setIsSuccess(false);
    setStatusMessage(mission.pikoSpeech);
    setShowPromotionModal(false);
  };

  const calculateLegalTargets = (fromSquare: string, pType: string): string[] => {
    const file = fromSquare[0];
    const rank = parseInt(fromSquare[1], 10);
    const fileIdx = FILES.indexOf(file);
    const rankIdx = 8 - rank;
    const moves: string[] = [];

    const isInside = (f: number, r: number) => f >= 0 && f < 8 && r >= 0 && r < 8;
    const toSq = (f: number, r: number) => `${FILES[f]}${8 - r}`;

    if (pType === 'p') {
      const f1RankIdx = rankIdx - 1;
      if (isInside(fileIdx, f1RankIdx)) {
        const sq1 = toSq(fileIdx, f1RankIdx);
        if (!enemies.some((e) => e.square === sq1)) {
          moves.push(sq1);
          if (rank === 2) {
            const f2RankIdx = rankIdx - 2;
            const sq2 = toSq(fileIdx, f2RankIdx);
            if (!enemies.some((e) => e.square === sq2)) {
              moves.push(sq2);
            }
          }
        }
      }
      [-1, 1].forEach((df) => {
        const dFileIdx = fileIdx + df;
        const dRankIdx = rankIdx - 1;
        if (isInside(dFileIdx, dRankIdx)) {
          const dSq = toSq(dFileIdx, dRankIdx);
          if (enemies.some((e) => e.square === dSq) || currentMission.boardSetup.targets.includes(dSq)) {
            moves.push(dSq);
          }
        }
      });
    } else if (pType === 'n') {
      const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      offsets.forEach(([df, dr]) => {
        const f = fileIdx + df;
        const r = rankIdx + dr;
        if (isInside(f, r)) {
          moves.push(toSq(f, r));
        }
      });
    } else if (pType === 'b') {
      const dirs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
      dirs.forEach(([df, dr]) => {
        let f = fileIdx + df;
        let r = rankIdx + dr;
        while (isInside(f, r)) {
          const sq = toSq(f, r);
          moves.push(sq);
          if (enemies.some((e) => e.square === sq)) break;
          f += df;
          r += dr;
        }
      });
    } else if (pType === 'r') {
      const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      dirs.forEach(([df, dr]) => {
        let f = fileIdx + df;
        let r = rankIdx + dr;
        while (isInside(f, r)) {
          const sq = toSq(f, r);
          moves.push(sq);
          if (enemies.some((e) => e.square === sq)) break;
          f += df;
          r += dr;
        }
      });
    } else if (pType === 'q') {
      const dirs = [
        [0, -1], [0, 1], [-1, 0], [1, 0],
        [-1, -1], [1, -1], [-1, 1], [1, 1],
      ];
      dirs.forEach(([df, dr]) => {
        let f = fileIdx + df;
        let r = rankIdx + dr;
        while (isInside(f, r)) {
          const sq = toSq(f, r);
          moves.push(sq);
          if (enemies.some((e) => e.square === sq)) break;
          f += df;
          r += dr;
        }
      });
    } else if (pType === 'k') {
      const dirs = [
        [0, -1], [0, 1], [-1, 0], [1, 0],
        [-1, -1], [1, -1], [-1, 1], [1, 1],
      ];
      dirs.forEach(([df, dr]) => {
        const f = fileIdx + df;
        const r = rankIdx + dr;
        if (isInside(f, r)) {
          moves.push(toSq(f, r));
        }
      });
    }

    return moves;
  };

  const handleSquareClick = (square: string) => {
    if (isSuccess) return;

    if (square === pieceSquare) {
      sound.playTap();
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setValidMoves([]);
      } else {
        setSelectedSquare(square);
        const legal = calculateLegalTargets(square, pieceType);
        setValidMoves(legal);
      }
      return;
    }

    if (selectedSquare && validMoves.includes(square)) {
      executeMove(square);
      return;
    }

    setSelectedSquare(null);
    setValidMoves([]);
  };

  const executeMove = (targetSquare: string) => {
    sound.playMove();
    setPieceSquare(targetSquare);
    setSelectedSquare(null);
    setValidMoves([]);

    const remainingEnemies = enemies.filter((e) => e.square !== targetSquare);
    setEnemyPieces(remainingEnemies);

    // Goal Check logic
    const { goalType } = currentMission;
    const targets = currentMission.boardSetup.targets || [];
    let success = false;

    if (goalType === 'reach_square' || goalType === 'escape_check' || goalType === 'checkmate') {
      if (targets.includes(targetSquare)) {
        success = true;
      }
    } else if (goalType === 'capture_all') {
      if (remainingEnemies.length === 0 || targets.includes(targetSquare)) {
        success = true;
      }
    } else if (goalType === 'promote') {
      if (targetSquare[1] === '8') {
        setShowPromotionModal(true);
        return;
      }
    }

    if (success) {
      handleMissionSuccess();
    } else {
      setStatusMessage(currentLang === 'en' ? 'Good step! Keep moving forward.' : 'Güzel adım! İlerlemeye devam et.');
    }
  };

  const handleSelectPromotion = (chosenType: PieceType) => {
    setPieceType(chosenType);
    setShowPromotionModal(false);
    handleMissionSuccess();
  };

  const handleMissionSuccess = () => {
    setIsSuccess(true);
    sound.playVictory();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    const updatedMissions = {
      ...(profile.completedMissions || {}),
      [currentMission.id]: 3,
    };

    const isLastMission = activeMissionIndex === lesson.missions.length - 1;
    let nextUnlockedLesson = profile.unlockedLessonIndex || 0;

    if (isLastMission && nextUnlockedLesson <= lessons.findIndex((l) => l.id === lesson.id)) {
      nextUnlockedLesson = Math.min(lessons.length - 1, nextUnlockedLesson + 1);
    }

    const updatedProfile: PlayerProfile = {
      ...profile,
      stars: profile.stars + 10,
      completedMissions: updatedMissions,
      unlockedLessonIndex: nextUnlockedLesson,
    };

    onProfileUpdated(updatedProfile);
    saveActiveProfile(updatedProfile);
    setStatusMessage(currentLang === 'en' ? '⭐ Mission Complete! (+10 Stars)' : '⭐ Görev Başarıyla Tamamlandı! (+10 Yıldız)');
  };

  const handleNextMission = () => {
    sound.playTap();
    if (activeMissionIndex < lesson.missions.length - 1) {
      setActiveMissionIndex((prev) => prev + 1);
    } else {
      onStartQuiz();
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 text-slate-800 p-3 sm:p-6 select-none">
      <div className="max-w-2xl mx-auto space-y-3.5">
        {/* Top Bar */}
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
                {tr.missionTitle} {activeMissionIndex + 1}: {currentMission.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="hidden xs:flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-1 rounded-xl font-display font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{profile.stars}</span>
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

            {lesson.missions.map((m, idx) => {
              const isDone = ((profile.completedMissions || {})[m.id] || 0) > 0;
              const isCurrent = idx === activeMissionIndex;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    sound.playTap();
                    setActiveMissionIndex(idx);
                  }}
                  className={`w-8 h-8 rounded-xl font-display font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instruction Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-0.5">
              {currentLang === 'en' ? 'MISSION OBJECTIVE' : 'GÖREV TALİMATI'}
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {currentMission.instruction}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                sound.playStar();
                setStatusMessage(`💡 ${tr.tip}: ${currentMission.hint}`);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>{tr.tip}</span>
            </button>

            <button
              onClick={() => resetMission(activeMissionIndex)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>{tr.tryAgainBtn}</span>
            </button>
          </div>
        </div>

        {/* Live Feedback Status */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs sm:text-sm text-slate-700 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span>{statusMessage}</span>
        </div>

        {/* Themed Board */}
        <div className="w-full flex items-center justify-center">
          <div
            className="relative w-full aspect-square p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl transition-all border-2"
            style={{
              background: activeTheme.board.border,
              borderColor: activeTheme.board.borderColor,
            }}
          >
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-xl overflow-hidden border border-black/10">
              {RANKS.map((rank, rIdx) =>
                FILES.map((file, fIdx) => {
                  const sq = `${file}${rank}`;
                  const isLight = (fIdx + rIdx) % 2 === 0;
                  const isSelected = selectedSquare === sq;
                  const isValidTarget = validMoves.includes(sq);
                  const isTargetSq = currentMission.boardSetup.targets.includes(sq);
                  const isObstacle = (currentMission.boardSetup.obstacles || []).includes(sq);
                  const hasUserPiece = pieceSquare === sq;
                  const enemy = enemies.find((e) => e.square === sq);

                  let bg = isLight ? activeTheme.board.light : activeTheme.board.dark;
                  if (isSelected) bg = activeTheme.board.selectedSquare;

                  return (
                    <div
                      key={sq}
                      onClick={() => handleSquareClick(sq)}
                      style={{ background: bg }}
                      className="relative flex items-center justify-center cursor-pointer select-none transition-colors duration-100 overflow-hidden"
                    >
                      {/* Coordinates */}
                      {fIdx === 0 && (
                        <span
                          className="absolute top-0.5 left-1 text-[10px] font-bold pointer-events-none opacity-80"
                          style={{
                            color: isLight
                              ? activeTheme.board.coordLight
                              : activeTheme.board.coordDark,
                          }}
                        >
                          {rank}
                        </span>
                      )}
                      {rIdx === 7 && (
                        <span
                          className="absolute bottom-0.5 right-1 text-[10px] font-bold pointer-events-none opacity-80"
                          style={{
                            color: isLight
                              ? activeTheme.board.coordLight
                              : activeTheme.board.coordDark,
                          }}
                        >
                          {file}
                        </span>
                      )}

                      {/* Obstacle Box */}
                      {isObstacle && (
                        <span className="text-2xl pointer-events-none">🧱</span>
                      )}

                      {/* Target Marker Star (when empty) */}
                      {isTargetSq && !hasUserPiece && !enemy && (
                        <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black shadow-md animate-pulse">
                          ★
                        </div>
                      )}

                      {/* User's Scaled Chess Piece */}
                      {hasUserPiece && (
                        <div className="w-full h-full flex items-center justify-center p-0.5 z-10 transition-transform active:scale-95">
                          <ChessPieceSvg
                            type={pieceType}
                            color="w"
                            size={70}
                            className="w-[96%] h-[96%] max-w-[86px] max-h-[86px]"
                            theme={activeTheme}
                            pieceSet={profile.selectedPieceSet}
                          />
                        </div>
                      )}

                      {/* Enemy Piece */}
                      {enemy && (
                        <div className="w-full h-full flex items-center justify-center p-0.5 z-10">
                          <ChessPieceSvg
                            type={enemy.type}
                            color="b"
                            size={70}
                            className="w-[96%] h-[96%] max-w-[86px] max-h-[86px]"
                            theme={activeTheme}
                            pieceSet={profile.selectedPieceSet}
                          />
                        </div>
                      )}

                      {/* Valid Move Indicator */}
                      {isValidTarget && !enemy && (
                        <div
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full z-20 shadow-xs pointer-events-none"
                          style={{ backgroundColor: activeTheme.board.validMoveDot }}
                        />
                      )}

                      {/* Capture Indicator */}
                      {isValidTarget && enemy && (
                        <div
                          className="absolute inset-0 rounded-xs border-4 z-20 pointer-events-none animate-pulse"
                          style={{ borderColor: activeTheme.board.captureRing }}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Mission Success Actions */}
        {isSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-black text-slate-900 text-base">
                  {currentLang === 'en' ? 'Mission Complete! (+10 ⭐)' : 'Görev Tamamlandı! (+10 ⭐)'}
                </h4>
                <p className="text-xs text-emerald-800 font-medium">
                  {currentLang === 'en'
                    ? 'Great move! You successfully applied the rules and solved the puzzle!'
                    : 'Harika bir hamle yaparak kuralları başarıyla uyguladınız!'}
                </p>
              </div>
            </div>

            <button
              onClick={handleNextMission}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>
                {activeMissionIndex < lesson.missions.length - 1
                  ? tr.nextMissionBtn
                  : tr.startQuizNowBtn}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Promotion Selection Modal */}
        {showPromotionModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl text-slate-800">
              <h3 className="text-lg font-display font-black text-slate-900">
                👑 {currentLang === 'en' ? 'Pawn Promotion!' : 'Piyon Terfisi!'}
              </h3>
              <p className="text-xs text-slate-600">
                {currentLang === 'en'
                  ? 'Your pawn reached the 8th rank! Choose the piece to promote to:'
                  : 'Piyonunuz son sıraya ulaştı! Dönüşmek istediğiniz taşı seçin:'}
              </p>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { type: 'q' as PieceType, label: currentLang === 'en' ? 'Queen' : 'Vezir' },
                  { type: 'r' as PieceType, label: currentLang === 'en' ? 'Rook' : 'Kale' },
                  { type: 'b' as PieceType, label: currentLang === 'en' ? 'Bishop' : 'Fil' },
                  { type: 'n' as PieceType, label: currentLang === 'en' ? 'Knight' : 'At' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleSelectPromotion(item.type)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
                  >
                    <ChessPieceSvg type={item.type} color="w" size={36} theme={activeTheme} />
                    <span className="text-[11px] font-bold text-slate-800">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
