import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import { Button, Divider } from "@rneui/base";
import Spinner from "react-native-loading-spinner-overlay";

const AccountScreen = () => {
  const { userInfo, isloading, logout } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Spinner visible={isloading} />

      <View style={styles.profileContainer}>
        <View style={styles.profileInfoContainer}>
          <Text style={styles.profileName}>
            {userInfo.success.complete_name}
            {userInfo.success.middle_name}
          </Text>
          <Text style={styles.profileRole}>
            {userInfo.success.isAdmin === 0 ? "Agent" : ""}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <DetailRow
          icon={
            <AntDesign
              name="user"
              size={24}
              color="#1b263b"
              style={{ paddingHorizontal: 3 }}
            />
          }
          label="Username"
          value={userInfo.success.username}
        />
        <DetailRow
          icon={
            <Entypo
              name="location"
              size={24}
              color="#1b263b"
              style={{ paddingHorizontal: 3 }}
            />
          }
          label="Area"
          value={userInfo.success.area_name}
        />
        <DetailRow
          icon={
            <Entypo
              name="location-pin"
              size={24}
              color="#1b263b"
              style={{ paddingHorizontal: 3 }}
            />
          }
          label="Location"
          value={userInfo.success.location}
        />
        <DetailRow
          icon={
            <Feather
              name="phone"
              size={24}
              color="#1b263b"
              style={{ paddingHorizontal: 3 }}
            />
          }
          label="Phone"
          value={userInfo.success.phone_number}
        />
        <Button
          onPress={() => logout()}
          buttonStyle={[
            styles.detailRow,
            {
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <MaterialIcons
            name="logout"
            size={24}
            color="#1b263b"
            style={{ paddingHorizontal: 3 }}
          />
          <Text style={{ color: "#1b263b" }}>Logout</Text>
        </Button>
      </View>
    </View>
  );
};

const DetailRow = ({ label, value, icon }) => (
  <View style={styles.detailRow}>
    <View style={{ flexDirection: "row" }}>
      {icon}
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6", // Light gray background color
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#264653",
    height: 150,
    borderBottomEndRadius: 50,
    borderTopStartRadius: 50,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#42A5F5", // Sky blue color
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  profileInfoContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    color: "#e0e1dd",
    fontWeight: "bold",
  },
  profileRole: {
    fontSize: 18,
    color: "#e0e1dd",
  },
  divider: {
    marginVertical: 20,
  },
  detailsContainer: {
    paddingHorizontal: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    backgroundColor: "#e0e1dd",
    borderRadius: 100,
    paddingHorizontal: 30,
    marginVertical: 5,
  },
  detailLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#1b263b",
  },
  detailValue: {
    fontSize: 18,
    color: "#1b263b",
    fontWeight: "600",
  },
});
