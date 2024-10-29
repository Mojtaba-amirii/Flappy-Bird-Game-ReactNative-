import Matter from "matter-js";
import { getPipeSizePosPair } from "./random";
import { Dimensions } from "react-native";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

const Physics = (entities, { touches, time, dispatch }) => {
  let engine = entities.physics.engine;

  touches
    .filter((t) => t.type === "press")
    .forEach(() => {
      Matter.Body.setVelocity(entities.Bird.body, {
        x: 0,
        y: -8,
      });
    });

  Matter.Engine.update(engine, time.delta);

  const birdY = entities.Bird.body.position.y;
  if (birdY > windowHeight || birdY < 0) {
    dispatch({ type: "game-over" });
  }

  for (let i = 1; i <= 2; i++) {
    const obstacleTop = entities[`ObstacleTop${i}`];
    const obstacleBottom = entities[`ObstacleBottom${i}`];

    if (obstacleTop.body.bounds.max.x <= 50 && !obstacleTop.point) {
      obstacleTop.point = true;
      dispatch({ type: "new-point" });
    }

    if (obstacleTop.body.bounds.max.x <= 0) {
      const { pipeTop, pipeBottom } = getPipeSizePosPair(windowWidth * 0.9);
      Matter.Body.setPosition(obstacleTop.body, pipeTop.pos);
      Matter.Body.setPosition(obstacleBottom.body, pipeBottom.pos);
      obstacleTop.point = false;
    }

    Matter.Body.translate(obstacleTop.body, { x: -3, y: 0 });
    Matter.Body.translate(obstacleBottom.body, { x: -3, y: 0 });
  }

  Matter.Events.on(engine, "collisionStart", (event) => {
    dispatch({ type: "Game-Over" });
  });

  return entities;
};

export default Physics;
