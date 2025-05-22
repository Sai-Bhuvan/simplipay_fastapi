
import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
import global from "../global";
// import { pid } from "process";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, Alert,Image } from "react-native";
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { ScrollView,KeyboardAvoidingView,Platform } from "react-native";
export default function SignIn({ onPageChange }) {
    const [Pin, setPin] = useState("");
    const [phoneNo, setPhoneNo] = useState();

    async function Login() {
        const mobNo = await AsyncStorage.getItem('phone');
        console.log(mobNo)
        try {
        var result = await fetch("http://192.168.212.102:8000/sign-in", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    pin: Pin,
                    phone: phoneNo,
                }
            )
            
        });
        if (result.status == 200) {
            // Alert.alert(" password Ok", "you have entered the correct password. ", [
            //     { text: "OK", onPress: () => console.log("alert done") },
            // ]);
            result = await result.json();
            console.log(result);
            await AsyncStorage.setItem('phone', phoneNo);
            await AsyncStorage.setItem('isMerchant', String(result.isMerchant));
            onPageChange('HomePage');
        }
        else {
            Alert.alert("Wrong password", "you have entered the wrong password. Please try again. ", [
                { text: "OK", onPress: () => console.log("alert done") },
            ]);
        }
        } catch (error) {
            console.log(error);
        }
        
    }
    return (
        <Layout style={global.screen}>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    keyboardVerticalOffset={600}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Layout style={global.screen}>
      <Image
      source={require('../assets/logos/Darklogotrans.png')}
      style={{ width: 200, height: 200, marginTop: 0, marginBottom: 0, alignSelf: 'center' }}
      resizeMode="contain"
    />
        <Text style={[global.headerText,{fontFamily:'ExtraBold',paddingTop: 0,    
    marginTop: 0,}]}>Sign In</Text>
        <Layout style={[global.container,{alignItems:'center',justifyContent: 'flex-start'}]}>
          <Input
            placeholder="Enter Phone number"
            label={<Text style={[global.headerText,{fontFamily:'Main'}]}>Phone no</Text>}
            style={global.input}
            value={phoneNo}
            onChangeText={(text) => setPhoneNo(text)}
          />

          <Input
            placeholder="Enter PIN"
            label="PIN"
            textStyle={{fontFamily:'Main'}}
            maxLength={4}
            style={global.input}
            secureTextEntry
            value={Pin}
            onChangeText={(text) => setPin(text)}
          />

          <Button onPress={Login} style={[global.button,{marginBottom:10}]}>
            <Text style={[global.touchableComp,{fontFamily:'Main'}]}>Login</Text>
          </Button>
        
          <Layout>
          <Text style={[{fontFamily:'Main',alignSelf:'center',textDecorationLine:'underline',marginBottom:5}]}>Not yet registered?</Text>
            <Button onPress={() => onPageChange('SignUp')} style={[global.button,{width:120,marginBottom:30,marginTop:0}]}>
              <Text style={[global.touchableComp,{fontFamily:'Main'}]}>Sign-up</Text>
            </Button>
          </Layout>
        </Layout>
      </Layout>
    </ScrollView>
  </KeyboardAvoidingView>
</Layout>

    )
}

const styles = StyleSheet.create({
    text1: {
        marginTop: 100,
        fontSize: 25,
        fontWeight: 400,
    },
    text2: {
        color: "gray",
        marginLeft: 50,
        fontSize: 20,
        marginTop: 5,
    },
    input: {
        marginTop: 200,
        borderBottomWidth: 2,
        borderColor: "#19A7CE",
        fontSize: 30,
        width: 200,
        textAlign: "center",
        marginLeft: 30

    },
})
