import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";

const SplashScreen = () => {
  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#0d1b2a" }}
    >
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
