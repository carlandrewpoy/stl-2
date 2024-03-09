import { useState, useEffect } from "react";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import SmsAndroid from "react-native-get-sms-android";

export function useSendSmsFormat() {
  const [sendTo, setSendTo] = useState("09");
  const [sendBody, setSendBody] = useState("Wazzup!");

  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      if (Platform.OS === "android") {
        try {
          if (!(await checkPermissions())) {
            await requestPermissions();
          }

          if (await checkPermissions()) {
            // listSMS(); // Uncomment if needed
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    checkAndRequestPermissions();
  }, []); // Empty dependency array means this effect runs once after the initial render

  const checkPermissions = async () => {
    console.log("checking SMS permissions");
    let hasPermissions = false;
    try {
      hasPermissions = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_SMS
      );
      if (!hasPermissions) return false;
      hasPermissions = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.SEND_SMS
      );
      if (!hasPermissions) return false;
    } catch (e) {
      console.error(e);
    }
    return hasPermissions;
  };

  const requestPermissions = async () => {
    let granted = {};
    try {
      console.log("requesting SMS permissions");
      granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
        ],
        {
          title: "Example App SMS Features",
          message: "Example SMS App needs access to demonstrate SMS features",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use SMS features");
      } else {
        console.log("SMS permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const sendSMS = (successRes, phoneNumber) => {
    const messageBody =
      "BET DATE  :  " +
      successRes.success.draw_date +
      "\nBET TIME  :  " +
      successRes.success.bet_time +
      "\nDRAW TIME  :  " +
      successRes.success.draw_time +
      "\nTRANS CODE  :  " +
      successRes.success.transaction_code +
      "\n" +
      successRes.success.combinations.map(
        (c) => "\nS3  " + c.combination + "  :  ₱ " + c.bet
      ) +
      "\n\nTotal  :  ₱ " +
      successRes.success.total;

    SmsAndroid.autoSend(
      phoneNumber,
      messageBody,
      (err) => {
        Alert.alert("Failed to send SMS. Check console");
        console.log("SMS SEND ERROR", err);
      },
      (success) => {
        Alert.alert("SMS sent successfully");
      }
    );
  };

  return { sendSMS };
}
