import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GameEngine } from "react-native-game-engine";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import entities from "./src/entities";
import Physics from "./src/utils/physics";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    setRunning(false);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={{
            uri: "https://wallpaperaccess.com/full/4622688.png",
          }}
          style={styles.background}
          resizeMode="cover"
        >
          <Text style={styles.score}>{currentPoints}</Text>

          <GameEngine
            ref={(ref) => {
              setGameEngine(ref);
            }}
            systems={[Physics]}
            entities={entities()}
            running={running}
            onEvent={(e) => {
              switch (e.type) {
                case "Game-Over":
                  setRunning(false);
                  gameEngine.stop();
                  break;
                case "new-point":
                  setCurrentPoints(currentPoints + 1);
                  break;
              }
            }}
            style={styles.gameEngine}
          >
            <StatusBar style="auto" hidden={true} />
          </GameEngine>

          {!running && (
            <View style={styles.startContainer}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => {
                  setCurrentPoints(0);
                  setRunning(true);
                  gameEngine.swap(entities());
                }}
              >
                <Text style={styles.startButtonText}>START GAME</Text>
              </TouchableOpacity>
            </View>
          )}
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  background: {
    width: windowWidth,
    height: windowHeight,
    flex: 1,
    background: "repeat",
  },
  score: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    margin: 20,
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
  },
  startButton: {
    backgroundColor: "black",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  startButtonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 30,
  },
});
