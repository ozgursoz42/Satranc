import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/chess' });

app.use(express.json());

// In-Memory Online Multiplayer Rooms
interface PlayerInfo {
  id: string;
  name: string;
  avatar: string;
  ws: WebSocket;
}

interface Room {
  code: string;
  players: PlayerInfo[];
  fen: string;
  history: any[];
}

const rooms = new Map<string, Room>();

wss.on('connection', (ws: WebSocket) => {
  let currentRoomCode: string | null = null;
  let playerInfo: PlayerInfo | null = null;

  ws.on('message', (messageRaw: string) => {
    try {
      const data = JSON.parse(messageRaw);

      if (data.type === 'JOIN_ROOM') {
        const code = (data.roomCode || 'DEFAULT').toUpperCase();
        currentRoomCode = code;
        playerInfo = {
          id: data.player?.id || 'guest',
          name: data.player?.name || 'Kaşif',
          avatar: data.player?.avatar || 'piko_hero',
          ws
        };

        let room = rooms.get(code);
        if (!room) {
          room = {
            code,
            players: [playerInfo],
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            history: []
          };
          rooms.set(code, room);
        } else {
          // Remove old connection from same player ID if rejoining
          room.players = room.players.filter((p) => p.id !== playerInfo!.id);
          room.players.push(playerInfo);
        }

        // Broadcast updated room state
        room.players.forEach((p) => {
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(
              JSON.stringify({
                type: 'ROOM_STATE',
                fen: room!.fen,
                players: room!.players.map((pl) => ({ id: pl.id, name: pl.name, avatar: pl.avatar }))
              })
            );
          }
        });
      } else if (data.type === 'MOVE') {
        const room = rooms.get(data.roomCode);
        if (room) {
          room.fen = data.fen;
          // Broadcast to other players in the room
          room.players.forEach((p) => {
            if (p.ws.readyState === WebSocket.OPEN && p.ws !== ws) {
              p.ws.send(
                JSON.stringify({
                  type: 'ROOM_STATE',
                  fen: data.fen,
                  lastMove: data.move
                })
              );
            }
          });
        }
      } else if (data.type === 'CHAT') {
        const room = rooms.get(data.roomCode);
        if (room) {
          room.players.forEach((p) => {
            if (p.ws.readyState === WebSocket.OPEN) {
              p.ws.send(
                JSON.stringify({
                  type: 'CHAT',
                  message: data.message
                })
              );
            }
          });
        }
      }
    } catch (err) {
      console.error('WS Error:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoomCode && playerInfo) {
      const room = rooms.get(currentRoomCode);
      if (room) {
        room.players = room.players.filter((p) => p.ws !== ws);
        if (room.players.length === 0) {
          rooms.delete(currentRoomCode);
        }
      }
    }
  });
});

// Gemini AI Coach Hint Endpoint (Server-Side)
app.post('/api/gemini/coach-hint', async (req, res) => {
  try {
    const { fen, question } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        hint: 'Merkez kareleri kontrol etmeye çalış ve şahını güvende tut!'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Sen çocuklara satranç öğreten sevimli satranç kaşifi PİKO karakterisin.
Şu anki tahta konumu (FEN): "${fen}".
Kullanıcı sorusu: "${question || 'Bu konumda bana taktiksel ve eğlenceli bir ipucu ver.'}".
Lütfen 8-10 yaşındaki bir çocuğun anlayabileceği, maksimum 2 kısa cümlelik çok neşeli ve öğretici bir Türkçe ipucu ver.`
    });

    return res.json({
      hint: response.text || 'Taşlarını erkenden oyuna sür ve merkez kareleri kontrol et!'
    });
  } catch (error: any) {
    console.warn('Gemini coach error:', error.message);
    return res.json({
      hint: 'Taşlarını oyuna sok ve şahının önünü koru!'
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// Setup Vite development middlewares or serve static assets
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, () => {
    console.log(`Satranç Adası running at http://localhost:${port}`);
  });
}

startServer();
