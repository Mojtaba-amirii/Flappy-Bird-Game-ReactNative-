import * as Haptics from "expo-haptics";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

class SoundManager {
  constructor() {
    this.isEnabled = true;
    this.volume = 1.0;
    this.isInitialized = false;
    this.audioPlayers = {};
    this.soundsLoaded = false;
    this.hapticTypes = {
      flap: Haptics.ImpactFeedbackStyle.Light,
      point: Haptics.ImpactFeedbackStyle.Medium,
      gameOver: Haptics.ImpactFeedbackStyle.Heavy,
      hit: Haptics.ImpactFeedbackStyle.Heavy,
    };
  }

  async init() {
    if (this.isInitialized) return;

    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: "mixWithOthers",
      });

      await this.loadSounds();
      this.isInitialized = true;
    } catch (error) {
      this.soundsLoaded = false;
    }
  }

  async loadSounds() {
    try {
      this.audioPlayers = {
        flap: createAudioPlayer(require("../../assets/sounds/flap.mp3")),
        point: createAudioPlayer(require("../../assets/sounds/point.mp3")),
        hit: createAudioPlayer(require("../../assets/sounds/hit.mp3")),
        gameOver: createAudioPlayer(
          require("../../assets/sounds/gameOver.mp3")
        ),
      };
      this.soundsLoaded = true;
    } catch (error) {
      this.soundsLoaded = false;
    }
  }

  async playSound(soundName) {
    if (!this.isEnabled) return;

    await this.init();

    if (this.soundsLoaded && this.audioPlayers[soundName]) {
      try {
        const player = this.audioPlayers[soundName];
        player.volume = this.volume;

        if (player.currentTime > 0) {
          await player.seekTo(0);
        }

        player.play();
        return;
      } catch (error) {
        // Fall through to haptic feedback
      }
    }

    // Haptic feedback fallback
    try {
      const hapticStyle =
        this.hapticTypes[soundName] || Haptics.ImpactFeedbackStyle.Light;
      await Haptics.impactAsync(hapticStyle);
    } catch (error) {
      // Silent fail
    }
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  async cleanup() {
    if (this.soundsLoaded) {
      Object.values(this.audioPlayers).forEach((player) => {
        if (player?.remove) player.remove();
      });
    }
  }
}

export default new SoundManager();
