import Matter from "matter-js";

import Bird from "../components/Bird";
import Floor from "../components/Floor";
import { Dimensions } from "react-native";
import Obstacle from "../components/Obstacle";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

const PIPE_GAP = 250; // Bigger gap for easier gameplay
const PIPE_WIDTH = 75;
const PIPE_SPACING = 450; // More distance between pipes

const createPipePair = (x) => {
  const screenCenter = windowHeight / 2;
  return {
    pipeTop: {
      pos: { x, y: screenCenter - PIPE_GAP / 2 - 200 }, // Fixed top position
      size: { height: 400, width: PIPE_WIDTH },
    },
    pipeBottom: {
      pos: { x, y: screenCenter + PIPE_GAP / 2 + 200 }, // Fixed bottom position
      size: { height: 400, width: PIPE_WIDTH },
    },
  };
};

export default () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;

  // Create pipe pairs with more spacing
  const pipePair1 = createPipePair(windowWidth + 200); // First pipe further away
  const pipePair2 = createPipePair(windowWidth + 200 + PIPE_SPACING); // Second pipe with spacing

  return {
    physics: { engine, world },

    Bird: Bird(world, "green", { x: 50, y: 300 }, { height: 40, width: 40 }),

    ObstacleTop1: Obstacle(
      world,
      "ObstacleTop1",
      "black",
      pipePair1.pipeTop.pos,
      pipePair1.pipeTop.size
    ),
    ObstacleBottom1: Obstacle(
      world,
      "ObstacleBottom1",
      "black",
      pipePair1.pipeBottom.pos,
      pipePair1.pipeBottom.size
    ),

    ObstacleTop2: Obstacle(
      world,
      "ObstacleTop2",
      "black",
      pipePair2.pipeTop.pos,
      pipePair2.pipeTop.size
    ),
    ObstacleBottom2: Obstacle(
      world,
      "ObstacleBottom2",
      "black",
      pipePair2.pipeBottom.pos,
      pipePair2.pipeBottom.size
    ),

    Floor: Floor(
      world,
      "green",
      { x: windowWidth / 2, y: windowHeight },
      { height: 50, width: windowWidth }
    ),
  };
};

// Export obstacle components for physics system
export const ObstacleTop = (x, y, color) => {
  const engine = Matter.Engine.create();
  return Obstacle(
    engine.world,
    "ObstacleTop",
    color,
    { x, y },
    { height: 320, width: 75 }
  );
};

export const ObstacleBottom = (x, y, color) => {
  const engine = Matter.Engine.create();
  return Obstacle(
    engine.world,
    "ObstacleBottom",
    color,
    { x, y },
    { height: 320, width: 75 }
  );
};
