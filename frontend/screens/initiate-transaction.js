import { Layout, Input, Text, Button, Spinner } from "@ui-kitten/components";
import { useState, useRef } from "react";
import global from "../global";
import { CameraView, useCameraPermissions } from "expo-camera";
// import * as FaceDetector from 'expo-face-detector';
import { View } from "react-native";
import TransactionSuccess from "./transaction-success";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Keyboard,BackHandler } from 'react-native';
export default function InitiateTransaction() {
  const [mobNo, setMobNo] = useState("");
  const [pin, SetPin] = useState("");
  const [amt, setAmt] = useState("");

  const [transactionStatus, setTransactionStatus] = useState("NO"); // NO, YES, SUCCESS, FAILURE
  const [openCamera, setOpenCamera] = useState(false);
  const [canTakePic, setCanTakePic] = useState(false);
  const [verified, setVerified] = useState(false);
  const cameraref = useRef(null);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const RupeePrefix = () => (
    <Text style={{ fontSize: 16, marginRight: 0,color:"#238",fontFamily:"Main" }}>₹</Text>
  );
  const NumPrefix = () => (
    <Text style={{ fontSize: 14, marginRight: 0,color:"#238",fontFamily:"Main" }}>+91</Text>
  );
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={global.screen}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
    // requestPermission();
  }

  const handleFacesDetected = ({ faces }) => {
    setCanTakePic(faces.length == 1);
  };

  const takePicture = async () => {
    if (cameraref) {
      try {
        const imageBase64 = await cameraref.current.takePictureAsync({
          base64: true,
          quality: 1,
          imageType: "jpg",
        });

        console.log("verifying");

        var result = await fetch("http://192.168.212.102:8000/compareFace/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: mobNo,
            image: imageBase64.base64.split(",")[1],
          }),
        });

        console.log(await result.json());

        // If face match take to transaction processing page
        if (result.status == 200) {
          setVerified(true);
          setOpenCamera(false);

          // Take to transaction processing page
          setTransactionStatus("YES");

          const ph = await AsyncStorage.getItem("phone");
          var receipt = await fetch("http://192.168.212.102:8000/transaction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: mobNo,
              to: ph,
              pass: pin,
              amount: parseInt(amt),
              note: "tago",
            }),
          });

          if (receipt.status == 200) {
            receipt = await receipt.json();
            console.log(receipt);
            setTransactionStatus(receipt.status);
          } else {
            receipt = await receipt.json();
            Alert.alert("OOPS", receipt.message, [
              { text: "OK", onPress: () => console.log("alert done") },
            ]);

            resetState();

            // return;
          }

          // receipt = await receipt.json();
          // console.log(receipt);
          // setTransactionStatus(receipt.status);
        } else {
          Alert.alert("OOPS", "Could not verify it's you", [
            { text: "OK", onPress: () => console.log("alert done") },
          ]);

          setOpenCamera(false);
          setTransactionStatus("NO");
          setVerified(false);
        }

        // Send this image to backend to match
      } catch (e) {
        setOpenCamera(false);
        setTransactionStatus("NO");
        setVerified(false);

        console.log(e);
      }
    }
  };

  function resetState() {
    setOpenCamera(false);
    setTransactionStatus("NO");
    setVerified(false);
    setMobNo(null);
    SetPin(null);
    setAmt(null);
  }

  return (
    <Layout style={global.screen}>
      {transactionStatus == "NO" ? (
        <Layout style={global.screen}>
          {!openCamera ? (
            <Layout>
              <Text
                style={[
                  global.headerText,
                  {
                    fontFamily: "ExtraBold",
                    paddingTop: 0,
                    marginTop: 0,
                    
                  },
                ]}
              >
                Receive Payment
              </Text>
              <Input
                style={global.input}
                textStyle={{ fontFamily: "Main" }}
                label="Mobile Number"
                placeholder="Enter your Mobile Number"
                value={mobNo}
                onChangeText={(text) => setMobNo(text)}
                keyboardType="numeric"
                accessoryLeft={NumPrefix}
              />
              <Input
                style={global.input}
                textStyle={{ fontFamily: "Main" }}
                label="Amount"
                placeholder="Enter amount"
                value={amt}
                onChangeText={(text) => setAmt(text)}
                keyboardType="numeric"
                accessoryLeft={RupeePrefix}
              />
              <Input
                style={global.input}
                label="PIN"
                placeholder="Enter your 4 digit PIN"
                value={pin}
                secureTextEntry
                onChangeText={
                  (text) => {SetPin(text)
                  if (text.length === 4) {
                  Keyboard.dismiss()}
                }}
                keyboardType="numeric"
                maxLength={4}
              />
              <Button
                onPress={() => setOpenCamera(true)}
                style={[global.button,{ width: 120, marginBottom: 0, marginTop: 20 },]}
              >
                <Text
                  style={[
                    global.subHeaderText,
                    { fontFamily: "Main", paddingStart: 0, fontSize: 10 },
                  ]}
                >
                  Submit
                </Text>
              </Button>
            </Layout>
          ) : (
            <View style={global.screen}>
              <CameraView
                onFacesDetected={handleFacesDetected}
                ref={cameraref}
                style={{ flex: 1 }}
                facing={facing}
              >
                <Button
                  onPress={() => setFacing(facing === "back" ? "front" : "back")}
                  style={{
                    position: "absolute",
                    top: 50,
                    right: 30,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "#238",
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}
                  accessoryLeft={() => (
                    <Ionicons name="camera-reverse-sharp" size={30} color="#fff" />
                  )}
                />


                <Button
                  onPress={takePicture}
                  style={{
                    position: "absolute",
                    bottom: 50,
                    alignSelf: "center",
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}
                  accessoryLeft={() => (
                    <Ionicons name="camera" size={40} color="#082f66" />
                  )}
                />


                {/* <Button
                  style={[global.button, { position: "absolute", bottom: 200 }]}
                  appearance="filled"
                  onPress={takePicture}
                >
                  <Text>Verify</Text>
                </Button>

                <Button
                  style={[global.button, { position: "absolute", bottom: 130 }]}
                  appearance="outline"
                  onPress={() =>
                    setFacing(facing === "back" ? "front" : "back")
                  }
                >
                  <Text>
                    {facing === "back" ? "Switch to Front" : "Switch to Back"}
                  </Text>
                </Button> */}
              </CameraView>
            </View>
          )}
        </Layout>
      ) : (
        <TransactionSuccess
          transactionStatus={transactionStatus}
          onPressDone={resetState}
        />
      )}
    </Layout>
  );
}
