import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, ListItem } from "@rneui/themed";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import DatePicker from "react-native-modern-datepicker";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { Card } from "@rneui/base";
import { AuthContext } from "../../context/AuthContext";
import { useGetAllHistory } from "../../hooks/api/useGetHistory";
import Spinner from "react-native-loading-spinner-overlay";
import NetworkError from "../../components/NetworkError";
import LottieView from "lottie-react-native";
import { printNamecard } from "../../namecard";

const HistoryScreen = () => {
  const BASE_URL = "https://diamonds.up.railway.app/api";
  const navigation = useNavigation();
  //AUTH CONTEXT
  const { userInfo } = useContext(AuthContext);
  //DATEPICKER
  const today = new Date();
  const startDate = format(today.setDate(today.getDate()), "yyyy-MM-dd");

  const [date, setdate] = useState(startDate);
  const [newDate, setnewDate] = useState();

  //DATE PICKER STATE
  const [isModalVisible, setModalVisible] = useState(false);
  const dateModal = () => {
    setModalVisible(!isModalVisible);
  };

  function stringdate(date: any) {
    const dateObject = parseISO(date);
    const formattedDate = format(dateObject, "MMMM dd, yyyy");
    return formattedDate;
  }

  function convertDate(stringdate: any) {
    const convertedDate = stringdate.replace(/\//g, "-");
    return convertedDate;
  }

  function handleChange(propDate: any) {
    setnewDate(convertDate(propDate));
    const dateObject = parseISO(date);
    const formattedDate = format(dateObject, "MMMM dd, yyyy");
  }

  function handleNewDate() {
    setdate(newDate);
    dateModal();
  }

  function firstPart(code: any) {
    const firstPart = code.split("-")[0];
    return firstPart;
  }

  function formattedDistance(date: any) {
    const dateTime = parseISO(date);
    const formattedDistance = formatDistanceToNow(dateTime, {
      addSuffix: true,
    });
    return formattedDistance;
  }

  // TIME STATE
  const [timeValue, settimeValue] = useState(null);
  const [istimeFocus, setIstimeFocus] = useState(false);

  // GAME STATE
  const [gameValue, setGameValue] = useState(null);
  const [isGameFocus, setIsGameFocus] = useState(false);

  const timeData = [
    { label: "All", value: "" },
    { label: "2PM", value: "14:00:00" },
    { label: "5PM", value: "17:00:00" },
    { label: "9PM", value: "21:00:00" },
  ];
  const gameData = [
    { label: "All", value: "" },
    { label: "S2", value: "s2" },
    { label: "S3", value: "s3" },
    ...(timeValue === "21:00:00" ? [{ label: "S4", value: "s4" }] : []),
  ];

  const renderGameLabel = () => {
    if (gameValue || isGameFocus) {
      return (
        <Text style={[styles.label, isGameFocus && { color: "blue" }]}>
          Game
        </Text>
      );
    }
    return null;
  };

  const renderTimeLabel = () => {
    if (timeValue || istimeFocus) {
      return (
        <Text style={[styles.label, istimeFocus && { color: "blue" }]}>
          Time
        </Text>
      );
    }
    return null;
  };

  const isFocused = useIsFocused();
  const { data, isLoading, refetch, error, isError } = useGetAllHistory(
    gameValue,
    timeValue,
    date
  );

  useEffect(() => {
    if (isFocused) refetch();
  }, [gameValue, timeValue, date, isFocused]);

  //HISTORY DETAILS STATE
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          backgroundColor: "#264653",
          paddingVertical: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          zIndex: 10,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#e0e1dd",
            marginLeft: 4,
          }}
        >
          {stringdate(date)}
        </Text>
        <Button
          buttonStyle={{
            marginBottom: 5,
            backgroundColor: "#2a9d8f",
            borderRadius: 50,
            width: 100,
          }}
          onPress={dateModal}
        >
          Date
        </Button>
      </View>

      {/* DATE PICKER MODAL */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                justifyContent: "space-between",
                marginHorizontal: 20,
                // flexDirection: "row",
              }}
            >
              <DatePicker
                mode="calendar"
                minunumDate={startDate}
                selected={date}
                onDateChange={handleChange}
                options={{
                  mainColor: "#264653",
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  buttonStyle={{
                    backgroundColor: "#2a9d8f",
                    width: 100,
                    borderRadius: 50,
                  }}
                  title={"Set"}
                  onPress={handleNewDate}
                />
                <Button
                  onPress={dateModal}
                  buttonStyle={{
                    backgroundColor: "#2a9d8f",
                    width: 100,
                    borderRadius: 50,
                  }}
                  title={"Cancel"}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* DROPDOWN */}
      <View style={{ flexDirection: "row", zIndex: 10 }}>
        <View style={styles.dropdownContainer}>
          {renderTimeLabel()}
          <Dropdown
            style={[styles.dropdown, istimeFocus && { borderColor: "#2a9d8f" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={timeData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!istimeFocus ? "Time" : "..."}
            value={timeValue}
            onFocus={() => setIstimeFocus(true)}
            onBlur={() => setIstimeFocus(false)}
            onChange={(item: any) => {
              settimeValue(item.value);
              setIstimeFocus(false);
            }}
          />
        </View>

        <View style={styles.dropdownContainer}>
          {renderGameLabel()}
          <Dropdown
            style={[styles.dropdown, isGameFocus && { borderColor: "#2a9d8f" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={gameData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isGameFocus ? "Game" : "..."}
            value={gameValue}
            onFocus={() => setIsGameFocus(true)}
            onBlur={() => setIsGameFocus(false)}
            onChange={(item: any) => {
              setGameValue(item.value);
              setIsGameFocus(false);
            }}
          />
        </View>
      </View>

      {isLoading && <Spinner visible={isLoading} />}

      {isError && <NetworkError message={error.message} />}

      {data?.length === 0 && (
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
            source={require("../../../assets/empty.json")}
            style={{ width: 200, height: 200 }}
            autoPlay
            loop
          />
        </View>
      )}

      {/* ALL TRANSACTIONS */}
      <View style={styles.list}>
        <FlatList
          persistentScrollbar
          data={data}
          renderItem={({ item }: any) => (
            <ListItem
              bottomDivider
              onPress={() =>
                navigation.navigate("Details", {
                  code: item.transaction_code,
                })
              }
            >
              <ListItem.Content>
                <View>
                  <ListItem.Title style={{ color: "#264653" }}>
                    {item.game_type}
                  </ListItem.Title>
                  <ListItem.Subtitle style={{ color: "#264653" }}>
                    {item.transaction_code}
                  </ListItem.Subtitle>
                </View>
              </ListItem.Content>
              <ListItem.Content right>
                <ListItem.Title style={{ color: "#415a77" }} right>
                  ₱{item.total}
                </ListItem.Title>
                <ListItem.Subtitle right style={{ color: "#415a77" }}>
                  {formattedDistance(item.bet_time)}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
          keyExtractor={(item: any) => item.transaction_code}
        />
      </View>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  picker: {
    alignItems: "center",
  },
  header: {},
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
  subHeader: {
    backgroundColor: "#2089dc",
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
    marginBottom: 0,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  dropdownContainer: {
    backgroundColor: "white",
    padding: 16,
    width: "50%",
  },
  dropdown: {
    height: 50,
    borderColor: "#415a77",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#778da9",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#415a77",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
