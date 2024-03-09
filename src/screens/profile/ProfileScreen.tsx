import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Divider } from "@rneui/base";

const ProfileScreen = () => {
  const { userInfo } = useContext(AuthContext);
  return (
    <View
      style={{
        padding: 30,
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Text style={{ fontSize: 24, color: "black" }}>
          {userInfo.success.complete_name}
        </Text>
        <Text style={{ fontSize: 18 }}>{userInfo.success.role}</Text>
      </View>
      <View>
        <View style={{}}>
          {/* <MaterialIcons name="location-city" size={24} color="black" /> */}
          <Text style={styles.topText}>Username</Text>
          <Text style={styles.bottomText}>{userInfo.success.username}</Text>
          <Divider />
        </View>
        <View style={{}}>
          {/* <MaterialIcons name="location-city" size={24} color="black" /> */}
          <Text style={styles.topText}>Area</Text>
          <Text style={styles.bottomText}>{userInfo.success.area_name}</Text>
          <Divider />
        </View>
        <View style={{}}>
          {/* <MaterialIcons name="location-city" size={24} color="black" /> */}
          <Text style={styles.topText}>Location</Text>
          <Text style={styles.bottomText}>{userInfo.success.location}</Text>
          <Divider />
        </View>

        <View style={{}}>
          {/* <MaterialIcons name="location-city" size={24} color="black" /> */}
          <Text style={styles.topText}>Phone</Text>
          <Text style={styles.bottomText}>{userInfo.success.phone_number}</Text>
          <Divider />
        </View>
        <View style={{}}>
          {/* <MaterialIcons name="location-city" size={24} color="black" /> */}
          <Text style={styles.topText}>Phone</Text>
          <Text style={styles.bottomText}>{userInfo.success.phone_number}</Text>
          <Divider />
        </View>
        <View style={{}}>
          {/* <MaterialIcons name="location-city" size={24} color="black" /> */}
          <Text style={styles.topText}>Phone</Text>
          <Text style={styles.bottomText}>{userInfo.success.phone_number}</Text>
          <Divider />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  topText: {
    fontSize: 18,
    paddingTop: 10,
  },
  bottomText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
    marginBottom: 10,
  },
});
