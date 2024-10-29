import { Dimensions } from "react-native";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export const getRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getPipeSizePosPair = (() => {
  return (addToPosX = 0) => {
    const yPosTop = -getRandom(300, windowHeight - 100);

    return {
      pipeTop: {
        pos: { x: windowWidth + addToPosX, y: yPosTop },
        size: { height: windowHeight * 2, width: 75 },
      },
      pipeBottom: {
        pos: {
          x: windowWidth + addToPosX,
          y: windowHeight * 2 + 200 + yPosTop,
        },
        size: { height: windowHeight * 2, width: 75 },
      },
    };
  };
})();
