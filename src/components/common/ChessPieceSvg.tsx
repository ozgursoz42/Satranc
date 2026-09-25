import React from 'react';
import { PieceType, PieceColor } from '../../types/game';
import { ChessTheme, getThemeById } from '../../data/themes';
import { PieceFontSet, getPieceFontSetById } from '../../data/pieceSets';

interface ChessPieceSvgProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
  size?: number;
  theme?: ChessTheme | string;
  pieceSet?: PieceFontSet | string;
}

/**
 * Standard Unicode Chess Characters embedded in fonts:
 * Piyon:  ♟ (Siyah) / ♙ (Beyaz)
 * Kale:   ♜ (Siyah) / ♖ (Beyaz)
 * At:     ♞ (Siyah) / ♘ (Beyaz)
 * Fil:    ♝ (Siyah) / ♗ (Beyaz)
 * Vezir:  ♛ (Siyah) / ♕ (Beyaz)
 * Şah:    ♚ (Siyah) / ♔ (Beyaz)
 */
export const SOLID_UNICODE_PIECES: Record<PieceType, string> = {
  p: '♟',
  r: '♜',
  n: '♞',
  b: '♝',
  q: '♛',
  k: '♚',
};

export const OUTLINE_UNICODE_PIECES: Record<PieceType, string> = {
  p: '♙',
  r: '♖',
  n: '♘',
  b: '♗',
  q: '♕',
  k: '♔',
};

export const ChessPieceSvg: React.FC<ChessPieceSvgProps> = ({
  type,
  color,
  className = '',
  size = 48,
  theme,
  pieceSet,
}) => {
  const activeTheme: ChessTheme =
    typeof theme === 'string'
      ? getThemeById(theme)
      : theme || getThemeById('classic_wood');

  const activeFontSet: PieceFontSet =
    typeof pieceSet === 'string'
      ? getPieceFontSetById(pieceSet)
      : pieceSet || getPieceFontSetById('standard_serif');

  const isWhite = color === 'w';
  const solidChar = SOLID_UNICODE_PIECES[type] || '♟';
  const outlineChar = OUTLINE_UNICODE_PIECES[type] || '♙';

  const whiteFill = '#ffffff';
  const blackFill = activeTheme.pieces.blackFill || '#111827';
  const strokeColor = '#1e293b';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      className={`inline-block select-none transition-transform duration-100 ${className}`}
      style={{
        overflow: 'visible',
      }}
    >
      {isWhite ? (
        <g>
          {/* Mat, Düz ve Net Dolgulu Beyaz Gövde (Parlama ve ışıltı katmanları tamamen kaldırıldı) */}
          <text
            x="21"
            y="22.5"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="44"
            fontFamily={activeFontSet.fontFamily}
            fontWeight={activeFontSet.fontWeight || 'normal'}
            fill={whiteFill}
            stroke={strokeColor}
            strokeWidth="1.1"
            paintOrder="stroke fill"
            style={{
              userSelect: 'none',
              pointerEvents: 'none',
              textRendering: 'geometricPrecision',
            }}
          >
            {solidChar}
          </text>

          {/* İç detay hatları */}
          <text
            x="21"
            y="22.5"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="44"
            fontFamily={activeFontSet.fontFamily}
            fontWeight={activeFontSet.fontWeight || 'normal'}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="0.5"
            strokeOpacity="0.4"
            paintOrder="stroke"
            style={{
              userSelect: 'none',
              pointerEvents: 'none',
              textRendering: 'geometricPrecision',
            }}
          >
            {outlineChar}
          </text>
        </g>
      ) : (
        /* Mat Siyah Taş - Keskin, net ve gölgesiz */
        <text
          x="21"
          y="22.5"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="44"
          fontFamily={activeFontSet.fontFamily}
          fontWeight={activeFontSet.fontWeight || 'normal'}
          fill={blackFill}
          style={{
            userSelect: 'none',
            pointerEvents: 'none',
            textRendering: 'geometricPrecision',
          }}
        >
          {solidChar}
        </text>
      )}
    </svg>
  );
};
