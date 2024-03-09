import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Button, Card } from "@rneui/base";
import { useIsFocused } from "@react-navigation/native";
import Modal from "react-native-modal";
import DatePicker from "react-native-modern-datepicker";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useGetAllReports } from "../../hooks/api/getReports";
import Spinner from "react-native-loading-spinner-overlay";
import NetworkError from "../../components/NetworkError";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const ReportsScreen = () => {
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

  const isFocused = useIsFocused();
  console.log(date);
  const {
    data: reports,
    isLoading,
    refetch,
    error,
    isError,
  } = useGetAllReports(date);
  console.log({ reports });

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

      {/* {isLoading && <Text>Loading...</Text>} */}

      {isLoading && <Spinner visible={isLoading} />}
      {isError && <NetworkError message={error.message} />}

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

      {reports?.S2 && (
        <Card containerStyle={{ backgroundColor: "#778da9", borderRadius: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
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
            <View>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text
                  style={[{ fontSize: 18, paddingRight: 5 }, styles.textColor]}
                >
                  ₱
                </Text>
                <Text style={[styles.total, styles.textColor]}>
                  {reports.S2?.total}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View>
              {reports.S2?.twoPm && (
                <>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.time}>{reports.S2?.twoPm.total}</Text>
                    <Text style={styles.textColor}>02:00 pm</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 5,
                      alignItems: "center",
                    }}
                  ></View>
                </>
              )}
            </View>
            <View>
              {reports.S2?.fivePm && (
                <>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.time}>{reports.S2?.fivePm.total}</Text>
                    <Text style={styles.textColor}>05:00 pm</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 5,
                      alignItems: "center",
                    }}
                  ></View>
                </>
              )}
            </View>
            <View>
              {reports.S2?.ninePm && (
                <>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.time}>{reports.S2?.ninePm.total}</Text>
                    <Text style={styles.textColor}>09:00 pm</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 5,
                      alignItems: "center",
                    }}
                  ></View>
                </>
              )}
            </View>
          </View>
        </Card>
      )}
      {reports?.S3 && (
        <Card containerStyle={{ backgroundColor: "#778da9", borderRadius: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
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
            <View>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text
                  style={[{ fontSize: 18, paddingRight: 5 }, styles.textColor]}
                >
                  ₱
                </Text>
                <Text style={[styles.total, styles.textColor]}>
                  {reports.S3?.total}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View>
              {reports.S3?.twoPm && (
                <>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.time}>{reports.S3?.twoPm.total}</Text>
                    <Text style={styles.textColor}>02:00 pm</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 5,
                      alignItems: "center",
                    }}
                  ></View>
                </>
              )}
            </View>
            <View>
              {reports.S3?.fivePm && (
                <>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.time}>{reports.S3?.fivePm.total}</Text>
                    <Text style={styles.textColor}>05:00 pm</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 5,
                      alignItems: "center",
                    }}
                  ></View>
                </>
              )}
            </View>
            <View>
              {reports.S3?.ninePm && (
                <>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.time}>{reports.S3?.ninePm.total}</Text>
                    <Text style={styles.textColor}>09:00 pm</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 5,
                      alignItems: "center",
                    }}
                  ></View>
                </>
              )}
            </View>
          </View>
        </Card>
      )}
      {/* {reports?.S4 && (
        <Card>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text>Total</Text>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text style={{ fontSize: 18, paddingRight: 5 }}>₱</Text>
                <Text style={styles.total}>{reports.S4?.total}</Text>
              </View>
            </View>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>4D</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <View>
              {reports.S4?.ninePm && (
                <>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.time}>{reports.S4?.ninePm.total}</Text>
                    <Text>09:00 pm</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 5,
                      alignItems: "center",
                    }}
                  >
                  </View>
                </>
              )}
            </View>
          </View>
        </Card>
      )} */}
    </View>
  );
};

export default ReportsScreen;

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
    fontSize: 35,
    fontWeight: "bold",
  },
});
