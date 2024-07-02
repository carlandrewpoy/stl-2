import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Button, Card, ListItem } from "@rneui/base";
import { printNamecard } from "../../namecard";

const DetailsScreen = ({ route }) => {
  const { code } = route.params;
  const { userInfo } = useContext(AuthContext);
  const [data, setData] = useState();
  console.log({ data });

  const BASE_URL = "https://diamonds.up.railway.app/api";

  const Fetch = () => {
    axios({
      method: "get",
      url: `${BASE_URL}/Agent/Transactions/${code}`,

      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
      .then(function (response) {
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    Fetch();
  }, []);
  return (
    <View style={{ position: "relative", flex: 1 }}>
      <Card containerStyle={{}}>
        <Text style={{ textAlign: "center" }}>{code}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Game</Text>
          <Text>{data?.game_type}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Draw</Text>
          <Text>{data?.draw_time}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Time</Text>
          <Text>{data?.bet_time}</Text>
        </View>
      </Card>
      <Card containerStyle={{ maxHeight: 390 }}>
        <FlatList
          persistentScrollbar
          data={data?.combinations}
          renderItem={({ item }) => (
            <>
              <ListItem bottomDivider>
                <ListItem.Content>
                  <View>
                    <ListItem.Subtitle>{item.combination}</ListItem.Subtitle>
                  </View>
                </ListItem.Content>
                <ListItem.Content right>
                  <ListItem.Subtitle right>₱{item.bet}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            </>
          )}
        />
      </Card>
      <View
        style={{
          position: "absolute",
          bottom: 15,
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Button
          onPress={() => printNamecard({ success: data })}
          buttonStyle={{ borderRadius: 10, width: 200 }}
        >
          Print
        </Button>
      </View>
      {/* <Card containerStyle={{}}>
        <Text>{game_type}</Text>
      </Card> */}

      {/* <Text>{game_type}</Text>
      <Text>{JSON.stringify(data)}</Text> */}
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({});
