import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const NetworkError = ({ message }) => {
  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <LottieView
        source={require("../../assets/network-error.json")}
        style={{ width: 400, height: 400 }}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#ff6347", // Red color or any other you prefer
    alignSelf: "stretch",
  },
  errorText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default NetworkError;
