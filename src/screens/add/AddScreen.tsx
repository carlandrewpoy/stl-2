import { Alert, StyleSheet, Text, View, FlatList } from "react-native";
import React, { useContext, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import useGenerateCombinations from "../../hooks/useGenerateCombinations";
import cuid from "cuid";
import { IAddReturn, ICombination } from "../../../types";
import axios from "axios";
import { Button, CheckBox, Input, ListItem } from "@rneui/base";
import LottieView from "lottie-react-native";
import Feather from "react-native-vector-icons/Feather";
import Modal from "react-native-modal";
import { AuthContext } from "../../context/AuthContext";

import Spinner from "react-native-loading-spinner-overlay";

import { useNavigation } from "@react-navigation/native";

const AddScreen = () => {
  const BASE_URL = "https://diamonds.up.railway.app/api";
  const navigation = useNavigation();

  //AUTH CONTEXT
  const { userInfo } = useContext(AuthContext);

  //INPUT MODAL
  const [modal, setmodal] = useState(false);
  const handleModal = () => {
    if (gameValue === null || timeValue === null)
      return Alert.alert("Select game and time");
    setmodal(!modal);
  };

  //COMBINATIONS
  const [combinations, setcombinations] = useState<ICombination[]>([]);

  //COMBINATIONS
  const [number, setnumber] = useState("");
  const [bet, setbet] = useState("");

  //CHECKBOX
  const [checked, setChecked] = useState(false);
  const toggleCheckbox = () => setChecked(!checked);

  //SUBMIT LOADING STATE
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  //SUBMIT LOADING STATE
  const [isPrintLoading, setIsPrintLoading] = useState(false);

  //FUNCTIONS
  function handleAdd() {
    if (number === "" || bet === "") return Alert.alert("Invalid");
    if (checked) {
      if (gameValue === "S3" && parseInt(bet) < 6)
        return Alert.alert("Rumble should atleast 6 minimum bet!");
      if (combinations.length + 6 > 20)
        return Alert.alert("Max limit reached!");

      const generatedNumbers = useGenerateCombinations(number);
      const allRumbleBets = generatedNumbers.map((num) => ({
        id: cuid(),
        number: num,
        bet: (parseFloat(bet) / generatedNumbers.length).toFixed(2),
        game: gameValue,
        time: timeValue,
        rumble: checked,
      }));

      setcombinations([...combinations, ...allRumbleBets]);
    } else {
      if (gameValue === "S2" && number.length !== 2)
        return Alert.alert("Input 2 numbers!");
      if (gameValue === "S3" && number.length !== 3)
        return Alert.alert("Input 3 numbers!");
      if (gameValue === "S4" && number.length !== 4)
        return Alert.alert("Input 4 numbers!");
      if (combinations.length + 1 > 20)
        return Alert.alert("Max limit reached!");
      setcombinations([
        ...combinations,
        {
          id: cuid(),
          number: number,
          bet: bet,
          game: gameValue,
          time: timeValue,
          rumble: checked,
        },
      ]);
    }

    handleModal();
    setnumber("");
    setbet("");
    setChecked(false);
  }

  function handleSubmit() {
    if (gameValue === null || timeValue === null)
      return Alert.alert("Please select time and game!");
    if (combinations.length === 0) return Alert.alert("Please add a number!");
    // if (!isValidPhilippinePhoneNumber(sendTo))
    //   return Alert.alert("Invalid phone number!");
    setIsSubmitLoading(true);
    axios({
      method: "post",
      url: `${BASE_URL}/Agent/Bets`,
      data: {
        game_type: gameValue,
        draw_time: timeValue,
        combinations: JSON.stringify(combinations),
      },
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
      .then(function (response) {
        setIsSubmitLoading(false);
        setcombinations([]);
        console.log("add", response.data);
        navigation.navigate("Details", {
          code: response.data.success.transaction_code,
        });
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status === 404) {
            Alert.alert("API link is not found.");
            setIsSubmitLoading(false);
          } else {
            Alert.alert(error.response.data.error);
            setIsSubmitLoading(false);
          }
        } else if (error.request) {
          Alert.alert("No internet connection.");
          setIsSubmitLoading(false);
        } else {
          Alert.alert(
            "An error occurred. Please check your network connection."
          );
          setIsSubmitLoading(false);
        }
      });
  }

  // TIME STATE
  const [timeValue, settimeValue] = useState(null);
  const [istimeFocus, setIstimeFocus] = useState(false);

  // GAME STATE
  const [gameValue, setGameValue] = useState(null);
  const [isGameFocus, setIsGameFocus] = useState(false);

  const timeData = [
    { label: "2PM", value: "2pm" },
    { label: "5PM", value: "5pm" },
    { label: "9PM", value: "9pm" },
  ];
  const gameData = [
    { label: "S2", value: "S2" },
    { label: "S3", value: "S3" },
    ...(timeValue === "9pm" ? [{ label: "S4", value: "S4" }] : []),
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

  return (
    <View style={styles.container}>
      {/* SUBMIT LOADING  */}
      {isSubmitLoading && <Spinner visible={isSubmitLoading} />}

      {/* PRINT LOADING  */}
      {isPrintLoading && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              flex: 1,
              zIndex: 1,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <LottieView
            source={require("../../../assets/messageLoading.json")}
            style={{ width: 200, height: 200 }}
            autoPlay
            loop
          />
        </View>
      )}
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
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "700",
              color: "#e0e1dd",
              marginLeft: 4,
            }}
          >
            ₱
            {Math.round(
              combinations.reduce(
                (total, combination) => total + parseFloat(combination.bet),
                0
              )
            )}
          </Text>
        </View>
        <Button
          buttonStyle={{
            backgroundColor: "#2a9d8f",
            width: 100,
            borderRadius: 50,
          }}
          onPress={handleSubmit}
          title={"Submit"}
        />
        {/* <Button onPress={sendSMS} title={"Submit"} /> */}
      </View>
      {/* DROPDOWN */}
      <View style={{ flexDirection: "row" }}>
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

      {/* <View>
        <Input
          placeholder="Phone number"
          value={sendTo}
          onChangeText={(text) => setSendTo(text)}
          keyboardType="numeric"
          maxLength={11}
        />
      </View> */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          // backgroundColor: "#f5f5f5",
          borderRadius: 8,
          paddingBottom: 10,
          paddingHorizontal: 16,
        }}
      >
        <Button
          onPress={() => setcombinations([])}
          buttonStyle={{
            backgroundColor: "#264653",
            width: 100,
            borderRadius: 50,
          }}
          title={"Clear"}
        />

        <Button
          onPress={handleModal}
          buttonStyle={{
            backgroundColor: "#264653",
            width: 100,
            borderRadius: 50,
          }}
          title={"Add"}
        />
      </View>

      <View>
        <FlatList
          data={combinations}
          renderItem={({ item, index }) => (
            <ListItem.Swipeable
              bottomDivider
              rightWidth={90}
              minSlideWidth={40}
              rightContent={(action) => (
                <Button
                  containerStyle={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "#f4f4f4",
                  }}
                  type="clear"
                  icon={{ name: "delete-outline" }}
                  onPress={() => {
                    setcombinations(
                      combinations.filter((i) => i.id !== item.id)
                    );
                  }}
                />
              )}
            >
              <ListItem.Content style={{ flexDirection: "row" }}>
                <ListItem.Content>
                  <ListItem.Title>
                    {`${index + 1}.   `}
                    {item.number}
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Content right>
                  <ListItem.Subtitle>₱{item.bet}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem.Swipeable>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* ADD MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={modal}
        onShow={() => {
          (this as any)?.textInput.focus();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text></Text>
              <Feather onPress={handleModal} name="x" size={24} color="black" />
            </View>
            <Input
              placeholder="Number"
              ref={(input: any) => {
                (this as any).textInput = input;
              }}
              // autoFocus={true}
              value={number}
              onChangeText={(text) => setnumber(text)}
              keyboardType="numeric"
              // errorMessage="Please enter a number"
            />
            <Input
              placeholder="Amount"
              value={bet}
              onChangeText={(text) => setbet(text)}
              keyboardType="numeric"
            />
            <View style={{ marginLeft: -12, marginTop: -20, marginBottom: 10 }}>
              <CheckBox
                checked={checked}
                onPress={toggleCheckbox}
                iconType="material-community"
                checkedIcon="checkbox-outline"
                uncheckedIcon={"checkbox-blank-outline"}
                title="Rumble"
                size={35}
                checkedColor="#2a9d8f"
              />
            </View>
            <Button
              buttonStyle={{ backgroundColor: "#2a9d8f", borderRadius: 50 }}
              onPress={handleAdd}
              title={"Add"}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeredView: {
    flex: 1,
    marginTop: 22,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  centeredViewPrint: {
    // flex: 1,
    // marginTop: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  table: {
    // height: 450,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#90e0ef",
  },
  left_List: {
    flexDirection: "row",
  },
  left_List_Right: {
    paddingLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  game: {},
  number: {
    fontSize: 24,
    fontWeight: "500",
  },
  time: {},
  amount: {
    fontSize: 25,
  },
  floatingButton: {
    justifyContent: "flex-end",
    marginBottom: 40,
    // position: "absolute",
    // justifyContent: "center",
    // bottom: 10, // Adjust this value as needed
    // right: 30, // Adjust this value as needed
    // left: 30, // Adjust this value as needed
    // backgroundColor: "skyblue",
    // borderRadius: 100,
    // padding: 24,
    // elevation: 5,
  },

  subHeader: {
    backgroundColor: "#2089dc",
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
    marginBottom: 0,
    fontSize: 16,
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
