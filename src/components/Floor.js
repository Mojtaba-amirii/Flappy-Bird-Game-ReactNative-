import Matter from "matter-js";

import { View, StyleSheet } from "react-native";

const Floor = (props) => {
  const { body } = props;
  const widthBody = body.bounds.max.x - body.bounds.min.x;
  const heightBody = body.bounds.max.y - body.bounds.min.y;
  const xBody = body.position.x - widthBody / 2;
  const yBody = body.position.y - heightBody / 2;

  return (
    <View
      style={[
        styles.floorContainer,
        { left: xBody, top: yBody, width: widthBody, height: heightBody },
      ]}
    >
      <View style={styles.grassLayer} />
      <View style={styles.dirtLayer} />
    </View>
  );
};

const styles = StyleSheet.create({
  floorContainer: {
    position: "absolute",
  },
  grassLayer: {
    height: 20,
    backgroundColor: "#4CAF50",
    borderTopWidth: 3,
    borderTopColor: "#66BB6A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  dirtLayer: {
    flex: 1,
    backgroundColor: "#8D6E63",
    borderTopWidth: 2,
    borderTopColor: "#A1887F",
  },
});

export default (world, color, pos, size) => {
  const initialFloor = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    {
      label: "Floor",
      isStatic: true,
    }
  );

  Matter.World.add(world, initialFloor);

  return {
    body: initialFloor,
    color,
    pos,
    renderer: <Floor body={initialFloor} />,
  };
};
