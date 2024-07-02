import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
} from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Button, Card } from "@rneui/base";
import Modal from "react-native-modal";
import DatePicker from "react-native-modern-datepicker";
import { Dropdown } from "react-native-element-dropdown";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL, API_TOKEN } from "@env";
import { Input, ListItem } from "@rneui/themed";
import Feather from "react-native-vector-icons/Feather";
import { AuthContext } from "../../context/AuthContext";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

import { useGetAllHits } from "../../hooks/api/useGetHits";
import Spinner from "react-native-loading-spinner-overlay";
import NetworkError from "../../components/NetworkError";
import useTimeConverter from "../../hooks/useTimeConverter";
import LottieView from "lottie-react-native";

const HitsScreen = ({ navigation }: any) => {
  const BASE_URL = "https://diamonds.up.railway.app/api";
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingRight: 10,
          }}
        >
          <TouchableOpacity
            style={{
              marginRight: 20,
            }}
            onPress={handleManualCLaimModal}
          >
            <Entypo name="text" size={24} color="black" />
            {/* <Text style={{ fontSize: 20, fontWeight: "bold" }}>Claim</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={qrModal}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="qr-code-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const { convertTimeToHumanReadable } = useTimeConverter();
  //AUTH CONTEXT
  const { userInfo } = useContext(AuthContext);
  //DATEPICKER
  const today = new Date();
  const startDate = format(today.setDate(today.getDate()), "yyyy-MM-dd");

  const [date, setdate] = useState<string>(startDate);
  const [newDate, setnewDate] = useState<string>();

  //DATE PICKER STATE
  const [isModalVisible, setModalVisible] = useState(false);
  const dateModal = () => {
    setModalVisible(!isModalVisible);
  };

  //QRCODE STATE
  const [isqrModal, setIsQrModal] = useState<boolean>(false);
  const [flashlight, setflashlight] = useState<boolean>(false);
  const handleFlashlight = () => {
    setflashlight(!flashlight);
  };
  const qrModal = () => {
    setIsQrModal(!isqrModal);
  };

  const [isClaim, setisClaim] = useState(false);

  function onRead(data: any) {
    claimAPi(data);
    qrModal();
  }

  //MANUAL CLAIM
  const [manualCLaimModal, setManualCLaimModal] = useState<boolean>(false);
  const [claimNumber, setClaimNumber] = useState<string>("");
  const handleManualCLaimModal = () => {
    setManualCLaimModal(!manualCLaimModal);
  };

  function onManualClaim() {
    claimAPi(claimNumber);
    handleManualCLaimModal();
    setClaimNumber("");
  }

  function claimAPi(data: string) {
    axios({
      method: "post",
      url: `${BASE_URL}/Agent/Hits/claim`,

      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },

      data: {
        transaction_code: data,
      },
    })
      .then(function (response) {
        Alert.alert(response.data.success);
        setisClaim(!isClaim);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          if (error.response.status === 404) {
            Alert.alert("API link is not found.");
          } else {
            Alert.alert(error.response.data.error);
          }
        } else if (error.request) {
          // The request was made but no response was received
          Alert.alert("No internet connection.");
        } else {
          // Something happened in setting up the request that triggered an error
          Alert.alert(
            "An error occurred. Please check your network connection."
          );
        }
      });
  }

  function convertDate(stringdate: string) {
    const convertedDate = stringdate.replace(/\//g, "-");
    return convertedDate;
  }

  function formatDateTime(dateTimeString: string) {
    const dateTimeObject = parseISO(dateTimeString);
    const formattedDate = format(dateTimeObject, "MMMM dd, yyyy");
    const formattedTime = format(dateTimeObject, "h:mm a");

    return `${formattedDate} - ${formattedTime}`;
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

  function firstPart(code: string) {
    const firstPart = code.split("-")[0];
    return firstPart;
  }

  function handleNewDate() {
    setdate(newDate);
    dateModal();
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
    { label: "2D", value: "2d" },
    { label: "3D", value: "3d" },
    ...(timeValue === "21:00:00" ? [{ label: "4D", value: "4d" }] : []),
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

  //HITS
  // const [hits, sethits] = useState([]);
  const isFocused = useIsFocused();
  // console.log(hits);
  const { data, refetch, isLoading, isError, error } = useGetAllHits(
    gameValue,
    timeValue,
    date
  );
  let hits = data;

  function getHits() {
    if (isFocused) refetch();
  }

  //HIT DETAILS STATE

  useEffect(() => {
    getHits();
  }, [isClaim, timeValue, gameValue, date, isFocused]);

  // const navigation = useNavigation()

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

      {isLoading && <Spinner visible={isLoading} />}

      {isError && <NetworkError message={error.message} />}

      {hits?.length === 0 && (
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

      {/* {hits.length === 0 ? (
        <View>
          <Text
            style={{
              fontSize: 18,
              paddingLeft: 18,
              fontWeight: "500",
              color: "gray",
            }}
          >
            No record...
          </Text>
        </View>
      ) : null} */}
      {/* HITS LIST */}
      <View style={styles.list}>
        <FlatList
          data={hits}
          renderItem={({ item }: any) => (
            <ListItem bottomDivider>
              <ListItem.Content>
                <TouchableOpacity>
                  <ListItem.Subtitle style={{ color: "#264653" }}>
                    {item.transaction_code}
                  </ListItem.Subtitle>

                  <ListItem.Subtitle style={{ fontSize: 20, color: "#264653" }}>
                    <Text>{item.combination}</Text>
                    {/* <Text style={{ fontSize: 12 }}> X 5</Text> */}
                  </ListItem.Subtitle>
                </TouchableOpacity>
              </ListItem.Content>
              <ListItem.Content right>
                {/* <ListItem.Title
                  right
                  style={{ textDecorationLine: "underline" }}
                >
                  View
                </ListItem.Title> */}

                <ListItem.Title
                  right
                  style={{ marginBottom: 5, color: "#415a77" }}
                >
                  {item.draw_time}
                </ListItem.Title>

                <ListItem.Subtitle right>
                  <Text style={{ paddingVertical: 10, color: "#415a77" }}>
                    {item.claimed === 0 ? "Pending" : "Claimed"}
                  </Text>
                </ListItem.Subtitle>

                {/* <ListItem.Subtitle right>
                  {formattedDistance(item.created_at)}
                </ListItem.Subtitle> */}
              </ListItem.Content>
            </ListItem>
          )}
          keyExtractor={(item: any) => item.transaction_code}
        />
      </View>

      {/* QRCODE MODAL */}
      <Modal isVisible={isqrModal}>
        <View style={[styles.modalContainer]}>
          <View style={{}}>
            <View
              style={
                {
                  // justifyContent: "space-between",
                  // marginHorizontal: 20,
                  // flexDirection: "row",
                }
              }
            >
              {/* <Text>QRCODE</Text> */}
              <View style={[StyleSheet.absoluteFill, { alignItems: "center" }]}>
                {isqrModal && (
                  <>
                    <QRCodeScanner
                      onRead={({ data }) => onRead(data)}
                      flashMode={
                        flashlight
                          ? RNCamera.Constants.FlashMode.torch
                          : RNCamera.Constants.FlashMode.off
                      }
                      // reactivate
                      // reactivateTimeout={2000}
                      showMarker
                    />
                    <View
                      style={{
                        width: "90%",
                        marginBottom: -120,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: 80,
                          height: 50,
                          backgroundColor: "#2a9d8f",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 10,
                        }}
                        onPress={handleFlashlight}
                      >
                        {/* <AntDesign name="closecircleo" size={50} color="#fff" /> */}
                        {flashlight ? (
                          <Ionicons name="flash-off" size={35} color="#fff" />
                        ) : (
                          <Ionicons name="flash" size={35} color="#fff" />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={qrModal}
                        style={{
                          width: 80,
                          height: 50,
                          backgroundColor: "#2a9d8f",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 10,
                        }}
                      >
                        <AntDesign name="close" size={35} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
              <View
                style={{
                  // flexDirection: "row",
                  justifyContent: "center",
                  height: "70%",
                }}
              >
                {/* <Button
                  buttonStyle={{ width: 120 }}
                  title={"Set"}
                  onPress={handleNewDate}
                />
                <Button
                  onPress={qrModal}
                  buttonStyle={{ width: 120 }}
                  title={"Cancel"}
                /> */}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* CLAIM MANUAL MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={manualCLaimModal}
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
              <Feather
                onPress={handleManualCLaimModal}
                name="x"
                size={24}
                color="black"
              />
            </View>
            <Input
              placeholder="Transaction code"
              ref={(input: any) => {
                (this as any).textInput = input;
              }}
              // autoFocus={true}
              value={claimNumber}
              onChangeText={(text) => setClaimNumber(text)}
              // errorMessage="Please enter a number"
            />

            <View
              style={{ marginLeft: -12, marginTop: -20, marginBottom: 10 }}
            ></View>
            <Button
              buttonStyle={{ backgroundColor: "#2a9d8f", borderRadius: 50 }}
              onPress={onManualClaim}
              title={"Claim"}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HitsScreen;

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
});
