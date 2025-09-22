import { useEffect, useState, useCallback } from "react";

import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
  Modal,
  Animated,
} from "react-native";
import entities from "./src/entities";
import Physics from "./src/utils/physics";
import soundManager from "./src/utils/soundManager";
import { GameEngine } from "react-native-game-engine";
import gameStateManager from "./src/utils/gameStateManager";
import { SafeAreaProvider } from "react-native-safe-area-context";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    setRunning(false);
    loadGameState();
  }, []);

  const loadGameState = async () => {
    await gameStateManager.init();
    setHighScore(gameStateManager.getHighScore());
    soundManager.setEnabled(gameStateManager.isSoundEnabled());
  };

  const handleEvent = useCallback(
    async (e) => {
      switch (e.type) {
        case "Game-Over":
          setRunning(false);
          setGameOver(true);
          gameEngine.stop();

          const newHighScore = await gameStateManager.updateScore(
            currentPoints
          );
          if (newHighScore) {
            setIsNewHighScore(true);
            setHighScore(currentPoints);
          }

          setTimeout(() => setShowGameOverModal(true), 500);
          break;

        case "new-point":
          setCurrentPoints((prevPoints) => {
            const newPoints = prevPoints + 1;
            if (gameEngine?.entities) {
              gameEngine.entities.gameScore = newPoints;
            }
            return newPoints;
          });
          break;
      }
    },
    [gameEngine, currentPoints]
  );

  const handleStart = useCallback(() => {
    setCurrentPoints(0);
    setGameOver(false);
    setIsNewHighScore(false);
    setShowGameOverModal(false);
    setRunning(true);

    const newEntities = entities();
    newEntities.gameScore = 0;
    gameEngine.swap(newEntities);

    // Fade in effect
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [gameEngine, fadeAnim]);

  const toggleSound = useCallback(async () => {
    const newSoundState = !gameStateManager.isSoundEnabled();
    await gameStateManager.setSoundEnabled(newSoundState);
    soundManager.setEnabled(newSoundState);
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://wallpaperaccess.com/full/4622688.png",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{currentPoints}</Text>
          <Text style={styles.highScore}>Best: {highScore}</Text>
        </View>

        {/* Sound Toggle */}
        <TouchableOpacity style={styles.soundToggle} onPress={toggleSound}>
          <Text style={styles.soundToggleText}>
            {gameStateManager.isSoundEnabled() ? "🔊" : "🔇"}
          </Text>
        </TouchableOpacity>

        <Animated.View style={[styles.gameContainer, { opacity: fadeAnim }]}>
          <GameEngine
            ref={(ref) => setGameEngine(ref)}
            systems={[Physics]}
            entities={entities()}
            running={running}
            onEvent={handleEvent}
            style={styles.gameEngine}
          >
            <StatusBar style="auto" hidden={true} />
          </GameEngine>
        </Animated.View>

        {/* Start Screen */}
        {!running && !gameOver && (
          <View style={styles.startContainer}>
            <Text style={styles.title}>Flappy Bird</Text>
            <Text style={styles.subtitle}>Tap to Flap!</Text>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>START GAME</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Game Over Modal */}
        <Modal
          visible={showGameOverModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowGameOverModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.gameOverContainer}>
              <Text style={styles.gameOverTitle}>Game Over!</Text>

              {isNewHighScore && (
                <Text style={styles.newHighScoreText}>
                  🎉 NEW HIGH SCORE! 🎉
                </Text>
              )}

              <View style={styles.scoreRow}>
                <Text style={styles.finalScore}>Score: {currentPoints}</Text>
                <Text style={styles.bestScore}>Best: {highScore}</Text>
              </View>

              <Text style={styles.difficultyText}>
                Difficulty Level:{" "}
                {gameStateManager.getDifficulty(currentPoints)}
              </Text>

              <TouchableOpacity
                style={styles.restartButton}
                onPress={handleStart}
              >
                <Text style={styles.restartButtonText}>PLAY AGAIN</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => {
                  setShowGameOverModal(false);
                  setGameOver(false);
                }}
              >
                <Text style={styles.homeButtonText}>HOME</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight,
    width: windowWidth,
  },
  background: {
    width: windowWidth,
    height: windowHeight,
    flex: 1,
    background: "repeat",
  },
  scoreContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
  },
  score: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  highScore: {
    fontSize: 16,
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 5,
  },
  soundToggle: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 100,
    padding: 10,
  },
  soundToggleText: {
    fontSize: 24,
  },
  gameContainer: {
    flex: 1,
  },
  gameEngine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  startContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFD700",
    textShadowColor: "black",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  startButtonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 24,
  },
  stats: {
    color: "white",
    fontSize: 14,
    marginTop: 20,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverContainer: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    minWidth: 280,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF5722",
    marginBottom: 15,
  },
  newHighScoreText: {
    fontSize: 18,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  finalScore: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  bestScore: {
    fontSize: 18,
    color: "#666",
  },
  difficultyText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  restartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  homeButton: {
    backgroundColor: "#666",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
