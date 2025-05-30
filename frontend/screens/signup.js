import {
  Layout,
  Input,
  Text,
  Button,
  Divider,
  CheckBox,
  Spinner,
} from "@ui-kitten/components";
import React, { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import global from "../global";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
// import Home from "./Home";

export default function Signup({ onPageChange }) {
  const [name, setname] = useState("");
  const [phoneno, setphoneno] = useState("");
  const [email, setemail] = useState("");
  const [shop, setshop] = useState("");
  const [shopdetails, setshopdetails] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmsetpassword] = useState("");
  const [isMerchant, setisMerchant] = useState(false);

  const [openCamera, setOpenCamera] = useState(false);
  const [canTakePic, setCanTakePic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [facing, setFacing] = useState("front");

  const cameraref = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={global.screen}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>Grant Permission</Button>
      </View>
    );
  }

  async function Submit() {
    if (!name || !phoneno || !email || !password || !confirmpassword) {
      Alert.alert("OOPS", "sorry you have not entered ", [
        { text: "OK", onPress: () => console.log("alert done") },
      ]);
    }
    if (password !== confirmpassword) {
      Alert.alert("OOPS", "sorry your passwords are not matching change it", [
        { text: "OK", onPress: () => console.log("password alert done") },
      ]);
    } else {
      setIsLoading(true);
      var res = await fetch("http://192.168.56.102:8000/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phoneNo: phoneno,
          password: password,
          shopName: shop,
          shopDetails: shopdetails,
          image: image,
          isMerchant: isMerchant,
        }),
      });

      console.log(res);
      await AsyncStorage.setItem("phone", phoneno);
      if (res.status == 200) {
        res = await res.json();
        console.log(res);
        await AsyncStorage.setItem("isMerchant", String(res.isMerchant));
        onPageChange("HomePage");
      } else {
        setIsLoading(false);
      }
    }
  }

  //   function presshandler() {
  //     Keyboard.dismiss();
  //   }

  //   const handletouch = () => {
  //     Submit();
  //   };

  //   const handleFacesDetected = ({ faces }) => {
  //     setCanTakePic(faces.length == 1);
  //   };

  const takePicture = async () => {
    if (cameraref.current) {
      try {
        const photo = await cameraref.current.takePictureAsync({
          base64: true,
          quality: 1,
          imageType: "jpg",
        });

        // const faces = await FaceDetection.detectFromFile(photo.uri);
        setImage(photo.base64);
        setOpenCamera(false);
        // if (faces.length === 1) {
        //   setImage(photo.base64);
        //   setOpenCamera(false);
        //   Alert.alert("Face Detected", "Picture captured successfully!");
        // } else {
        //   Alert.alert("Face Detection", "Please ensure only one face is visible.");
        // }
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Failed to take picture.");
        setOpenCamera(false);
      }
    }
  };

  return (
    <Layout style={global.screen}>
      {openCamera ? (
        <View style={global.screen}>
          <CameraView ref={cameraref} style={{ flex: 1 }} facing={'front'}>
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
      ) : (
        <Layout>
          <ScrollView>
            <Layout>
              <Text
                style={[
                  global.headerText,
                  {
                    fontFamily: "ExtraBold",
                    paddingTop: 0,
                    marginTop: 80,
                    
                  },
                ]}
              >
                Sign Up
              </Text>
            </Layout>

            <Layout
              style={[
                { borderWidth: 0, margin: 0, padding: 0, marginHorizontal: 20 },
              ]}
            >
              <Layout>
                <Input
                  style={[global.input]}
                  label="Name"
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={(text) => setname(text)}
                  textStyle={{ fontFamily: "Main" }}
                  keyboardType="default"
                />
                <Divider />
              </Layout>

              <Layout>
                <Input
                  style={global.input}
                  label="Moblie No"
                  placeholder="Enter your shop mobile number"
                  keyboardType="numeric"
                  textStyle={{ fontFamily: "Main" }}
                  value={phoneno}
                  onChangeText={(text) => setphoneno(text)}
                />
                <Divider />
              </Layout>

              <Layout>
                <Input
                  style={global.input}
                  label={"E-mail"}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  textStyle={{ fontFamily: "Main" }}
                  value={email}
                  onChangeText={(text) => setemail(text)}
                />
                <Divider />
              </Layout>

              <Layout>
                <CheckBox
                  checked={isMerchant}
                  onChange={(nextChecked) => setisMerchant(nextChecked)}
                  style={{ padding: 20 }}
                >
                  Are you a Merchant?
                </CheckBox>
              </Layout>
              {isMerchant && (
                <Layout style={{borderBlockColor:'#238',borderWidth: 2,borderRadius:5}}>
                  <Layout>
                    <Input
                      style={global.input}
                      label={"Shop Name"}
                      placeholder="Enter your Shop Name"
                      keyboardType="default"
                      textStyle={{ fontFamily: "Main" }}
                      value={shop}
                      onChangeText={(text) => setshop(text)}
                    />
                    <Divider />
                  </Layout>

                  <Layout>
                    <Input
                      style={global.input}
                      label={"Shop Descripton"}
                      placeholder="Describe your Shop"
                      multiline
                      editable
                      textStyle={{ fontFamily: "Main" }}
                      value={shopdetails}
                      onChangeText={(text) => setshopdetails(text)}
                      keyboardType="default"
                      numberOfLines={3}
                      maxLength={40}
                    />
                    <Divider />
                  </Layout>
                </Layout>
              )}

              <Layout>
                <Input
                  style={global.input}
                  label="Password"
                  keyboardType="number-pad"
                  textStyle={{ fontFamily: "Main" }}
                  value={password}
                  onChangeText={(text) => setpassword(text)}
                  placeholder="Enter your password"
                />
                <Divider />
              </Layout>

              <Layout>
                <Input
                  style={global.input}
                  placeholder="Confirm your Password"
                  label={"Confirm Pin"}
                  keyboardType="number-pad"
                  value={confirmpassword}
                  textStyle={{ fontFamily: "Main" }}
                  onChangeText={(text) => setconfirmsetpassword(text)}
                  secureTextEntry={true}
                />
                <Divider />
              </Layout>

              <Button
                style={[global.button,{ width: 140, marginBottom: 0, marginTop: 20 },]}
                onPress={() => setOpenCamera(true)}
              >
                <Text style={[global.touchableComp,{ fontFamily:"Main"},]}>
                    Upload Pic
                  </Text>
              </Button>
              {image != null && (
                <Text style={{ alignSelf: "center" }}>Picture Taken!</Text>
              )}

              <Layout style={{ alignItems: "center" }}>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <Button
                    style={[global.button,{ width: 120, marginBottom: 0, marginTop: 20 },]}
                    onPress={() => Submit()}
                  >
                    Sign Up
                  </Button>
                )}
                <Divider />
              </Layout>

              <Layout>
              <Text
                  style={[
                    {
                      fontFamily: "Main",
                      alignSelf: "center",
                      textDecorationLine: "underline",
                      marginBottom: 5,
                      marginTop: 20,
                    },
                  ]}
                >
                  Already registered?
                </Text>
                <Button
                style={[global.button, { marginBottom: 10,marginTop:0 }]}
                  onPress={() => {
                    onPageChange("SignIn");
                  }}
                >
                  <Text style={global.touchableComp}>
                    Login
                  </Text>
                </Button>
              </Layout>
            </Layout>
          </ScrollView>
        </Layout>
      )}
    </Layout>
  );
}
