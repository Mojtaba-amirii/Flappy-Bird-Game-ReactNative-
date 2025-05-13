import Matter from "matter-js";
import { View, Image, StyleSheet } from "react-native";

const Bird = (props) => {
  const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
  const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;
  const xBody = props.body.position.x - widthBody / 2;
  const yBody = props.body.position.y - heightBody / 2;

  return (
    <View
      style={[
        styles.birdContainer,
        {
          left: xBody,
          top: yBody,
          width: widthBody,
          height: heightBody,
          borderRadius: widthBody / 2,
        },
      ]}
    >
      <Image
        source={{
          uri: "https://th.bing.com/th/id/R.36ec00336eda7007c75ad466f4c2fc23?rik=25xizTsEPaB7tg&pid=ImgRaw&r=0",
        }}
        alt="bird-image"
        style={styles.birdImage}
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
      frictionAir: 0.02,
      restitution: 0.5,
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
