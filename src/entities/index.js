import Matter from "matter-js";
import Bird from "../components/Bird";
import Floor from "../components/Floor";
import { Dimensions } from "react-native";
import Obstacle from "../components/Obstacle";
import { getPipeSizePosPair } from "../utils/random";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

const initializeWorld = () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  world.y = 0.4;
  return { engine, world };
};

export default (restart) => {
  const { engine, world } = initializeWorld();
  const pipeSizePosA = getPipeSizePosPair();
  const pipeSizePosB = getPipeSizePosPair(windowWidth * 0.9);

  return {
    physics: { engine, world },

    Bird: Bird(world, "green", { x: 50, y: 300 }, { height: 40, width: 40 }),

    ObstacleTop1: Obstacle(
      world,
      "ObstacleTop1",
      "black",
      pipeSizePosA.pipeTop.pos,
      pipeSizePosA.pipeTop.size
    ),

    ObstacleBottom1: Obstacle(
      world,
      "ObstacleBottom1",
      "black",
      pipeSizePosA.pipeBottom.pos,
      pipeSizePosA.pipeBottom.size
    ),

    ObstacleTop2: Obstacle(
      world,
      "ObstacleTop2",
      "black",
      pipeSizePosB.pipeTop.pos,
      pipeSizePosB.pipeTop.size
    ),

    ObstacleBottom2: Obstacle(
      world,
      "ObstacleBottom2",
      "black",
      pipeSizePosB.pipeBottom.pos,
      pipeSizePosB.pipeBottom.size
    ),

    Floor: Floor(
      world,
      "green",
      { x: windowWidth / 2, y: windowHeight },
      { height: 50, width: windowWidth }
    ),
  };
};
