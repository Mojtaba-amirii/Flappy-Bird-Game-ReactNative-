import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  HIGH_SCORE: "@FlappyBird:HighScore",
  SOUND_ENABLED: "@FlappyBird:SoundEnabled",
};

class GameStateManager {
  constructor() {
    this.highScore = 0;
    this.currentScore = 0;
    this.soundEnabled = true;
    this.init();
  }

  async init() {
    try {
      const [highScore, soundEnabled] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE),
        AsyncStorage.getItem(STORAGE_KEYS.SOUND_ENABLED),
      ]);

      this.highScore = highScore ? parseInt(highScore) : 0;
      this.soundEnabled =
        soundEnabled !== null ? JSON.parse(soundEnabled) : true;
    } catch (error) {
      // Silent fail
    }
  }

  async updateScore(score) {
    this.currentScore = score;

    if (score > this.highScore) {
      this.highScore = score;
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
        return true;
      } catch (error) {
        // Silent fail
      }
    }
    return false;
  }

  async setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SOUND_ENABLED,
        JSON.stringify(enabled)
      );
    } catch (error) {
      // Silent fail
    }
  }

  getHighScore() {
    return this.highScore;
  }

  getCurrentScore() {
    return this.currentScore;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  resetCurrentScore() {
    this.currentScore = 0;
  }

  getDifficulty(score = this.currentScore) {
    return Math.floor(score / 15); // Harder every 15 points (more gradual)
  }

  getPipeSpeed(difficulty = this.getDifficulty()) {
    return Math.min(1.5 + difficulty * 0.3, 4); // Slower progression, max speed of 4
  }

  getPipeGap(difficulty = this.getDifficulty()) {
    return Math.max(250 - difficulty * 15, 180); // Start with bigger gap, min gap of 180
  }
}

export default new GameStateManager();
