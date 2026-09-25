import React, { useState } from 'react';
import { Chess, Square, Move } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Lightbulb,
  Undo2,
  ArrowLeft,
  RefreshCw,
  Trophy,
  Star,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { PlayerProfile, ScreenType, PieceType, AIDifficulty } from '../../types/game';
import { ChessPieceSvg } from '../common/ChessPieceSvg';
import { getAIMove, getSmartHint, getDifficultyLevels, DifficultyConfig } from '../../utils/chessEngine';
import { sound } from '../../utils/sound';
import { saveActiveProfile, updateStats } from '../../utils/storage';
import { getThemeById } from '../../data/themes';
import { Language, getTranslation } from '../../utils/i18n';

interface GrandArenaScreenProps {
  profile: PlayerProfile;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onNavigate: (screen: ScreenType) => void;
  onProfileUpdated: (profile: PlayerProfile) => void;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const GrandArenaScreen: React.FC<GrandArenaScreenProps> = ({
  profile,
  soundEnabled = true,
  onToggleSound,
  onNavigate,
  onProfileUpdated,
}) => {
  const currentLang: Language = profile.language || 'tr';
  const tr = getTranslation(currentLang);
  const diffLevels = getDifficultyLevels(currentLang);

  const [boardFlipped, setBoardFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const activeTheme = getThemeById(profile.selectedTheme || 'classic_wood', currentLang);

  // Core Chess State
  const [game, setGame] = useState<Chess>(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [capturedWhite, setCapturedWhite] = useState<PieceType[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<PieceType[]>([]);

  // AI & Feedback
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [hintSquare, setHintSquare] = useState<{ from: string; to: string; reason?: string } | null>(null);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [gameResult, setGameResult] = useState<{
    title: string;
    subtitle: string;
    won: boolean;
    stars: number;
  } | null>(null);

  // Pawn Promotion Dialog
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Square;
    to: Square;
  } | null>(null);

  const currentDiffObj = diffLevels.find((d) => d.id === difficulty) || diffLevels[2];

  const updateCapturedPieces = (chessInstance: Chess) => {
    const initialCounts: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
    const currentWhiteCounts: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
    const currentBlackCounts: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };

    const board = chessInstance.board();
    board.forEach((row) => {
      row.forEach((piece) => {
        if (!piece) return;
        if (piece.color === 'w') {
          currentWhiteCounts[piece.type] = (currentWhiteCounts[piece.type] || 0) + 1;
        } else {
          currentBlackCounts[piece.type] = (currentBlackCounts[piece.type] || 0) + 1;
        }
      });
    });

    const lostWhite: PieceType[] = [];
    const lostBlack: PieceType[] = [];

    Object.keys(initialCounts).forEach((typeKey) => {
      const type = typeKey as PieceType;
      const whiteLostCount = Math.max(0, initialCounts[type] - (currentWhiteCounts[type] || 0));
      const blackLostCount = Math.max(0, initialCounts[type] - (currentBlackCounts[type] || 0));
      for (let i = 0; i < whiteLostCount; i++) lostWhite.push(type);
      for (let i = 0; i < blackLostCount; i++) lostBlack.push(type);
    });

    setCapturedWhite(lostWhite);
    setCapturedBlack(lostBlack);
  };

  const checkGameOverStatus = (chessInstance: Chess) => {
    if (chessInstance.isCheckmate()) {
      sound.playVictory();
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}

      const winner = chessInstance.turn() === 'w' ? 'b' : 'w';
      const playerWon = winner === 'w';
      const difficultyBonus =
        difficulty === 'very_hard'
          ? 50
          : difficulty === 'hard'
          ? 40
          : difficulty === 'medium'
          ? 30
          : difficulty === 'easy'
          ? 20
          : 15;
      const starsEarned = playerWon ? difficultyBonus : 5;

      const res = {
        title: playerWon ? (currentLang === 'en' ? '🏆 CHECKMATE! YOU WON!' : '🏆 ŞAH MAT! KAZANDINIZ!') : tr.checkmate,
        subtitle: playerWon
          ? (currentLang === 'en'
              ? `Congratulations! A magnificent victory against ${currentDiffObj.name}!`
              : `Tebrikler, ${currentDiffObj.name} seviyesinde harika bir zafer kazandınız!`)
          : (currentLang === 'en'
              ? `${currentDiffObj.badge} won the game. Try again!`
              : `${currentDiffObj.badge} yapay zeka kazandı. Tekrar deneyin!`),
        won: playerWon,
        stars: starsEarned,
      };

      setGameResult(res);
      setShowGameOverModal(true);

      updateStats((prev) => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: playerWon ? prev.gamesWon + 1 : prev.gamesWon,
        gamesLost: !playerWon ? prev.gamesLost + 1 : prev.gamesLost,
      }));

      const updatedProfile = {
        ...profile,
        stars: profile.stars + starsEarned,
      };
      saveActiveProfile(updatedProfile);
      onProfileUpdated(updatedProfile);
    } else if (
      chessInstance.isDraw() ||
      chessInstance.isStalemate() ||
      chessInstance.isThreefoldRepetition() ||
      chessInstance.isInsufficientMaterial()
    ) {
      sound.playStar();
      const res = {
        title: currentLang === 'en' ? '🤝 DRAW!' : '🤝 BERABERE!',
        subtitle: currentLang === 'en'
          ? 'The game ended in a draw (stalemate or insufficient material).'
          : 'Oyun pat veya yetersiz taş ile berabere bitti.',
        won: false,
        stars: 10,
      };
      setGameResult(res);
      setShowGameOverModal(true);
    }
  };

  const handleAIMove = (currentChess: Chess) => {
    if (currentChess.isGameOver()) return;
    setIsAIThinking(true);

    setTimeout(() => {
      const bestMove = getAIMove(currentChess, difficulty);
      if (bestMove) {
        try {
          const moveRes = currentChess.move(bestMove);
          if (moveRes) {
            setGame(new Chess(currentChess.fen()));
            setLastMove({ from: moveRes.from, to: moveRes.to });
            updateCapturedPieces(currentChess);

            if (moveRes.captured) sound.playCapture();
            else sound.playMove();

            if (currentChess.inCheck()) sound.playCheck();
            checkGameOverStatus(currentChess);
          }
        } catch (e) {
          console.error('AI Move Error:', e);
        }
      }
      setIsAIThinking(false);
    }, 400);
  };

  const makeMove = (from: Square, to: Square, promotion?: string) => {
    try {
      const move = game.move({
        from,
        to,
        promotion: promotion || 'q',
      });

      if (move) {
        sound.playMove();
        if (move.captured) sound.playCapture();
        if (game.inCheck()) sound.playCheck();

        const updatedGame = new Chess(game.fen());
        setGame(updatedGame);
        setLastMove({ from, to });
        setSelectedSquare(null);
        setLegalMoves([]);
        setHintSquare(null);
        updateCapturedPieces(updatedGame);

        if (!updatedGame.isGameOver()) {
          handleAIMove(updatedGame);
        } else {
          checkGameOverStatus(updatedGame);
        }
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const handleSquareClick = (square: Square) => {
    if (isAIThinking || game.isGameOver()) return;
    if (game.turn() !== 'w') return;

    if (selectedSquare) {
      const piece = game.get(selectedSquare as Square);
      const isPromotion =
        piece &&
        piece.type === 'p' &&
        ((piece.color === 'w' && square[1] === '8') ||
          (piece.color === 'b' && square[1] === '1'));

      const isTargetLegal = legalMoves.some((m) => m.to === square);

      if (isPromotion && isTargetLegal) {
        setPendingPromotion({ from: selectedSquare as Square, to: square });
        return;
      }

      const moved = makeMove(selectedSquare as Square, square);
      if (moved) return;
    }

    const clickedPiece = game.get(square);
    if (clickedPiece && clickedPiece.color === game.turn()) {
      sound.playTap();
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handleUndoMove = () => {
    if (isAIThinking) return;
    sound.playTap();
    game.undo(); // Undo AI
    game.undo(); // Undo User
    const updated = new Chess(game.fen());
    setGame(updated);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setHintSquare(null);
    updateCapturedPieces(updated);
  };

  const handleResetGame = () => {
    sound.playTap();
    const newG = new Chess();
    setGame(newG);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setHintSquare(null);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setShowGameOverModal(false);
    setGameResult(null);
  };

  const handleGetHint = () => {
    sound.playTap();
    const hint = getSmartHint(game, currentLang);
    if (hint) {
      setHintSquare({ from: hint.from, to: hint.to, reason: hint.reason });
    }
  };

  const activeFiles = boardFlipped ? [...FILES].reverse() : FILES;
  const activeRanks = boardFlipped ? [...RANKS].reverse() : RANKS;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-between p-2 sm:p-4 select-none">
      {/* Top Header Menu Bar */}
      <div className="w-full max-w-[min(96vw,86vh)] flex items-center justify-between py-2 px-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs mb-1.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playTap();
              onNavigate('WELCOME');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{tr.back}</span>
          </button>

          <h1 className="font-display font-black text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-2">
            <span>{tr.arenaTitle}</span>
            {isAIThinking && (
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-600 animate-pulse bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {tr.aiThinkingText}
              </span>
            )}
          </h1>
        </div>

        {/* Right Side: Stars, Sound Toggle & Controls */}
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
              title={soundEnabled ? 'Mute' : 'Unmute'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={handleGetHint}
            title={tr.showHintBtn}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-amber-600 transition-all cursor-pointer border border-slate-200"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          <button
            onClick={handleUndoMove}
            title={tr.undo}
            disabled={game.history().length === 0 || isAIThinking}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-all cursor-pointer border border-slate-200"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setBoardFlipped(!boardFlipped)}
            title={currentLang === 'en' ? 'Flip Board' : 'Tahtayı Döndür'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer border border-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetGame}
            title={tr.rematch}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 Difficulty Level Selector */}
      <div className="w-full max-w-[min(96vw,86vh)] bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xs flex items-center justify-between gap-1 overflow-x-auto mb-1">
        <div className="flex items-center gap-1 pl-1.5 shrink-0 text-slate-500 text-xs font-bold">
          <Gauge className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">{currentLang === 'en' ? 'Difficulty:' : 'Zorluk:'}</span>
        </div>
        <div className="flex items-center gap-1 flex-1 justify-end">
          {diffLevels.map((diff) => {
            const isSelected = difficulty === diff.id;
            return (
              <button
                key={diff.id}
                onClick={() => {
                  sound.playTap();
                  setDifficulty(diff.id);
                }}
                className={`py-1 px-2 sm:px-2.5 rounded-xl font-display font-bold text-[11px] sm:text-xs transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs scale-102'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title={`${diff.name} (${diff.elo}): ${diff.description}`}
              >
                <span>{diff.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opponent Mini Bar (Top) */}
      <div className="w-full max-w-[min(96vw,86vh)] flex items-center justify-between px-3 py-1 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">
            🤖 {currentLang === 'en' ? 'AI Bot' : 'Yapay Zeka'}: {currentDiffObj.badge} ({currentDiffObj.elo})
          </span>
          {game.turn() === 'b' && !game.isGameOver() && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {capturedWhite.map((pt, i) => (
            <ChessPieceSvg key={i} type={pt} color="w" size={18} theme={activeTheme} />
          ))}
        </div>
      </div>

      {/* Ultra-Large Full Responsive Chessboard */}
      <div className="w-full flex-1 flex items-center justify-center py-1">
        <div
          className="relative w-[min(96vw,76vh)] h-[min(96vw,76vh)] p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl transition-all border-2 flex items-center justify-center"
          style={{
            background: activeTheme.board.border,
            borderColor: activeTheme.board.borderColor,
            boxShadow: '0 20px 35px -10px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.2)',
          }}
        >
          <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden shadow-inner border border-black/10">
            {activeRanks.map((rank, rIdx) =>
              activeFiles.map((file, fIdx) => {
                const sq = `${file}${rank}` as Square;
                const isLight = (rIdx + fIdx) % 2 === 0;
                const piece = game.get(sq);
                const isSelected = selectedSquare === sq;
                const isLastMoveSq = lastMove && (lastMove.from === sq || lastMove.to === sq);
                const isLegalTarget = legalMoves.some((m) => m.to === sq);
                const isHintFrom = hintSquare?.from === sq;
                const isHintTo = hintSquare?.to === sq;

                const isKingInCheck =
                  piece && piece.type === 'k' && piece.color === game.turn() && game.inCheck();

                let bg = isLight ? activeTheme.board.light : activeTheme.board.dark;
                if (isSelected) bg = activeTheme.board.selectedSquare;
                else if (isLastMoveSq) bg = activeTheme.board.lastMove;
                else if (isKingInCheck) bg = activeTheme.board.checkSquare;

                return (
                  <div
                    key={sq}
                    onClick={() => handleSquareClick(sq)}
                    style={{ background: bg }}
                    className="relative flex items-center justify-center cursor-pointer select-none transition-colors duration-100 overflow-hidden"
                  >
                    {/* Rank & File Coordinates */}
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

                    {/* Hint Highlight */}
                    {(isHintFrom || isHintTo) && (
                      <div className="absolute inset-0 bg-yellow-400/40 border-2 border-yellow-500 rounded-xs z-10 pointer-events-none animate-pulse" />
                    )}

                    {/* Chess Piece */}
                    {piece && (
                      <div className="w-full h-full flex items-center justify-center p-0.5 z-10 transition-transform active:scale-95">
                        <ChessPieceSvg
                          type={piece.type}
                          color={piece.color}
                          size={70}
                          className="w-[96%] h-[96%] max-w-[86px] max-h-[86px]"
                          theme={activeTheme}
                          pieceSet={profile.selectedPieceSet}
                        />
                      </div>
                    )}

                    {/* Legal Move Dot */}
                    {isLegalTarget && !piece && (
                      <div
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full z-20 shadow-xs pointer-events-none"
                        style={{ backgroundColor: activeTheme.board.validMoveDot }}
                      />
                    )}

                    {/* Capture Target Ring */}
                    {isLegalTarget && piece && (
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

      {/* User Status Bar (Bottom) */}
      <div className="w-full max-w-[min(96vw,86vh)] flex items-center justify-between px-3 py-1 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">
            👤 {profile.name} ({currentLang === 'en' ? 'White' : 'Beyaz'})
          </span>
          {game.turn() === 'w' && !game.isGameOver() && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {capturedBlack.map((pt, i) => (
            <ChessPieceSvg key={i} type={pt} color="b" size={18} theme={activeTheme} />
          ))}
        </div>
      </div>

      {/* Hint Explanation Toast */}
      {hintSquare?.reason && (
        <div className="w-full max-w-[min(96vw,86vh)] bg-amber-50 border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-amber-900 font-medium flex items-center gap-2 mt-1">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{hintSquare.reason}</span>
        </div>
      )}

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl text-slate-800">
            <h3 className="text-lg font-display font-black text-slate-900">
              👑 {currentLang === 'en' ? 'Pawn Promotion!' : 'Piyon Terfisi!'}
            </h3>
            <p className="text-xs text-slate-600">
              {currentLang === 'en'
                ? 'Choose the piece you want to promote your pawn to:'
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
                  onClick={() => {
                    makeMove(pendingPromotion.from, pendingPromotion.to, item.type);
                    setPendingPromotion(null);
                  }}
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

      {/* Game Over Result Modal */}
      {showGameOverModal && gameResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl text-slate-800 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center text-3xl mx-auto">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>

            <div>
              <h3 className="text-xl font-display font-black text-slate-900">
                {gameResult.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {gameResult.subtitle}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-center gap-2 font-display font-black text-amber-900">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span>+{gameResult.stars} {tr.stars}</span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleResetGame}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{tr.playAgain}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('WELCOME')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-xs transition-all cursor-pointer"
              >
                {tr.backToMenu}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
