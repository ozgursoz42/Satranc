import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Shield, Zap, Star, Volume2, VolumeX } from 'lucide-react';
import { PlayerProfile, ScreenType, PieceType } from '../../types/game';
import { ChessPieceSvg } from '../common/ChessPieceSvg';
import { sound } from '../../utils/sound';
import { getThemeById } from '../../data/themes';
import { Language, getTranslation } from '../../utils/i18n';

interface PieceBookScreenProps {
  profile: PlayerProfile;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

interface PieceInfo {
  key: PieceType;
  name: string;
  nameEn: string;
  points: number;
  title: string;
  titleEn: string;
  movementText: string;
  movementTextEn: string;
  specialRules: string;
  specialRulesEn: string;
  tacticsTip: string;
  tacticsTipEn: string;
  pieceStartSquare: string;
  samplePathSquares: string[];
}

const PIECES_DATA: PieceInfo[] = [
  {
    key: 'p',
    name: 'Piyon',
    nameEn: 'Pawn',
    points: 1,
    title: 'Cesur Piyade',
    titleEn: 'The Brave Foot Soldier',
    movementText: 'Piyonlar daima 1 kare düz ileri yürür. Başlangıç karesinde (2. yatay) dururken isterse 2 kare birden ileri çıkabilir.',
    movementTextEn: 'Pawns march straight forward 1 square at a time. On their first move from the home rank (2nd rank), they can choose to advance 2 squares.',
    specialRules: 'Düşman taşlarını 1 kare ön çaprazından alır. Karşı tarafın son karesine (8. yatay) ulaştığında Vezir, Kale, Fil veya At\'a Terfi eder!',
    specialRulesEn: 'Captures enemy pieces 1 square diagonally forward. Upon reaching the 8th rank, promotes to a Queen, Rook, Bishop, or Knight!',
    tacticsTip: 'Piyon zincirleri oluşturarak merkez kareleri kontrol edin ve rakip taşların sızmasını önleyin.',
    tacticsTipEn: 'Form sturdy pawn chains to control central squares and restrict opponent minor piece mobility.',
    pieceStartSquare: 'd2',
    samplePathSquares: ['d3', 'd4', 'c3', 'e3'],
  },
  {
    key: 'n',
    name: 'At',
    nameEn: 'Knight',
    points: 3,
    title: 'Taktik Zıplayıcısı',
    titleEn: 'The Tactical Leaper',
    movementText: 'At "L" harfi şeklinde hareket eder: 2 kare düz ve 1 kare yana (veya 1 kare düz ve 2 kare yana). Her hamlede bastığı karenin rengi değişir.',
    movementTextEn: 'Moves in an "L" shape: 2 squares in one direction and 1 square perpendicular. It alternates square colors with every single move.',
    specialRules: 'Satrançta başka taşların üzerinden atlayabilen TEK TAŞTIR! Önü kapalı olsa bile hedefine güvenle sıçrar.',
    specialRulesEn: 'The ONLY piece in chess that can jump over other pieces! Blocks and crowded lines cannot impede its movement.',
    tacticsTip: 'At Çatalı (Fork) taktiği ile tek bir hamlede aynı anda rakip Şah ve Vezir\'i tehdit edebilirsiniz.',
    tacticsTipEn: 'Use Knight Forks to attack King and Queen simultaneously in a single devastating blow.',
    pieceStartSquare: 'd4',
    samplePathSquares: ['c6', 'e6', 'f5', 'f3', 'e2', 'c2', 'b3', 'b5'],
  },
  {
    key: 'b',
    name: 'Fil',
    nameEn: 'Bishop',
    points: 3,
    title: 'Çapraz Hatların Hakimi',
    titleEn: 'Master of Diagonals',
    movementText: 'Fil kendi rengindeki çapraz çizgiler boyunca önü açık olduğu sürece sınırsız kare ilerler.',
    movementTextEn: 'Slides diagonally across squares of its own color as far as the path remains unobstructed.',
    specialRules: 'Beyaz karede başlayan fil sadece beyaz karelerde, siyah karede başlayan fil ise sadece siyah karelerde kalır.',
    specialRulesEn: 'Strictly color-bound: light-squared bishops never leave light squares, dark-squared bishops stay on dark squares.',
    tacticsTip: 'İki fil (Fil Çifti) açık pozisyonlarda muazzam bir güç kazanır ve tüm tahtayı kontrol eder.',
    tacticsTipEn: 'The Bishop Pair exerts immense long-range sniper pressure in open endgame positions.',
    pieceStartSquare: 'd4',
    samplePathSquares: ['a1', 'b2', 'c3', 'e5', 'f6', 'g7', 'h8', 'g1', 'f2', 'e3', 'c5', 'b6', 'a7'],
  },
  {
    key: 'r',
    name: 'Kale',
    nameEn: 'Rook',
    points: 5,
    title: 'Açık Hat Fırtınası',
    titleEn: 'The Open File Tempest',
    movementText: 'Kale yatay ve dikey düz doğrultularda önü açık olduğu sürece istediği kadar kare ilerler.',
    movementTextEn: 'Moves horizontally along ranks and vertically along files as far as the lane remains open.',
    specialRules: 'Şah ile birlikte tek hamlede "Rok" yapabilir. Bu hamle şahı köşeye saklar ve kaleyi merkeze getirir.',
    specialRulesEn: 'Can execute Castling together with the King, securing the King in safety while mobilizing the Rook to the center.',
    tacticsTip: 'Kaleleri açık hatlara (önünde kendi piyonu olmayan dikey hatlar) yerleştirmek çok avantajlıdır.',
    tacticsTipEn: 'Place rooks on open and semi-open files to penetrate into the 7th rank for maximum endgame advantage.',
    pieceStartSquare: 'd4',
    samplePathSquares: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'],
  },
  {
    key: 'q',
    name: 'Vezir',
    nameEn: 'Queen',
    points: 9,
    title: 'Tahtanın En Güçlü Taşı',
    titleEn: 'Supreme Ruler of the Board',
    movementText: 'Vezir hem Kalenin (düz) hem de Filin (çapraz) hareket yeteneklerini birleştirir. 8 yöne sınırsızca kayar.',
    movementTextEn: 'Combines the power of the Rook (orthogonal) and Bishop (diagonal), gliding in 8 directions across open lines.',
    specialRules: '9 puan değeriyle şahtan sonraki en değerli taştır. Taşların üzerinden atlayamaz.',
    specialRulesEn: 'Valued at 9 points, it is the most formidable attacking piece. It cannot leap over pieces.',
    tacticsTip: 'Veziri oyunun hemen başında çok erken oyuna sokmamak tavsiye edilir, aksi halde rakip hafif taşlar tarafından kovalanabilir.',
    tacticsTipEn: 'Avoid developing the Queen too prematurely in the opening to prevent opponent minor pieces from gaining tempos.',
    pieceStartSquare: 'd4',
    samplePathSquares: ['d1', 'd8', 'a4', 'h4', 'a1', 'h8', 'a7', 'g1', 'b2', 'f6', 'b6', 'f2'],
  },
  {
    key: 'k',
    name: 'Şah',
    nameEn: 'King',
    points: 1000,
    title: 'Ordunun Kalbi',
    titleEn: 'The Crown & Monarch',
    movementText: 'Şah her yöne (düz veya çapraz) sadece 1 kare adım atabilir.',
    movementTextEn: 'Steps exactly 1 square in any direction (orthogonal or diagonal).',
    specialRules: 'Şah asla tehdit altındaki (şah çekilen) bir kareye basamaz. Şah mat edildiğinde oyun biter.',
    specialRulesEn: 'Can never step into check. When checkmated with no legal escape squares, the game concludes.',
    tacticsTip: 'Oyun sonunda taşlar azaldığında Şah merkezileşmeli ve piyon terfilerini desteklemelidir.',
    tacticsTipEn: 'In endgames with fewer pieces, activate and centralize your King to guide pawn promotions.',
    pieceStartSquare: 'd4',
    samplePathSquares: ['c3', 'd3', 'e3', 'c4', 'e4', 'c5', 'd5', 'e5'],
  },
];

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const PieceBookScreen: React.FC<PieceBookScreenProps> = ({
  profile,
  soundEnabled = true,
  onToggleSound,
  onBack,
}) => {
  const currentLang: Language = profile.language || 'tr';
  const tr = getTranslation(currentLang);
  const activeTheme = getThemeById(profile.selectedTheme || 'classic_wood', currentLang);

  const [selectedPieceKey, setSelectedPieceKey] = useState<PieceType>('p');
  const pieceInfo = PIECES_DATA.find((p) => p.key === selectedPieceKey) || PIECES_DATA[0];

  const pieceName = currentLang === 'en' ? pieceInfo.nameEn : pieceInfo.name;
  const pieceTitle = currentLang === 'en' ? pieceInfo.titleEn : pieceInfo.title;
  const pieceMovement = currentLang === 'en' ? pieceInfo.movementTextEn : pieceInfo.movementText;
  const pieceRules = currentLang === 'en' ? pieceInfo.specialRulesEn : pieceInfo.specialRules;
  const pieceTactics = currentLang === 'en' ? pieceInfo.tacticsTipEn : pieceInfo.tacticsTip;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-3 sm:p-6 select-none">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header Card */}
        <div className="flex items-center justify-between bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playTap();
                onBack();
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 transition-all cursor-pointer shadow-xs"
              title={tr.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-display font-black text-slate-900">
                {tr.pieceBookTitle}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {tr.pieceBookSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-xl font-display font-bold text-xs">
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
          </div>
        </div>

        {/* Piece Selection Tabs */}
        <div className="grid grid-cols-6 gap-2">
          {PIECES_DATA.map((p) => {
            const isSelected = p.key === selectedPieceKey;
            const pName = currentLang === 'en' ? p.nameEn : p.name;
            return (
              <button
                key={p.key}
                onClick={() => {
                  sound.playTap();
                  setSelectedPieceKey(p.key);
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50 border-amber-500 shadow-md scale-105'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <ChessPieceSvg type={p.key} color="b" size={36} theme={activeTheme} pieceSet={profile.selectedPieceSet} />
                <span className="font-display font-bold text-xs text-slate-900">{pName}</span>
                <span className="text-[10px] text-amber-700 font-mono font-bold">
                  {p.points === 1000 ? (currentLang === 'en' ? '👑 King' : '👑 Şah') : `${p.points} ${tr.points}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Piece Detail Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Lore & Rules */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 shadow-inner">
                  <ChessPieceSvg type={pieceInfo.key} color="b" size={40} theme={activeTheme} pieceSet={profile.selectedPieceSet} />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    {pieceTitle}
                  </div>
                  <h2 className="text-xl font-display font-black text-slate-900">
                    {pieceName}
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">{tr.pieceValue}</span>
                <span className="text-base font-display font-black text-amber-700">
                  {pieceInfo.points === 1000 ? (currentLang === 'en' ? 'Priceless (King)' : 'Paha Biçilemez') : `${pieceInfo.points} ${tr.points}`}
                </span>
              </div>
            </div>

            {/* Movement Description */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>{tr.pieceMovementTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {pieceMovement}
              </p>
            </div>

            {/* Special Rules */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase">
                <Shield className="w-3.5 h-3.5 text-sky-600" />
                <span>{tr.specialRulesTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {pieceRules}
              </p>
            </div>

            {/* Tactical Tip */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{tr.tacticsTipTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                {pieceTactics}
              </p>
            </div>
          </div>

          {/* Right: Interactive 8x8 Trajectory Demonstration */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col items-center justify-between space-y-3">
            <div className="w-full text-center">
              <h3 className="font-display font-bold text-sm text-slate-900">
                {tr.interactiveDemoTitle}
              </h3>
              <p className="text-[11px] text-slate-500">
                {tr.interactiveDemoDesc}
              </p>
            </div>

            {/* Demonstration Mini Chessboard */}
            <div
              className="w-full aspect-square max-w-[280px] p-2 rounded-2xl border-2 shadow-inner grid grid-cols-8 grid-rows-8"
              style={{
                background: activeTheme.board.border,
                borderColor: activeTheme.board.borderColor,
              }}
            >
              {RANKS.map((rank, rIdx) =>
                FILES.map((file, fIdx) => {
                  const sq = `${file}${rank}`;
                  const isLight = (rIdx + fIdx) % 2 === 0;
                  const isPieceSq = sq === pieceInfo.pieceStartSquare;
                  const isTargetMove = pieceInfo.samplePathSquares.includes(sq);

                  let bg = isLight ? activeTheme.board.light : activeTheme.board.dark;

                  return (
                    <div
                      key={sq}
                      style={{ background: bg }}
                      className="relative flex items-center justify-center select-none"
                    >
                      {isPieceSq && (
                        <ChessPieceSvg
                          type={pieceInfo.key}
                          color="w"
                          size={26}
                          theme={activeTheme}
                          pieceSet={profile.selectedPieceSet}
                        />
                      )}

                      {isTargetMove && (
                        <div
                          className="w-3 h-3 rounded-full shadow-xs animate-pulse"
                          style={{ backgroundColor: activeTheme.board.validMoveDot }}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-[11px] font-bold text-slate-500 text-center">
              {currentLang === 'en'
                ? `Standard movement simulation for ${pieceName}.`
                : `${pieceName} taşının standart hareket simülasyonu.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
