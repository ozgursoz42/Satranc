export type ScreenType =
  | 'WELCOME'
  | 'LESSONS'
  | 'MISSION'
  | 'QUIZ'
  | 'ARENA'
  | 'PIECES'
  | 'ACHIEVEMENTS'
  | 'STATS'
  | 'SETTINGS'
  | 'PROFILE_SETUP'
  | 'PUZZLES';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export type AIDifficulty = 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  stars: number;
  selectedTheme: string; // Theme ID, e.g. 'classic_wood', 'emerald', etc.
  selectedPieceSet?: string; // Piece Font Set ID, e.g. 'standard_serif', 'royal_antique', etc.
  language?: 'tr' | 'en';
  unlockedLessonIndex: number; // 0 to 6
  lessonProgress: Record<string, number>; // e.g. { 'pawn': 100, 'knight': 60 }
  completedMissions: Record<string, number>; // missionId -> stars earned (1-3)
  unlockedBadges: string[];
  createdAt: number;
  lastDailyQuestDate?: string;
  dailyQuestClaimed?: boolean;
}

export interface GameSettings {
  language: 'tr' | 'en';
  soundEnabled: boolean;
  musicEnabled: boolean;
  voiceEnabled: boolean;
  animationsEnabled: boolean;
  boardTheme: string;
  highlightMoves: boolean;
  showCoordinates: boolean;
  autoQueen: boolean;
}

export interface LessonModule {
  id: string;
  name: string;
  title: string;
  icon: string;
  pieceKey: PieceType | 'tactics';
  description: string;
  color: string;
  bgGradient: string;
  badgeId: string;
  badgeName: string;
  missions: MissionData[];
  quiz: QuizQuestion[];
}

export interface MissionData {
  id: string;
  title: string;
  instruction: string;
  pikoSpeech: string;
  hint: string;
  boardSetup: {
    piece: { type: PieceType; color: PieceColor; startSquare: string };
    targets: string[]; // squares to reach or capture
    obstacles?: string[]; // blocked squares
    enemyPieces?: { type: PieceType; color: PieceColor; square: string }[];
    boardSize?: number; // 8x8 default
  };
  goalType: 'reach_square' | 'capture_all' | 'promote' | 'escape_check' | 'checkmate';
  maxMoves?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  pikoHelp: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardStars: number;
  isClaimed: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  totalMovesMade: number;
  totalPuzzlesSolved: number;
  totalHintsUsed: number;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface OnlineRoomState {
  roomCode: string;
  playerWhite?: { id: string; name: string; avatar: string };
  playerBlack?: { id: string; name: string; avatar: string };
  fen: string;
  turn: 'w' | 'b';
  history: string[];
  isGameOver: boolean;
  resultMessage?: string;
  messages: ChatMessage[];
}
