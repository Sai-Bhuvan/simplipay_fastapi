import {
    Text,
    Layout,
    List,
    Button,
    Divider,
    Card,
    Input,
    Icon,
    Modal,
  } from "@ui-kitten/components";
  import React, { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import global from "../global";
  // import { ScrollView } from 'react-native-web';
  
  const data = new Array(8).fill({
    title: "Item",
  });
  
  export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [phoneNo, setPhoneNo] = useState(null);
    useEffect(() => {
      fetchTransactions();
    }, []);
  
    const [searchString, setSearchString] = useState("");
    const [searchItems, setSearchItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
  
    async function fetchTransactions() {
      const mobNo = await AsyncStorage.getItem("phone");
      var result = await fetch(
        "http://192.168.212.102:8000/previous-transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: mobNo,
          }),
        }
      );
      result = await result.json();
  
      // console.log(result);
  
      setPhoneNo(await AsyncStorage.getItem("phone"));
      setTransactions(result.transactions);
      setSearchItems(result.transactions);
    }
  
    useEffect(() => {
      searchTransaction();
    }, [searchString]);
  
    function searchTransaction() {
      if (searchString.length == 0) {
        setSearchItems(transactions);
        return;
      }
  
      var t = transactions.filter((x) =>
        JSON.stringify(x).includes(searchString)
      );
  
      setSearchItems(t);
    }
  
    const AmountRight = ({ amount, type, status }) => {
      return status == "FAILURE" ? (
        <Text status={"primary"}>Fail</Text>
      ) : type == "credit" ? (
        <Text>{amount}</Text>
      ) : (
        <Text status={"danger"}>{amount}</Text>
      );
    };
  
    const renderItem = ({ item }) => {
      const type =
        item.to === "self"
          ? "credit"
          : phoneNo === item.from
          ? "debit"
          : "credit";
      const cardColor = type === "credit" ? "#ffcccb" : "#ffcccb";
  
      return (
        <Card
          style={{ backgroundColor: "transparent",   }}
          onPress={() => {
            setSelectedTransaction(item);
            setModalVisible(true);
          }}
        >
          <Layout
            style={{
              backgroundColor: "white",
              marginVertical: 5,
              borderRadius: 16,
              padding: 16,
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              borderColor: '#238',
              borderWidth: 2,  
            }}
          >
            <Text category="s1" style={{ fontFamily: "ExtraBold" }}>
              From: {item.from}
            </Text>
            <Text style={{ fontFamily: "Main" }} category="s1">
              To: {item.to}
            </Text>
            <Text appearance="hint" category="c1" style={{ fontFamily: "Main" }}>
              Time: {new Date(item.time).toLocaleString()}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                marginTop: 8,
                fontFamily: "Main",
              }}
            >
              ₹ {item.amount}
            </Text>
          </Layout>
        </Card>
      );
    };
  
    return (
      <Layout style={[global.screen,]}>
        {transactions.length > 0 ? (
          <Layout>
            <Layout style={{ flexDirection: "row" }}>
              <Input
                style={{ marginHorizontal: 10,marginBottom:10, width: "80%" }}
                placeholder={"Search"}
                textStyle={{ fontFamily: "Main" }}
                value={searchString}
                onChangeText={(val) => {
                  setSearchString(val);
                  // searchTransaction();
                }}
              ></Input>
              <Button
                style={[
                  global.button,
                  {
                    width: 60,
                    marginTop: 0,
                    height: 20,
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                    marginBottom:10,
                  },
                ]}
                onPress={() => {
                  fetchTransactions();
                }}
              >
                <Text style={[global.touchableComp, { fontFamily: "Main" }]}>
                  Get
                </Text>
              </Button>
            </Layout>
            {/* <ScrollView> */}
            <List
              // style = {{maxHeight:650}}
              data={searchItems}
              ItemSeparatorComponent={<Divider />}
              renderItem={renderItem}
            />
            {selectedTransaction && (
              <Modal
                visible={modalVisible}
                style={{paddingHorizontal:20}}
                backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                onBackdropPress={() => setModalVisible(false)}
              >
                <Card disabled={true}>
                  <Text
                    style={[
                      {
                        fontSize: 30,
                        marginBottom: 10,
                        fontFamily: "Main",
                        textAlign: "center",
                        color: "#082f66",
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    Transaction Details
                  </Text>
                  <Text style={{ fontFamily: "Main" }}>
                    From: {selectedTransaction.from}
                  </Text>
                  <Text>To: {selectedTransaction.to}</Text>
                  <Text style={{ fontFamily: "Main" }}>
                    Time: {new Date(selectedTransaction.time).toLocaleString()}
                  </Text>
                  <Text style={{ fontFamily: "Main" }}>
                    Status: {selectedTransaction.status}
                  </Text>
                  <Text style={{ fontFamily: "Main" }}>
                    Amount: ₹ {selectedTransaction.amount}
                  </Text>
                  <Text style={{ fontFamily: "Main" }}>
                    Hash: {selectedTransaction.transactionHash}
                  </Text>
                  <Button
                    onPress={() => setModalVisible(false)}
                    style={[global.button]}
                  >
                    Close
                  </Button>
                </Card>
              </Modal>
            )}
            {/* </ScrollView>    */}
          </Layout>
        ) : (
          <Layout style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>No Previous Transactions</Text>
            <Button
              style={{ margin: 15 }}
              onPress={() => {
                fetchTransactions();
              }}
            >
              Fetch
            </Button>
          </Layout>
        )}
      </Layout>
    );
  }
  