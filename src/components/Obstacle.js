import Matter from "matter-js";

import { View, StyleSheet } from "react-native";

const Obstacle = (props) => {
  const { body } = props;
  const widthBody = body.bounds.max.x - body.bounds.min.x;
  const heightBody = body.bounds.max.y - body.bounds.min.y;
  const xBody = body.position.x - widthBody / 2;
  const yBody = body.position.y - heightBody / 2;

  return (
    <View
      style={[
        styles.obstacleContainer,
        { left: xBody, top: yBody, width: widthBody, height: heightBody },
      ]}
    >
      <View style={styles.pipeCap} />
      <View style={styles.pipeBody} />
    </View>
  );
};

const styles = StyleSheet.create({
  obstacleContainer: {
    position: "absolute",
    overflow: "visible",
  },
  pipeCap: {
    position: "absolute",
    top: -15,
    left: -5,
    right: -5,
    height: 30,
    backgroundColor: "#2F7D32",
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#1B5E20",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  pipeBody: {
    flex: 1,
    backgroundColor: "#4CAF50",
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: "#2E7D32",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default (world, label, color, pos, size) => {
  const initialObstacle = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    {
      label,
      isStatic: true,
    }
  );

  Matter.World.add(world, initialObstacle);

  return {
    body: initialObstacle,
    color,
    pos,
    renderer: <Obstacle body={initialObstacle} />,
  };
};
