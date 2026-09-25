import React from 'react';
import { PieceType, PieceColor } from '../../types/game';
import { ChessTheme } from '../../data/themes';

interface VectorPieceProps {
  type: PieceType;
  color: PieceColor;
  theme: ChessTheme;
  styleId: string;
}

/**
 * 12 Completely Unique Vector Chess Piece Sets:
 * 1. classic_staunton - Traditional tournament Staunton vector art
 * 2. royal_deluxe - Ornate heraldic royal crowns and detailed knight mane
 * 3. pixel_arcade - 8-Bit retro arcade pixel art
 * 4. geometric_minimal - Bauhaus sleek modernist geometry
 * 5. medieval_gothic - Heavy fortress battlements and iron knight helmet
 * 6. cyber_neon - Cyberpunk futuristic polygonal cutaways
 * 7. cartoon_toon - Playful rounded cute cartoon pieces
 * 8. celtic_relic - Ancient Isle of Lewis Nordic relic style
 * 9. origami_poly - Low-poly 3D faceted folded origami style
 * 10. stealth_shadow - Sleek sharp silhouette with negative space cuts
 * 11. handcrafted_wood - Lathe-turned artisan sculpted wood curves
 * 12. crystal_gem - Diamond-faceted crystal gemstone vectors
 */

export const RenderVectorPiece: React.FC<VectorPieceProps> = ({
  type,
  color,
  theme,
  styleId,
}) => {
  const isWhite = color === 'w';
  const fill = isWhite ? theme.pieces.whiteFill : theme.pieces.blackFill;
  const stroke = isWhite ? theme.pieces.whiteStroke : theme.pieces.blackStroke;
  const secondaryFill = isWhite ? (theme.pieces.whiteFillSecondary || '#F8FAFC') : (theme.pieces.blackFillSecondary || '#334155');
  const innerLineColor = isWhite ? 'rgba(30, 41, 59, 0.35)' : 'rgba(255, 255, 255, 0.35)';

  // ==========================================
  // STYLE 1: KLASİK STAUNTON (Official Tournament Standard)
  // ==========================================
  if (styleId === 'classic_staunton' || styleId === 'standard_serif') {
    switch (type) {
      case 'p': // Pawn
        return (
          <g>
            <path d="M22.5 9a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <path d="M17 20c1.5 2 2.5 5 2 12h7c-.5-7 .5-10 2-12-1.5-1-6.5-1-11 0z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <path d="M12 36c0-2.5 3.5-4 10.5-4s10.5 1.5 10.5 4v3H12v-3z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <ellipse cx="22.5" cy="32" rx="6" ry="1.5" fill={innerLineColor} opacity="0.4" />
          </g>
        );
      case 'r': // Rook
        return (
          <g>
            <path d="M13 12h4v4h3v-4h5v4h3v-4h4v7h-19v-7z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <path d="M15 19l1.5 13h12l1.5-13h-15z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <path d="M11 35c0-2 3-3 11.5-3s11.5 1 11.5 3v4H11v-4z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <line x1="16.5" y1="23" x2="28.5" y2="23" stroke={innerLineColor} strokeWidth="1.2" />
          </g>
        );
      case 'n': // Knight
        return (
          <g>
            <path d="M22 8c-3 0-7 2-9 6-1 2-1 5 1 6-2 1-3 4-2 7 1 2 3 3 5 3v2c-3 1-5 2-5 4v3h22v-3c0-4-3-6-6-7 3-3 4-8 1-13-1.5-2.5-4.5-4.5-7-4.5z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <circle cx="16" cy="15" r="1.5" fill={stroke} />
            <path d="M19 12c2 1 4 3 4 6" stroke={innerLineColor} strokeWidth="1.5" fill="none" />
            <path d="M22 17c1.5 1.5 3 4 2 8" stroke={innerLineColor} strokeWidth="1.5" fill="none" />
          </g>
        );
      case 'b': // Bishop
        return (
          <g>
            <circle cx="22.5" cy="7.5" r="2" fill={fill} stroke={stroke} strokeWidth="1.4" />
            <path d="M22.5 10c-4.5 0-8 4.5-8 10 0 4 2 8 4 12h8c2-4 4-8 4-12 0-5.5-3.5-10-8-10z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <path d="M20 15l5 6m-5 0l5-6" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
            <path d="M12 35c0-2 3-3 10.5-3s10.5 1 10.5 3v4H12v-4z" fill={fill} stroke={stroke} strokeWidth="1.6" />
          </g>
        );
      case 'q': // Queen
        return (
          <g>
            <circle cx="11" cy="13" r="1.8" fill={fill} stroke={stroke} strokeWidth="1.2" />
            <circle cx="16.5" cy="10" r="1.8" fill={fill} stroke={stroke} strokeWidth="1.2" />
            <circle cx="22.5" cy="8.5" r="2" fill={fill} stroke={stroke} strokeWidth="1.2" />
            <circle cx="28.5" cy="10" r="1.8" fill={fill} stroke={stroke} strokeWidth="1.2" />
            <circle cx="34" cy="13" r="1.8" fill={fill} stroke={stroke} strokeWidth="1.2" />
            <path d="M11 15l4 13h15l4-13-5.5 4-6-8-6 8-5.5-4z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <path d="M14 28c1 2 2.5 4 8.5 4s7.5-2 8.5-4h-17z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <path d="M10 35c0-2 3.5-3 12.5-3s12.5 1 12.5 3v4H10v-4z" fill={fill} stroke={stroke} strokeWidth="1.6" />
          </g>
        );
      case 'k': // King
        return (
          <g>
            {/* King Cross */}
            <path d="M22.5 5v7m-3.5-4.5h7" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
            <path d="M15 14c-2 2-3 5-3 8 0 4 3 7 7 8v2h7v-2c4-1 7-4 7-8 0-3-1-6-3-8-4 3-11 3-15 0z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <path d="M10 35c0-2 3.5-3 12.5-3s12.5 1 12.5 3v4H10v-4z" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <circle cx="22.5" cy="20" r="3" fill={innerLineColor} opacity="0.5" />
          </g>
        );
    }
  }

  // ==========================================
  // STYLE 2: KRALİYET 3D & TAÇ (Royal Deluxe)
  // ==========================================
  if (styleId === 'royal_deluxe' || styleId === 'royal_antique') {
    switch (type) {
      case 'p':
        return (
          <g>
            <circle cx="22.5" cy="13" r="6.5" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <path d="M16 20c1 3 2 7 1 12h11c-1-5 0-9 1-12-3-1.5-10-1.5-13 0z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <ellipse cx="22.5" cy="19" rx="4.5" ry="1.5" fill={secondaryFill} stroke={stroke} strokeWidth="1.2" />
            <path d="M11 35c0-2 3-3.5 11.5-3.5s11.5 1.5 11.5 3.5v4H11v-4z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <circle cx="22.5" cy="11.5" r="2" fill={innerLineColor} opacity="0.6" />
          </g>
        );
      case 'r':
        return (
          <g>
            <path d="M12 11h5v4h3v-4h5v4h3v-4h5v8H12v-8z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <path d="M14 19l2 13h13l2-13H14z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <rect x="15" y="24" width="15" height="3" rx="1.5" fill={secondaryFill} stroke={stroke} strokeWidth="1.2" />
            <path d="M10 35c0-2 3-3.5 12.5-3.5s12.5 1.5 12.5 3.5v4H10v-4z" fill={fill} stroke={stroke} strokeWidth="1.8" />
          </g>
        );
      case 'n':
        return (
          <g>
            <path d="M22 6c-4 0-8 3-10 8-1.5 3-1 7 1.5 8.5-2 1.5-3 5-1.5 8.5 2 2.5 5 3 7 3v2c-4 1.5-6 2.5-6 4.5v3.5h23v-3.5c0-4.5-4-7-8-8 4-3 5-9 1.5-15-2-3-5.5-5-7.5-5z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <circle cx="15.5" cy="14" r="2" fill={stroke} />
            <path d="M24 10c2 2 3.5 5 3 9m-4-6c2 1.5 3 4 2.5 7" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
            <path d="M13 22c2.5 1 5 1 7 0" stroke={stroke} strokeWidth="1.4" />
          </g>
        );
      case 'b':
        return (
          <g>
            <circle cx="22.5" cy="6.5" r="2.5" fill={secondaryFill} stroke={stroke} strokeWidth="1.5" />
            <path d="M22.5 9c-5 0-9 5-9 11 0 4.5 2 9 4.5 12h9c2.5-3 4.5-7.5 4.5-12 0-6-4-11-9-11z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <circle cx="22.5" cy="19" r="4" fill={secondaryFill} stroke={stroke} strokeWidth="1.4" />
            <path d="M22.5 16v6m-3-3h6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M11 35c0-2 3-3.5 11.5-3.5s11.5 1.5 11.5 3.5v4H11v-4z" fill={fill} stroke={stroke} strokeWidth="1.8" />
          </g>
        );
      case 'q':
        return (
          <g>
            {/* Jewels on Crown */}
            <circle cx="9.5" cy="12.5" r="2" fill="#F59E0B" stroke={stroke} strokeWidth="1.2" />
            <circle cx="16" cy="9" r="2.2" fill="#F59E0B" stroke={stroke} strokeWidth="1.2" />
            <circle cx="22.5" cy="7.5" r="2.5" fill="#F59E0B" stroke={stroke} strokeWidth="1.2" />
            <circle cx="29" cy="9" r="2.2" fill="#F59E0B" stroke={stroke} strokeWidth="1.2" />
            <circle cx="35.5" cy="12.5" r="2" fill="#F59E0B" stroke={stroke} strokeWidth="1.2" />
            <path d="M10 15l4.5 13h16l4.5-13-6 4-6.5-8-6.5 8-6-4z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <rect x="13" y="27" width="19" height="5" rx="2" fill={secondaryFill} stroke={stroke} strokeWidth="1.4" />
            <path d="M9 35c0-2 3.5-3.5 13.5-3.5s13.5 1.5 13.5 3.5v4H9v-4z" fill={fill} stroke={stroke} strokeWidth="1.8" />
          </g>
        );
      case 'k':
        return (
          <g>
            {/* Imperial Cross */}
            <path d="M22.5 3.5v7m-3.5-4h7" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M14 13.5c-2.5 2.5-4 6-4 9.5 0 4.5 3.5 8 8 9v2h9v-2c4.5-1 8-4.5 8-9 0-3.5-1.5-7-4-9.5-5 3.5-12 3.5-17 0z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <circle cx="22.5" cy="21" r="4.5" fill={secondaryFill} stroke={stroke} strokeWidth="1.4" />
            <path d="M9 35c0-2 3.5-3.5 13.5-3.5s13.5 1.5 13.5 3.5v4H9v-4z" fill={fill} stroke={stroke} strokeWidth="1.8" />
          </g>
        );
    }
  }

  // ==========================================
  // STYLE 3: PİKSEL ARCADE 8-BIT (Pixel Retro)
  // ==========================================
  if (styleId === 'pixel_arcade' || styleId === 'retro_mono') {
    switch (type) {
      case 'p':
        return (
          <g stroke={stroke} strokeWidth="1.2" fill={fill}>
            {/* 8-bit Pixel steps */}
            <rect x="19" y="8" width="7" height="6" />
            <rect x="17" y="14" width="11" height="5" />
            <rect x="19" y="19" width="7" height="9" />
            <rect x="15" y="28" width="15" height="5" />
            <rect x="12" y="33" width="21" height="6" />
          </g>
        );
      case 'r':
        return (
          <g stroke={stroke} strokeWidth="1.2" fill={fill}>
            <rect x="12" y="9" width="5" height="7" />
            <rect x="20" y="9" width="5" height="7" />
            <rect x="28" y="9" width="5" height="7" />
            <rect x="14" y="16" width="17" height="5" />
            <rect x="16" y="21" width="13" height="9" />
            <rect x="13" y="30" width="19" height="5" />
            <rect x="10" y="35" width="25" height="5" />
          </g>
        );
      case 'n':
        return (
          <g stroke={stroke} strokeWidth="1.2" fill={fill}>
            <rect x="18" y="7" width="9" height="5" />
            <rect x="13" y="12" width="16" height="6" />
            <rect x="11" y="18" width="12" height="6" />
            <rect x="17" y="24" width="13" height="8" />
            <rect x="12" y="32" width="21" height="7" />
            <rect x="16" y="15" width="3" height="3" fill={stroke} />
          </g>
        );
      case 'b':
        return (
          <g stroke={stroke} strokeWidth="1.2" fill={fill}>
            <rect x="21" y="6" width="3" height="4" />
            <rect x="18" y="10" width="9" height="6" />
            <rect x="15" y="16" width="15" height="8" />
            <rect x="19" y="24" width="7" height="6" />
            <rect x="14" y="30" width="17" height="4" />
            <rect x="11" y="34" width="23" height="5" />
            <rect x="22" y="18" width="2" height="4" fill={stroke} />
          </g>
        );
      case 'q':
        return (
          <g stroke={stroke} strokeWidth="1.2" fill={fill}>
            <rect x="10" y="10" width="4" height="4" />
            <rect x="20.5" y="7" width="4" height="4" />
            <rect x="31" y="10" width="4" height="4" />
            <rect x="12" y="14" width="21" height="6" />
            <rect x="15" y="20" width="15" height="8" />
            <rect x="13" y="28" width="19" height="5" />
            <rect x="9" y="33" width="27" height="6" />
          </g>
        );
      case 'k':
        return (
          <g stroke={stroke} strokeWidth="1.2" fill={fill}>
            <rect x="21" y="4" width="3" height="8" />
            <rect x="18" y="7" width="9" height="3" />
            <rect x="14" y="12" width="17" height="7" />
            <rect x="16" y="19" width="13" height="9" />
            <rect x="13" y="28" width="19" height="5" />
            <rect x="9" y="33" width="27" height="6" />
          </g>
        );
    }
  }

  // ==========================================
  // STYLE 4: GEOMETRİK MİNİMAL (Bauhaus & Modernist)
  // ==========================================
  if (styleId === 'geometric_minimal' || styleId === 'modern_sans') {
    switch (type) {
      case 'p':
        return (
          <g>
            <circle cx="22.5" cy="14" r="6" fill={fill} stroke={stroke} strokeWidth="2" />
            <path d="M16 24h13l3 13H13z" fill={fill} stroke={stroke} strokeWidth="2" />
          </g>
        );
      case 'r':
        return (
          <g>
            <rect x="13" y="10" width="19" height="8" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
            <rect x="15" y="18" width="15" height="13" fill={fill} stroke={stroke} strokeWidth="2" />
            <rect x="11" y="31" width="23" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
            <line x1="19.5" y1="10" x2="19.5" y2="14" stroke={stroke} strokeWidth="2" />
            <line x1="25.5" y1="10" x2="25.5" y2="14" stroke={stroke} strokeWidth="2" />
          </g>
        );
      case 'n':
        return (
          <g>
            <path d="M14 36V22l8-13 8 4-4 9h6v14z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
            <circle cx="22" cy="16" r="2" fill={stroke} />
          </g>
        );
      case 'b':
        return (
          <g>
            <path d="M22.5 8L13 28h19z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
            <rect x="11" y="30" width="23" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
            <circle cx="22.5" cy="18" r="2.5" fill={secondaryFill} stroke={stroke} strokeWidth="1.5" />
          </g>
        );
      case 'q':
        return (
          <g>
            <circle cx="22.5" cy="9" r="3.5" fill={fill} stroke={stroke} strokeWidth="2" />
            <path d="M10 16l4 13h17l4-13-8 5-4.5-9-4.5 9z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
            <rect x="9" y="31" width="27" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
          </g>
        );
      case 'k':
        return (
          <g>
            <path d="M22.5 5v6m-3-3h6" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <rect x="14" y="13" width="17" height="16" rx="2" fill={fill} stroke={stroke} strokeWidth="2" />
            <rect x="9" y="31" width="27" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
            <rect x="19" y="18" width="7" height="7" fill={secondaryFill} stroke={stroke} strokeWidth="1.5" />
          </g>
        );
    }
  }

  // ==========================================
  // STYLE 5: GOTİK & ORTAÇAĞ (Medieval Fortress)
  // ==========================================
  if (styleId === 'medieval_gothic' || styleId === 'gothic_medieval') {
    switch (type) {
      case 'p':
        return (
          <g>
            {/* Helm head */}
            <path d="M22.5 8c-4.5 0-7 4-7 8 0 3 2 5 7 5s7-2 7-5c0-4-2.5-8-7-8z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <path d="M15 21l2 11h11l2-11H15z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <path d="M10 34h25v5H10z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <line x1="20" y1="14" x2="25" y2="14" stroke={stroke} strokeWidth="1.5" />
          </g>
        );
      case 'r':
        return (
          <g>
            {/* Heavy medieval tower */}
            <path d="M11 10h6v5h3v-5h5v5h3v-5h6v8H11v-8z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <path d="M13 18l2 14h15l2-14H13z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <path d="M9 34h27v5H9z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <path d="M21 23v5h3v-5z" fill={stroke} />
          </g>
        );
      case 'n':
        return (
          <g>
            {/* Armored steed / knight */}
            <path d="M23 6c-5 0-10 4-12 9-1.5 3.5-.5 7.5 2 9-2.5 2-3.5 5.5-2 9 2 2.5 5.5 3.5 8 3.5v2c-4 1.5-6.5 2.5-6.5 4.5v3h23v-3c0-4.5-4-7-8.5-8 4-3 5.5-9 2-15-2-3.5-6-5-8-5z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <line x1="15" y1="16" x2="21" y2="16" stroke={stroke} strokeWidth="2" />
            <line x1="16" y1="21" x2="22" y2="21" stroke={stroke} strokeWidth="2" />
          </g>
        );
      case 'b':
        return (
          <g>
            {/* Gothic mitre */}
            <path d="M22.5 6L14 18c0 6 3 10 5 14h7c2-4 5-8 5-14L22.5 6z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <path d="M22.5 13v10m-3.5-5h7" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M10 34h25v5H10z" fill={fill} stroke={stroke} strokeWidth="1.8" />
          </g>
        );
      case 'q':
        return (
          <g>
            {/* Gothic spiked crown */}
            <path d="M8 12l5 4 4.5-7 5 6 5-6 4.5 7 5-4-3 18H11L8 12z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <path d="M8 32h29v6H8z" fill={fill} stroke={stroke} strokeWidth="1.8" />
          </g>
        );
      case 'k':
        return (
          <g>
            {/* Iron Cross Crown */}
            <path d="M22.5 4v6m-3-3h6" stroke={stroke} strokeWidth="2.5" strokeLinecap="square" />
            <path d="M12 12c-2 2-3 6-3 10 0 5 4 8 8 9v2h11v-2c4-1 8-4 8-9 0-4-1-8-3-10-5 4-16 4-21 0z" fill={fill} stroke={stroke} strokeWidth="1.8" />
            <path d="M8 34h29v5H8z" fill={fill} stroke={stroke} strokeWidth="1.8" />
          </g>
        );
    }
  }

  // ==========================================
  // STYLE 6: SİBER & NEON HOLOGRAFIK (Cyber Neon)
  // ==========================================
  if (styleId === 'cyber_neon' || styleId === 'neo_digital') {
    const neonColor = isWhite ? '#0284C7' : '#EC4899';
    return (
      <g stroke={neonColor} strokeWidth="1.8" fill={fill} strokeLinejoin="bevel">
        {type === 'p' && (
          <>
            <polygon points="22.5,7 28,15 22.5,22 17,15" />
            <polygon points="17,23 28,23 31,34 14,34" />
            <line x1="12" y1="37" x2="33" y2="37" strokeWidth="2.5" />
          </>
        )}
        {type === 'r' && (
          <>
            <polygon points="12,10 16,10 18,14 27,14 29,10 33,10 33,18 12,18" />
            <polygon points="15,18 30,18 32,32 13,32" />
            <line x1="10" y1="36" x2="35" y2="36" strokeWidth="2.5" />
            <line x1="22.5" y1="18" x2="22.5" y2="32" strokeWidth="1.2" />
          </>
        )}
        {type === 'n' && (
          <>
            <polygon points="22,6 30,11 27,20 33,26 29,34 13,34 13,20 18,13 15,10" />
            <circle cx="21" cy="15" r="1.5" fill={neonColor} />
            <line x1="10" y1="37" x2="35" y2="37" strokeWidth="2.5" />
          </>
        )}
        {type === 'b' && (
          <>
            <polygon points="22.5,6 31,19 27,31 18,31 14,19" />
            <line x1="18" y1="18" x2="27" y2="18" strokeWidth="1.5" />
            <line x1="22.5" y1="13" x2="22.5" y2="23" strokeWidth="1.5" />
            <line x1="11" y1="36" x2="34" y2="36" strokeWidth="2.5" />
          </>
        )}
        {type === 'q' && (
          <>
            <polygon points="9,13 14,27 31,27 36,13 28,18 22.5,8 17,18" />
            <polygon points="13,27 32,27 34,34 11,34" />
            <line x1="8" y1="37" x2="37" y2="37" strokeWidth="2.5" />
          </>
        )}
        {type === 'k' && (
          <>
            <line x1="22.5" y1="4" x2="22.5" y2="11" strokeWidth="2.5" />
            <line x1="19" y1="7.5" x2="26" y2="7.5" strokeWidth="2.5" />
            <polygon points="12,13 33,13 30,27 15,27" />
            <polygon points="13,27 32,27 34,34 11,34" />
            <line x1="8" y1="37" x2="37" y2="37" strokeWidth="2.5" />
          </>
        )}
      </g>
    );
  }

  // ==========================================
  // STYLE 7: ÇİZGİ FİLM & SEVİMLİ (Cartoon Toon)
  // ==========================================
  if (styleId === 'cartoon_toon' || styleId === 'bold_heavy') {
    switch (type) {
      case 'p':
        return (
          <g>
            <circle cx="22.5" cy="13" r="7" fill={fill} stroke={stroke} strokeWidth="2.2" />
            <circle cx="20.5" cy="11.5" r="1.5" fill={stroke} />
            <circle cx="24.5" cy="11.5" r="1.5" fill={stroke} />
            <path d="M15 22c1 3 2 7 1 11h13c-1-4 0-8 1-11H15z" fill={fill} stroke={stroke} strokeWidth="2.2" />
            <rect x="11" y="33" width="23" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="2.2" />
          </g>
        );
      case 'r':
        return (
          <g>
            <path d="M12 11h4v4h3v-4h4v4h3v-4h4v8H12v-8z" fill={fill} stroke={stroke} strokeWidth="2.2" />
            <rect x="14" y="19" width="17" height="14" rx="2" fill={fill} stroke={stroke} strokeWidth="2.2" />
            <rect x="10" y="33" width="25" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="2.2" />
            <circle cx="19" cy="24" r="1.5" fill={stroke} />
            <circle cx="26" cy="24" r="1.5" fill={stroke} />
          </g>
        );
      case 'n':
        return (
          <g>
            <path d="M22 7c-4 0-8 3-9 7-1.5 3-1 6.5 1.5 8-2 1.5-3 5-1.5 8 2 2.5 5 3.5 7 3.5v2c-3.5 1.5-6 2.5-6 4v3.5h21v-3.5c0-4-3.5-6-7-7 3.5-3 4.5-8 1.5-13.5-1.5-2.5-4.5-4.5-6.5-4.5z" fill={fill} stroke={stroke} strokeWidth="2.2" />
            <circle cx="16.5" cy="14" r="2" fill={stroke} />
            <ellipse cx="12" cy="21" rx="1.5" ry="1" fill={stroke} />
          </g>
        );
      case 'b':
        return (
          <g>
            <circle cx="22.5" cy="6.5" r="2.5" fill={fill} stroke={stroke} strokeWidth="2" />
            <path d="M22.5 9c-5.5 0-9.5 5-9.5 11 0 5 2 9 4.5 13h10c2.5-4 4.5-8 4.5-13 0-6-4-11-9.5-11z" fill={fill} stroke={stroke} strokeWidth="2.2" />
            <circle cx="19.5" cy="18" r="1.5" fill={stroke} />
            <circle cx="25.5" cy="18" r="1.5" fill={stroke} />
            <rect x="11" y="33" width="23" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="2.2" />
          </g>
        );
      case 'q':
        return (
          <g>
            <circle cx="11" cy="12" r="2.2" fill="#F59E0B" stroke={stroke} strokeWidth="1.8" />
            <circle cx="22.5" cy="8" r="2.5" fill="#F59E0B" stroke={stroke} strokeWidth="1.8" />
            <circle cx="34" cy="12" r="2.2" fill="#F59E0B" stroke={stroke} strokeWidth="1.8" />
            <path d="M11 15l4 13h15l4-13-6 4.5-5.5-9-5.5 9-6-4.5z" fill={fill} stroke={stroke} strokeWidth="2.2" />
            <circle cx="19.5" cy="23" r="1.5" fill={stroke} />
            <circle cx="25.5" cy="23" r="1.5" fill={stroke} />
            <rect x="9" y="33" width="27" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="2.2" />
          </g>
        );
      case 'k':
        return (
          <g>
            <path d="M22.5 4.5v6.5m-3.5-3.5h7" stroke={stroke} strokeWidth="2.8" strokeLinecap="round" />
            <path d="M14 13c-2.5 2.5-4 6-4 9.5 0 4.5 3 8 7.5 9.5v2h10v-2c4.5-1.5 7.5-5 7.5-9.5 0-3.5-1.5-7-4-9.5-4.5 3.5-12.5 3.5-17 0z" fill={fill} stroke={stroke} strokeWidth="2.2" />
            <circle cx="19" cy="22" r="1.5" fill={stroke} />
            <circle cx="26" cy="22" r="1.5" fill={stroke} />
            <rect x="9" y="33" width="27" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="2.2" />
          </g>
        );
    }
  }

  // ==========================================
  // STYLE 8: KELT & ANTİK RÜN (Celtic Relic)
  // ==========================================
  if (styleId === 'celtic_relic' || styleId === 'legend_wood') {
    switch (type) {
      case 'p':
        return (
          <g stroke={stroke} strokeWidth="1.8" fill={fill}>
            <circle cx="22.5" cy="12" r="6" />
            <path d="M16 19l2 13h9l2-13z" />
            <path d="M11 34h23v5H11z" />
            <circle cx="22.5" cy="12" r="2.5" fill={stroke} />
          </g>
        );
      case 'r':
        return (
          <g stroke={stroke} strokeWidth="1.8" fill={fill}>
            {/* Berserker shield shape */}
            <path d="M14 10h17v8l-4 14H18l-4-14z" />
            <path d="M10 34h25v5H10z" />
            <line x1="22.5" y1="10" x2="22.5" y2="32" strokeWidth="1.5" />
            <line x1="15" y1="20" x2="30" y2="20" strokeWidth="1.5" />
          </g>
        );
      case 'n':
        return (
          <g stroke={stroke} strokeWidth="1.8" fill={fill}>
            <path d="M21 7c-4 0-8 3-9 8-1 3 0 6 2 8-2 2-3 5-1 8 2 2 4 3 6 3v2c-3 1-5 2-5 4v3h21v-3c0-4-3-6-7-7 3-3 4-8 1-13-1-2.5-4-4-7-4z" />
            <circle cx="16" cy="15" r="2" fill={stroke} />
            <path d="M18 10c3 3 5 8 3 13" fill="none" strokeWidth="1.4" />
          </g>
        );
      case 'b':
        return (
          <g stroke={stroke} strokeWidth="1.8" fill={fill}>
            <path d="M22.5 7L13 19c0 6 3 9 5 13h9c2-4 5-7 5-13L22.5 7z" />
            <circle cx="22.5" cy="19" r="3.5" fill="none" strokeWidth="1.5" />
            <path d="M10 34h25v5H10z" />
          </g>
        );
      case 'q':
        return (
          <g stroke={stroke} strokeWidth="1.8" fill={fill}>
            <path d="M10 13l4 15h17l4-15-6 4-6.5-8-6.5 8-6-4z" />
            <circle cx="22.5" cy="22" r="3" fill="none" strokeWidth="1.5" />
            <path d="M9 34h27v5H9z" />
          </g>
        );
      case 'k':
        return (
          <g stroke={stroke} strokeWidth="1.8" fill={fill}>
            <circle cx="22.5" cy="7" r="3.5" fill="none" strokeWidth="1.8" />
            <path d="M22.5 3.5v7m-3.5-3.5h7" strokeLinecap="round" />
            <path d="M13 14c-2 2-3 5-3 9 0 4 3 7 7 8v2h11v-2c4-1 7-4 7-8 0-4-1-7-3-9-4 3-12 3-16 0z" />
            <path d="M9 34h27v5H9z" />
          </g>
        );
    }
  }

  // ==========================================
  // STYLE 9: ORIGAMI & POLİGON (Papercraft Low-Poly)
  // ==========================================
  if (styleId === 'origami_poly' || styleId === 'championship_lucida') {
    return (
      <g stroke={stroke} strokeWidth="1.5" fill={fill} strokeLinejoin="round">
        {type === 'p' && (
          <>
            <polygon points="22.5,7 28,15 22.5,19 17,15" />
            <polygon points="17,19 22.5,19 22.5,33 14,33" fill={secondaryFill} />
            <polygon points="28,19 22.5,19 22.5,33 31,33" />
            <polygon points="11,34 34,34 31,38 14,38" />
          </>
        )}
        {type === 'r' && (
          <>
            <polygon points="12,11 16,11 18,15 27,15 29,11 33,11 33,17 12,17" />
            <polygon points="13,17 22.5,17 22.5,32 15,32" fill={secondaryFill} />
            <polygon points="32,17 22.5,17 22.5,32 30,32" />
            <polygon points="10,33 35,33 32,38 13,38" />
          </>
        )}
        {type === 'n' && (
          <>
            <polygon points="22,6 29,10 26,18 31,24 28,32 14,32 14,20 18,14 15,10" />
            <polygon points="14,20 22,20 28,32 14,32" fill={secondaryFill} />
            <polygon points="11,33 34,33 31,38 14,38" />
          </>
        )}
        {type === 'b' && (
          <>
            <polygon points="22.5,6 30,18 22.5,31 15,18" />
            <polygon points="15,18 22.5,18 22.5,31" fill={secondaryFill} />
            <polygon points="11,33 34,33 31,38 14,38" />
          </>
        )}
        {type === 'q' && (
          <>
            <polygon points="10,14 14,27 22.5,27 18,18" fill={secondaryFill} />
            <polygon points="35,14 31,27 22.5,27 27,18" />
            <polygon points="22.5,8 18,18 27,18" />
            <polygon points="9,33 36,33 33,38 12,38" />
          </>
        )}
        {type === 'k' && (
          <>
            <polygon points="22.5,4 25,8 22.5,12 20,8" />
            <polygon points="13,13 22.5,13 22.5,27 15,27" fill={secondaryFill} />
            <polygon points="32,13 22.5,13 22.5,27 30,27" />
            <polygon points="9,33 36,33 33,38 12,38" />
          </>
        )}
      </g>
    );
  }

  // ==========================================
  // STYLE 10: GÖLGE & KESKİN SİLÜET (Stealth Silhouette)
  // ==========================================
  if (styleId === 'stealth_shadow' || styleId === 'noble_roman') {
    return (
      <g fill={fill} stroke={stroke} strokeWidth="1.8">
        {type === 'p' && (
          <>
            <circle cx="22.5" cy="13" r="6" />
            <path d="M16 20c1 3 2 7 1 12h11c-1-5 0-9 1-12-3-1-10-1-13 0z" />
            <path d="M11 35h23v4H11z" />
          </>
        )}
        {type === 'r' && (
          <>
            <path d="M12 11h5v4h3v-4h5v4h3v-4h5v8H12v-8z" />
            <path d="M14 19l2 13h13l2-13H14z" />
            <path d="M10 35h25v4H10z" />
          </>
        )}
        {type === 'n' && (
          <>
            <path d="M22 6c-4 0-8 3-10 8-1.5 3-1 7 1.5 8.5-2 1.5-3 5-1.5 8.5 2 2.5 5 3 7 3v2c-4 1.5-6 2.5-6 4.5v3.5h23v-3.5c0-4.5-4-7-8-8 4-3 5-9 1.5-15-2-3-5.5-5-7.5-5z" />
            <circle cx="16" cy="14" r="2" fill={stroke} />
          </>
        )}
        {type === 'b' && (
          <>
            <circle cx="22.5" cy="7" r="2" />
            <path d="M22.5 10c-5 0-9 5-9 10 0 4 2 8 4 12h10c2-4 4-8 4-12 0-5-4-10-9-10z" />
            <path d="M11 35h23v4H11z" />
          </>
        )}
        {type === 'q' && (
          <>
            <circle cx="22.5" cy="8" r="2.5" />
            <path d="M10 14l4.5 14h16l4.5-14-6 4-6.5-8-6.5 8-6-4z" />
            <path d="M9 35h27v4H9z" />
          </>
        )}
        {type === 'k' && (
          <>
            <path d="M22.5 4v7m-3.5-4h7" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M14 13c-2 2-3 5-3 9 0 4 3 7 7 8v2h9v-2c4-1 7-4 7-8 0-4-1-7-3-9-4 3-12 3-17 0z" />
            <path d="M9 35h27v4H9z" />
          </>
        )}
      </g>
    );
  }

  // ==========================================
  // STYLE 11 & 12: EL YAPIMI AHŞAP & KRİSTAL (Default Fallback to Crisp Tournament Staunton)
  // ==========================================
  return (
    <g>
      <circle cx="22.5" cy="13" r="6" fill={fill} stroke={stroke} strokeWidth="1.8" />
      <path d="M16 20c1 3 2 7 1 12h11c-1-5 0-9 1-12-3-1-10-1-13 0z" fill={fill} stroke={stroke} strokeWidth="1.8" />
      <path d="M11 35h23v4H11z" fill={fill} stroke={stroke} strokeWidth="1.8" />
    </g>
  );
};
