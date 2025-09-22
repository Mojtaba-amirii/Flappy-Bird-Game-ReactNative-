import Matter from "matter-js";

import { Dimensions } from "react-native";
import soundManager from "./soundManager";
import gameStateManager from "./gameStateManager";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

const FLAP_FORCE = -6; // Much shorter jumps
const MAX_VELOCITY = 10; // Even lower max velocity for shorter arcs
const GRAVITY = 0.5; // Slightly higher gravity for quicker falls
const AIR_RESISTANCE = 0.98; // Add air resistance for smoother movement
const BASE_PIPE_SPEED = 1.5; // Slower base speed
const PIPE_GAP = 250; // Bigger gap for easier gameplay
const PIPE_SPACING = 450; // More distance between pipes

const Physics = (entities, { touches, time, dispatch }) => {
  const engine = entities.physics.engine;
  engine.world.gravity.y = GRAVITY;

  const currentScore = entities.gameScore || 0;
  const difficulty = gameStateManager.getDifficulty(currentScore);
  const pipeSpeed = BASE_PIPE_SPEED + difficulty * 0.3; // Gradual difficulty increase

  const bird = entities.Bird.body;

  // Handle bird flapping with shorter hops
  touches
    .filter((t) => t.type === "press")
    .forEach(() => {
      // Simple, consistent short flaps
      Matter.Body.setVelocity(bird, {
        x: 0,
        y: FLAP_FORCE, // Direct flap force for consistent short jumps
      });
      soundManager.playSound("flap");
    });

  // Apply air resistance for smoother movement
  const birdVelocity = bird.velocity;
  Matter.Body.setVelocity(bird, {
    x: 0,
    y: birdVelocity.y * AIR_RESISTANCE,
  });

  // Apply velocity limits
  if (Math.abs(birdVelocity.y) > MAX_VELOCITY) {
    Matter.Body.setVelocity(bird, {
      x: 0,
      y: birdVelocity.y > 0 ? MAX_VELOCITY : -MAX_VELOCITY,
    });
  }

  Matter.Engine.update(engine, Math.min(time.delta, 16.66));

  // Check bounds
  const birdY = entities.Bird.body.position.y;
  if (birdY > windowHeight || birdY < 0) {
    soundManager.playSound("gameOver");
    dispatch({ type: "Game-Over" });
  }

  // Move pipes (simple top and bottom pair)
  for (let i = 1; i <= 2; i++) {
    const obstacleTop = entities[`ObstacleTop${i}`];
    const obstacleBottom = entities[`ObstacleBottom${i}`];

    // Score when passing pipe
    if (obstacleTop.body.bounds.max.x <= 50 && !obstacleTop.point) {
      obstacleTop.point = true;
      dispatch({ type: "new-point" });
      soundManager.playSound("point");
    }

    // Reset pipe position when off screen
    if (obstacleTop.body.bounds.max.x <= 0) {
      const newX = windowWidth + PIPE_SPACING; // More distance between pipes
      const screenCenter = windowHeight / 2;

      // Fixed positions - pipes always come from top and bottom with consistent gap
      const topPipeY = screenCenter - PIPE_GAP / 2 - 200; // Top pipe from top of screen
      const bottomPipeY = screenCenter + PIPE_GAP / 2 + 200; // Bottom pipe from bottom

      Matter.Body.setPosition(obstacleTop.body, {
        x: newX,
        y: topPipeY,
      });

      Matter.Body.setPosition(obstacleBottom.body, {
        x: newX,
        y: bottomPipeY,
      });

      obstacleTop.point = false;
    }

    // Move pipes left
    Matter.Body.translate(obstacleTop.body, { x: -pipeSpeed, y: 0 });
    Matter.Body.translate(obstacleBottom.body, { x: -pipeSpeed, y: 0 });
  }

  // Handle collisions
  Matter.Events.on(engine, "collisionStart", () => {
    soundManager.playSound("gameOver");
    dispatch({ type: "Game-Over" });
  });

  return entities;
};

export default Physics;
