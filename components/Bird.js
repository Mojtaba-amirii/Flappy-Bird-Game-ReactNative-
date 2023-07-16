import React from "react";
import Matter from "matter-js";
import { View, Image, TouchableOpacity } from "react-native";

const Bird = (props) => {
  const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
  const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;

  const xBody = props.body.position.x - widthBody / 2;
  const yBody = props.body.position.y - heightBody / 2;

  const color = props.color;

  return (
    <TouchableOpacity style={{ backgroundColor: "transparent" }}>
      <View
        style={{
          backgroundColor: "transparent",
          position: "absolute",
          left: xBody,
          top: yBody,
          width: widthBody,
          height: heightBody,
        }}
      >
        <Image
          source={require("../assets/flappybird.jpeg")}
          style={{
            backgroundColor: "transparent",
            width: 50,
            height: 40,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default (world, color, pos, size) => {
  const initialBird = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    { label: "Bird" }
  );
  Matter.World.add(world, initialBird);

  return {
    body: initialBird,
    color,
    pos,
    renderer: <Bird />,
  };
};
