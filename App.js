import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState, ref } from "react";
import { GameEngine } from "react-native-game-engine";
import entities from "./entities";
import Physics from "./physics";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    setRunning(false);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("./assets/flappybirdwallpaper.jpeg")}
        style={{ with: windowWidth, height: windowHeight }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 40,
            fontWeight: "bold",
            margin: 20,
          }}
        >
          {currentPoints}
        </Text>
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
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <StatusBar style="auto" hidden={true} />
        </GameEngine>

        {!running ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                paddingHorizontal: 30,
                paddingVertical: 10,
              }}
              onPress={() => {
                setCurrentPoints(0);
                setRunning(true);
                gameEngine.swap(entities());
              }}
            >
              <Text
                style={{ fontWeight: "bold", color: "white", fontSize: 30 }}
              >
                START GAME
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ImageBackground>
    </View>
  );
}
