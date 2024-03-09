import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddScreen from "../screens/add/AddScreen";
import HistoryScreen from "../screens/history/HistoryScreen";
import ReportsScreen from "../screens/reports/ReportsScreen";
import ResultsScreen from "../screens/results/ResultsScreen";
import HitsScreen from "../screens/hits/HitsScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import ProfileScreen from "../screens/profile/ProfileScreen";
import AccountScreen from "../screens/account/AccountScreen";

const BottomTabs = () => {
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  return (
    <Tab.Navigator
      initialRouteName="Add"
      screenOptions={{
        tabBarStyle: { height: 70 },
        tabBarLabelStyle: {
          height: 30,
        },
      }}
    >
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="add-circle" size={40} color={"#264653"} />
            ) : (
              <Ionicons name="add-circle-outline" size={28} color={"#264653"} />
            ),
          tabBarActiveTintColor: "#264653",
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialIcons name="history" size={40} color={"#264653"} />
            ) : (
              <MaterialIcons name="history" size={28} color={"#264653"} />
            ),
          tabBarActiveTintColor: "#264653",
        }}
      />
      <Tab.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="dice" size={40} color={"#264653"} />
            ) : (
              <Ionicons name="dice-outline" size={28} color={"#264653"} />
            ),
          tabBarActiveTintColor: "#264653",
        }}
      />

      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="list-circle" size={40} color="#264653" /> // Custom color
            ) : (
              <Ionicons name="list-circle-outline" size={28} color="#264653" /> // Custom color
            ),
          tabBarActiveTintColor: "#264653",
        }}
      />
      <Tab.Screen
        name="Hits"
        component={HitsScreen}
        options={{
          tabBarActiveTintColor: "#264653",

          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialCommunityIcons name="star" size={40} color={"#264653"} />
            ) : (
              <MaterialCommunityIcons
                name="star-outline"
                size={28}
                color={"#264653"}
              />
            ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarActiveTintColor: "#264653",

          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="account"
                size={40}
                color={"#264653"}
              />
            ) : (
              <MaterialCommunityIcons
                name="account-outline"
                size={28}
                color={"#264653"}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({});
