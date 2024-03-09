import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ILogin } from "../../types";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }: any) => {
  const [userInfo, setuserInfo] = useState<ILogin>();
  const [isloading, setisloading] = useState<boolean>(false);
  const [splashLoading, setsplashLoading] = useState<boolean>(false);
  const BASE_URL = "https://diamonds.up.railway.app/api";

  const login = (username: string, password: string) => {
    setisloading(true);
    axios({
      url: `${BASE_URL}/login`,
      method: "post",
      data: {
        username: username,
        password: password,
      },
    })
      .then((res) => {
        setuserInfo(res.data);
        AsyncStorage.setItem("userInfo", JSON.stringify(res.data));
        setisloading(false);
        console.log(res.data);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          if (error.response.status === 404) {
            Alert.alert("API link is not found.");
            setisloading(false);
          } else {
            Alert.alert("Account not found!");
            setisloading(false);
          }
        } else if (error.request) {
          // The request was made but no response was received
          Alert.alert("No internet connection.");
          setisloading(false);
        } else {
          // Something happened in setting up the request that triggered an error
          Alert.alert(
            "An error occurred. Please check your network connection."
          );
        }
      });
  };

  const logout = () => {
    setisloading(true);
    axios({
      url: `${BASE_URL}/logout`,
      method: "delete",
      headers: {
        Authorization: `Bearer ${userInfo?.token}`,
      },
    })
      .then((res) => {
        AsyncStorage.removeItem("userInfo");
        setuserInfo({});
        setisloading(false);
        console.log(res.data);
      })
      .catch((e) => {
        console.log(`Error ${e}`);
        setisloading(false);
      });
  };

  const isLoggedIn = async () => {
    try {
      setsplashLoading(true);
      let userInfo = await AsyncStorage.getItem("userInfo");
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setuserInfo(userInfo);
      }

      setsplashLoading(false);
    } catch (error) {
      setsplashLoading(false);
      console.log(`isloggedin error ${error}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        userInfo,
        isloading,
        logout,
        splashLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
