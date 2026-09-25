// Web Audio API Synthesizer for rich, responsive, zero-latency sound effects

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private voiceEnabled: boolean = true;
  private musicInterval: any = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled && this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Play a gentle tone sequence
  private playTone(freq: number, type: OscillatorType, duration: number, startTimeOffset = 0, gainLevel = 0.15) {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTimeOffset);

      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime + startTimeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTimeOffset + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startTimeOffset);
      osc.stop(this.ctx.currentTime + startTimeOffset + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Button click / Tile select
  public playTap() {
    this.playTone(480, 'sine', 0.08, 0, 0.08);
  }

  // Standard piece move (soft wooden thud sound)
  public playMove() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  // Capture piece (punchy snap)
  public playCapture() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      this.playTone(180, 'square', 0.12, 0, 0.12);
      this.playTone(340, 'triangle', 0.15, 0.04, 0.15);
    } catch (e) {}
  }

  // Check alert (warning two-tone)
  public playCheck() {
    this.playTone(520, 'sine', 0.12, 0, 0.2);
    this.playTone(680, 'sine', 0.2, 0.1, 0.22);
  }

  // Checkmate / Victory Fanfare
  public playVictory() {
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.25, idx * 0.12, 0.2);
    });
  }

  // Correct answer / Puzzle solved chime
  public playCorrect() {
    this.playTone(523.25, 'sine', 0.15, 0, 0.18); // C5
    this.playTone(659.25, 'sine', 0.15, 0.1, 0.18); // E5
    this.playTone(783.99, 'sine', 0.25, 0.2, 0.22); // G5
  }

  // Wrong move / Oops sound
  public playWrong() {
    this.playTone(320, 'sawtooth', 0.15, 0, 0.12);
    this.playTone(240, 'sawtooth', 0.2, 0.12, 0.12);
  }

  // Star earned sparkle
  public playStar() {
    this.playTone(880, 'sine', 0.12, 0, 0.15);
    this.playTone(1174, 'sine', 0.2, 0.08, 0.18);
  }

  // Badge / Region unlocked trumpet
  public playUnlock() {
    const notes = [392, 523, 659, 784, 1046];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.2, idx * 0.09, 0.18);
    });
  }

  // Chat message ping
  public playChat() {
    this.playTone(987, 'sine', 0.08, 0, 0.1);
  }

  // Text-to-speech for Piko (browser native, completely offline)
  public speakPiko(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.05;
      utterance.pitch = 1.25; // cute, friendly voice pitch
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  }
}

export const sound = new SoundManager();
