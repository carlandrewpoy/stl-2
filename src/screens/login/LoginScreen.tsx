import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { Button, Input } from "@rneui/base";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";

const LoginScreen = () => {
  const { login, isloading } = useContext(AuthContext);
  const [username, setusername] = useState<string>();
  const [password, setpassword] = useState<string>();
  const [showPassword, setshowPassword] = useState<boolean>(true);
  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#e0e1dd" }}
    >
      <Spinner visible={isloading} />
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Image
          style={{ width: 190, height: 190, marginBottom: 10 }}
          source={require("../../images/calculator.png")}
        />
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#264653" }}>
          SIGN IN
        </Text>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Input
          placeholder="Username"
          inputStyle={{ color: "#1b263b" }}
          onChangeText={(text) => setusername(text)}
          leftIcon={
            <Ionicons name="person-outline" size={24} color={"#415a77"} />
          }
        />
        <Input
          placeholder="Password"
          inputStyle={{ color: "#1b263b" }}
          onChangeText={(text) => setpassword(text)}
          secureTextEntry={showPassword}
          leftIcon={
            <Ionicons name="lock-closed-outline" size={24} color={"#415a77"} />
          }
          rightIcon={
            showPassword ? (
              <TouchableOpacity
                onPress={() => {
                  setshowPassword((prev) => !prev);
                  console.log(showPassword);
                  console.log("clicked");
                }}
              >
                <Ionicons name="eye-outline" size={24} color={"#415a77"} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setshowPassword((prev) => !prev);
                  console.log(showPassword);
                  console.log("clicked");
                }}
              >
                <Ionicons name="eye-off-outline" size={24} color={"#415a77"} />
              </TouchableOpacity>
            )
          }
        />
        <Button
          title="Login"
          onPress={() => login(username, password)}
          buttonStyle={{ backgroundColor: "#2a9d8f" }}
        />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
