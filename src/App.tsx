import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import SplashScreen from "./screens/splash/SplashScreen";
import BottomTabs from "./navigation/BottomTabs";
import LoginScreen from "./screens/login/LoginScreen";
import HitsScreen from "./screens/hits/HitsScreen";
import DetailsScreen from "./screens/historyDetails/DetailsScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useClaimHits } from "./hooks/api/useClaimHits";
import Modal from "react-native-modal";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import AntDesign from "react-native-vector-icons/AntDesign";
import HitDetailsScreen from "./screens/hitDetails/HitDetailsScreen";

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  const { userInfo, splashLoading } = React.useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {splashLoading ? (
          <Stack.Screen
            name="Splash Screen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : userInfo?.token ? (
          <>
            <Stack.Screen
              name="Home"
              component={BottomTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Hits"
              component={HitsScreen}
              // options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
              // options={{ headerShown: false }}
              options={{ headerTitle: "Bet Details" }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    // alignItems: "center",
    maxHeight: "90%",
    borderRadius: 5,
    flex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    // justifyContent: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "skyblue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
