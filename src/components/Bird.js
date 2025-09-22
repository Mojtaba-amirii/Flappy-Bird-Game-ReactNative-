import Matter from "matter-js";
import { useEffect, useRef } from "react";

import { View, StyleSheet, Animated } from "react-native";

const Bird = (props) => {
  const { body } = props;
  const widthBody = body.bounds.max.x - body.bounds.min.x;
  const heightBody = body.bounds.max.y - body.bounds.min.y;
  const xBody = body.position.x - widthBody / 2;
  const yBody = body.position.y - heightBody / 2;

  const rotationAnim = useRef(new Animated.Value(0)).current;
  // More subtle rotation based on velocity
  const rotation = Math.max(-0.3, Math.min(0.6, body.velocity.y * 0.08));

  useEffect(() => {
    Animated.timing(rotationAnim, {
      toValue: rotation,
      duration: 150, // Smoother rotation transition
      useNativeDriver: true,
    }).start();
  }, [rotation]);

  return (
    <View
      style={[
        styles.birdContainer,
        { left: xBody, top: yBody, width: widthBody, height: heightBody },
      ]}
    >
      <Animated.Image
        source={{
          uri: "https://th.bing.com/th/id/R.36ec00336eda7007c75ad466f4c2fc23?rik=25xizTsEPaB7tg&pid=ImgRaw&r=0",
        }}
        style={[
          styles.birdImage,
          {
            transform: [
              {
                rotate: rotationAnim.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ["-25deg", "45deg"], // Less dramatic rotation
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  birdContainer: {
    position: "absolute",
    overflow: "hidden",
  },
  birdImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 20,
  },
});

export default (world, color, pos, size) => {
  const initialBird = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    {
      label: "Bird",
      frictionAir: 0.025, // Increased air friction for better control
      restitution: 0.1, // Less bouncy for more realistic feel
      density: 0.008, // Lighter bird for smoother movement
      inertia: Infinity, // Prevent rotation from physics
      friction: 0.001, // Minimal friction
    }
  );

  Matter.World.add(world, initialBird);

  return {
    body: initialBird,
    color,
    pos,
    renderer: <Bird body={initialBird} />,
  };
};
