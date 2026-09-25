import { Chess, Square, Move } from 'chess.js';
import { AIDifficulty } from '../types/game';
import { Language } from './i18n';

// Piece value mapping
export const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece Square Tables for positional intelligence
const PAWN_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0,
];

const KNIGHT_PST = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_PST = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

export function evaluateBoard(chess: Chess): number {
  let score = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      let pieceVal = PIECE_VALUES[piece.type] || 0;
      let posVal = 0;
      const squareIndex = r * 8 + c;

      if (piece.type === 'p') {
        posVal = piece.color === 'w' ? PAWN_PST[squareIndex] : PAWN_PST[63 - squareIndex];
      } else if (piece.type === 'n') {
        posVal = piece.color === 'w' ? KNIGHT_PST[squareIndex] : KNIGHT_PST[63 - squareIndex];
      } else if (piece.type === 'b') {
        posVal = piece.color === 'w' ? BISHOP_PST[squareIndex] : BISHOP_PST[63 - squareIndex];
      }

      const totalVal = pieceVal + posVal;
      score += piece.color === 'w' ? totalVal : -totalVal;
    }
  }

  return score;
}

// Alpha-Beta Minimax Engine
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): { score: number; bestMove?: Move } {
  if (depth === 0 || chess.isGameOver()) {
    if (chess.isCheckmate()) {
      return { score: isMaximizing ? -99999 + (5 - depth) : 99999 - (5 - depth) };
    }
    if (chess.isDraw()) {
      return { score: 0 };
    }
    return { score: evaluateBoard(chess) };
  }

  const moves = chess.moves({ verbose: true });
  moves.sort((a, b) => {
    let scoreA = a.captured ? PIECE_VALUES[a.captured] || 100 : 0;
    let scoreB = b.captured ? PIECE_VALUES[b.captured] || 100 : 0;
    if (a.san.includes('+')) scoreA += 50;
    if (b.san.includes('+')) scoreB += 50;
    return scoreB - scoreA;
  });

  let bestMove: Move | undefined;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalObj = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();

      if (evalObj.score > maxEval) {
        maxEval = evalObj.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalObj.score);
      if (beta <= alpha) break;
    }
    return { score: maxEval, bestMove };
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalObj = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();

      if (evalObj.score < minEval) {
        minEval = evalObj.score;
        bestMove = move;
      }
      beta = Math.min(beta, evalObj.score);
      if (beta <= alpha) break;
    }
    return { score: minEval, bestMove };
  }
}

export interface DifficultyConfig {
  id: AIDifficulty;
  name: string;
  nameEn?: string;
  badge: string;
  badgeEn?: string;
  color: string;
  elo: string;
  description: string;
  descriptionEn?: string;
}

export const DIFFICULTY_LEVELS: DifficultyConfig[] = [
  {
    id: 'very_easy',
    name: '1. Çok Kolay',
    nameEn: '1. Very Easy',
    badge: '🐣 Acemi',
    badgeEn: '🐣 Novice',
    color: 'emerald',
    elo: '400 ELO',
    description: 'Yeni başlayanlar için bol hatalı ve eğlenceli hamleler.',
    descriptionEn: 'Gentle and playful moves, perfect for beginners learning the rules.',
  },
  {
    id: 'easy',
    name: '2. Kolay',
    nameEn: '2. Easy',
    badge: '🌱 Çaylak',
    badgeEn: '🌱 Rookie',
    color: 'teal',
    elo: '750 ELO',
    description: 'Basit taş alışlarını görür ama taktikleri kaçırır.',
    descriptionEn: 'Sees obvious piece captures but overlooks deeper tactics.',
  },
  {
    id: 'medium',
    name: '3. Orta',
    nameEn: '3. Medium',
    badge: '⚔️ Kulüp',
    badgeEn: '⚔️ Club',
    color: 'amber',
    elo: '1100 ELO',
    description: 'Merkezi kontrol eder ve taşlarını korumaya çalışır.',
    descriptionEn: 'Controls key central squares and maintains solid defense.',
  },
  {
    id: 'hard',
    name: '4. Zor',
    nameEn: '4. Hard',
    badge: '🛡️ Usta',
    badgeEn: '🛡️ Expert',
    color: 'rose',
    elo: '1450 ELO',
    description: 'Taktik tuzaklar kurar ve hamleleri önceden hesaplar.',
    descriptionEn: 'Sets tactical forks, pins, and calculates deep candidate moves.',
  },
  {
    id: 'very_hard',
    name: '5. Çok Zor',
    nameEn: '5. Grandmaster',
    badge: '👑 Büyükusta',
    badgeEn: '👑 Grandmaster',
    color: 'purple',
    elo: '1800+ ELO',
    description: 'En yüksek yapay zeka derinliği, hatasız ve agresif oyun!',
    descriptionEn: 'Deep alpha-beta search with aggressive grandmaster precision!',
  },
];

export function getDifficultyLevels(lang: Language = 'tr'): DifficultyConfig[] {
  if (lang === 'en') {
    return DIFFICULTY_LEVELS.map((d) => ({
      ...d,
      name: d.nameEn || d.name,
      badge: d.badgeEn || d.badge,
      description: d.descriptionEn || d.description,
    }));
  }
  return DIFFICULTY_LEVELS;
}

export function getAIMove(
  chess: Chess,
  difficulty: AIDifficulty | 'easy' | 'medium' | 'hard' = 'medium'
): Move | null {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  const isWhite = chess.turn() === 'w';

  // 1. Çok Kolay
  if (difficulty === 'very_easy') {
    const captures = moves.filter((m) => m.captured);
    if (captures.length > 0 && Math.random() < 0.15) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // 2. Kolay
  if (difficulty === 'easy') {
    const captures = moves.filter((m) => m.captured);
    if (captures.length > 0 && Math.random() < 0.5) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // 3. Orta
  if (difficulty === 'medium') {
    let bestMoves: Move[] = [];
    let bestVal = isWhite ? -Infinity : Infinity;

    for (const move of moves) {
      chess.move(move);
      let val = evaluateBoard(chess);
      val += (Math.random() - 0.5) * 35;
      chess.undo();

      if (isWhite) {
        if (val > bestVal) {
          bestVal = val;
          bestMoves = [move];
        } else if (Math.abs(val - bestVal) < 15) {
          bestMoves.push(move);
        }
      } else {
        if (val < bestVal) {
          bestVal = val;
          bestMoves = [move];
        } else if (Math.abs(val - bestVal) < 15) {
          bestMoves.push(move);
        }
      }
    }
    return bestMoves[Math.floor(Math.random() * bestMoves.length)] || moves[0];
  }

  // 4. Zor
  if (difficulty === 'hard') {
    const depth = moves.length > 30 ? 2 : 3;
    const result = minimax(chess, depth, -Infinity, Infinity, isWhite);
    return result.bestMove || moves[Math.floor(Math.random() * moves.length)];
  }

  // 5. Çok Zor (Büyükusta)
  for (const move of moves) {
    chess.move(move);
    if (chess.isCheckmate()) {
      chess.undo();
      return move;
    }
    chess.undo();
  }

  const depth = moves.length > 25 ? 3 : 4;
  const result = minimax(chess, depth, -Infinity, Infinity, isWhite);
  return result.bestMove || moves[0];
}

// Generate smart kid-friendly tactical hint
export function getSmartHint(chess: Chess, lang: Language = 'tr'): { from: string; to: string; reason: string } | null {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  const isWhite = chess.turn() === 'w';
  const result = minimax(chess, 2, -Infinity, Infinity, isWhite);
  const bestMove = result.bestMove || moves[0];

  if (!bestMove) return null;

  let reason = lang === 'en' ? 'This move improves piece activity!' : 'Bu hamle taşının konumunu güçlendirir!';
  if (bestMove.captured) {
    const capturedName = getPieceName(bestMove.captured, lang);
    reason = lang === 'en'
      ? `You can capture the enemy ${capturedName} to win material!`
      : `Rakibin ${capturedName} taşını alarak puan kazanabilirsin!`;
  } else if (bestMove.san.includes('+')) {
    reason = lang === 'en'
      ? 'Deliver CHECK to attack the enemy King and exert pressure!'
      : 'Rakip şaha saldırı (ŞAH!) yaparak baskı kurabilirsin!';
  } else if (bestMove.piece === 'p' && (bestMove.to === 'e4' || bestMove.to === 'd4' || bestMove.to === 'e5' || bestMove.to === 'd5')) {
    reason = lang === 'en'
      ? 'Controlling center squares grants significant spatial dominance!'
      : 'Merkez kareleri ele geçirmek oyunda büyük üstünlük sağlar!';
  } else if (bestMove.piece === 'n' || bestMove.piece === 'b') {
    reason = lang === 'en'
      ? 'Develop your minor pieces early towards active squares!'
      : 'Taşlarını erkenden oyuna çıkarıp savaşa hazırla!';
  } else if (bestMove.san === 'O-O' || bestMove.san === 'O-O-O') {
    reason = lang === 'en'
      ? 'Castle to tuck your King safely away and activate your Rook!'
      : 'Rok yaparak şahını güvene al ve kaleni oyuna sok!';
  }

  return {
    from: bestMove.from,
    to: bestMove.to,
    reason,
  };
}

export function getPieceName(type: string, lang: Language = 'tr'): string {
  if (lang === 'en') {
    switch (type.toLowerCase()) {
      case 'p': return 'Pawn';
      case 'n': return 'Knight';
      case 'b': return 'Bishop';
      case 'r': return 'Rook';
      case 'q': return 'Queen';
      case 'k': return 'King';
      default: return 'Piece';
    }
  }
  switch (type.toLowerCase()) {
    case 'p': return 'Piyon';
    case 'n': return 'At';
    case 'b': return 'Fil';
    case 'r': return 'Kale';
    case 'q': return 'Vezir';
    case 'k': return 'Şah';
    default: return 'Taş';
  }
}

export const getPieceTurkishName = (type: string) => getPieceName(type, 'tr');
