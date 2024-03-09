import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Button, Card } from "@rneui/base";
import Modal from "react-native-modal";
import DatePicker from "react-native-modern-datepicker";
import { Dropdown } from "react-native-element-dropdown";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL, API_TOKEN } from "@env";
import { IResults } from "../../../types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { ScrollView } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useGetAllResults } from "../../hooks/api/useGetResults";
import Spinner from "react-native-loading-spinner-overlay";
import NetworkError from "../../components/NetworkError";
import LottieView from "lottie-react-native";

const ResultsScreen = () => {
  //AUTH CONTEXT
  const { userInfo } = useContext(AuthContext);

  //DATEPICKER
  const today = new Date();
  const startDate = format(today.setDate(today.getDate()), "yyyy-MM-dd");

  const [date, setdate] = useState(startDate);
  const [newDate, setnewDate] = useState<string>();

  //DATE PICKER STATE
  const [isModalVisible, setModalVisible] = useState(false);
  const dateModal = () => {
    setModalVisible(!isModalVisible);
  };

  function convertDate(stringdate: string) {
    const convertedDate = stringdate.replace(/\//g, "-");
    return convertedDate;
  }

  function handleChange(propDate: string) {
    setnewDate(convertDate(propDate));
    const dateObject = parseISO(date);
    const formattedDate = format(dateObject, "MMMM dd, yyyy");
  }

  function stringdate(date: string) {
    const dateObject = parseISO(date);
    const formattedDate = format(dateObject, "MMMM dd, yyyy");
    return formattedDate;
  }

  function formattedDistance(date: string) {
    const dateTime = parseISO(date);
    const formattedDistance = formatDistanceToNow(dateTime, {
      addSuffix: true,
    });
    return formattedDistance;
  }

  function handleNewDate() {
    setdate(newDate);
    dateModal();
  }

  const {
    data: results,
    isLoading,
    refetch,
    error,
    isError,
  } = useGetAllResults(date);
  // let results = data;
  console.log({ results });

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) refetch();
  }, [date, isFocused]);

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

      {isLoading && <Spinner visible={isLoading} />}

      {isError && <NetworkError message={error.message} />}
      {!isError && !results?.stwo && !results?.sThree && !results?.S4 && (
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
      {results?.stwo && (
        <Card containerStyle={{ backgroundColor: "#778da9", borderRadius: 10 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "#e0e1dd",
                backgroundColor: "#415a77",
                borderRadius: 100,
                width: 70,
                height: 70,
                padding: 10,
                textAlign: "center",
              }}
            >
              2D
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={{ position: "relative" }}>
              {results.stwo.twoPm && (
                <>
                  <Text style={styles.time}>{results.stwo.twoPm.result}</Text>
                  <Text style={styles.textColor}>02:00 pm</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      right: 5,
                      backgroundColor: "#e9c46a",
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                    }}
                  >
                    {/* <FontAwesome6
                      name="face-grin-stars"
                      size={15}
                      color="#e0e1dd"
                    /> */}
                    <Text style={{ color: "#264653" }}>
                      {results.stwo.twoPm.wins}
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View>
              {results.stwo.fivePm && (
                <>
                  <Text style={styles.time}>{results.stwo.fivePm.result}</Text>
                  <Text style={styles.textColor}>05:00 pm</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      right: 5,
                      backgroundColor: "#e9c46a",
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                    }}
                  >
                    {/* <FontAwesome6
                      name="face-grin-stars"
                      size={15}
                      color="#e0e1dd"
                    /> */}
                    <Text style={{ color: "#264653" }}>
                      {results.stwo.fivePm.wins}
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View>
              {results.stwo.ninePm && (
                <>
                  <Text style={styles.time}>{results.stwo.ninePm.result}</Text>
                  <Text style={styles.textColor}>09:00 pm</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      right: 5,
                      backgroundColor: "#e9c46a",
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                    }}
                  >
                    {/* <FontAwesome6
                      name="face-grin-stars"
                      size={15}
                      color="#e0e1dd"
                    /> */}
                    <Text style={{ color: "#264653" }}>
                      {results.stwo.ninePm.wins}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </Card>
      )}
      {results?.sThree && (
        <Card
          containerStyle={{
            backgroundColor: "#778da9",
            borderRadius: 10,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "#e0e1dd",
                backgroundColor: "#415a77",
                borderRadius: 100,
                width: 70,
                height: 70,
                padding: 10,
                textAlign: "center",
              }}
            >
              3D
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={{ position: "relative" }}>
              {results.sThree.twoPm && (
                <>
                  <Text style={styles.time}>{results.sThree.twoPm.result}</Text>
                  <Text style={styles.textColor}>02:00 pm</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      right: -18,
                      backgroundColor: "#e9c46a",
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                    }}
                  >
                    {/* <FontAwesome6
                      name="face-grin-stars"
                      size={15}
                      color="#e0e1dd"
                    /> */}
                    <Text style={{ color: "#264653" }}>
                      {results.sThree.twoPm.wins}
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View>
              {results.sThree.fivePm && (
                <>
                  <Text style={styles.time}>
                    {results.sThree.fivePm.result}
                  </Text>
                  <Text style={styles.textColor}>05:00 pm</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      right: -18,
                      backgroundColor: "#e9c46a",
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                    }}
                  >
                    {/* <FontAwesome6
                      name="face-grin-stars"
                      size={15}
                      color="#e0e1dd"
                    /> */}
                    <Text style={{ color: "#264653" }}>
                      {results.sThree.fivePm.wins}
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View style={{ marginRight: 8 }}>
              {results.sThree.ninePm && (
                <>
                  <Text style={styles.time}>
                    {results.sThree.ninePm.result}
                  </Text>
                  <Text style={styles.textColor}>09:00 pm</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      right: -18,
                      backgroundColor: "#e9c46a",
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                    }}
                  >
                    {/* <FontAwesome6
                      name="face-grin-stars"
                      size={15}
                      color="#e0e1dd"
                    /> */}
                    <Text style={{ color: "#264653" }}>
                      {results.sThree.ninePm.wins}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </Card>
      )}

      {results?.S4 && (
        <Card>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View></View>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>4D</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View>
              {results?.S4.ninePm && (
                <>
                  <Text style={styles.time}>{results?.S4.ninePm.result}</Text>
                  <Text>09:00 pm</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingTop: 8,
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="trophy-variant-outline"
                      size={15}
                      color="gray"
                    />
                    <Text style={{ marginLeft: 3 }}>
                      {results?.S4.ninePm.wins}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </Card>
      )}
    </View>
  );
};

export default ResultsScreen;

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
    borderColor: "gray",
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
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  time: {
    fontSize: 35,
    fontWeight: "600",
    color: "#1b263b",
    zIndex: 10,
  },
  textColor: {
    color: "#1b263b",
  },
  total: {
    fontSize: 30,
    fontWeight: "400",
  },
});
