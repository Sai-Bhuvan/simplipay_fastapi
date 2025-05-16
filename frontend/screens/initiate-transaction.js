import { Layout, Input, Text, Button, Spinner } from "@ui-kitten/components";
import { useState, useRef } from "react";
import global from "../global";
import { CameraView,useCameraPermissions } from "expo-camera";
// import * as FaceDetector from 'expo-face-detector';
import { View } from "react-native";
import TransactionSuccess from "./transaction-success";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export default function InitiateTransaction() {
    const [mobNo, setMobNo] = useState("");
    const [pin, SetPin] = useState("");
    const [amt, setAmt] = useState("");

    const [transactionStatus, setTransactionStatus] = useState('NO'); // NO, YES, SUCCESS, FAILURE
    const [openCamera, setOpenCamera] = useState(false);
    const [canTakePic, setCanTakePic] = useState(false);
    const [verified, setVerified] = useState(false);
    const cameraref = useRef(null);
    const [facing, setFacing] = useState('front');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={global.screen}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
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
                    imageType:"jpg"
                });

                console.log('verifying');

                var result = await fetch('http://127.0.0.1:8000/compareFace/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone: mobNo,
                        image: imageBase64.base64.split(",")[1]
                    })
                });

                // result = await result.json();
                console.log(await result.json());

                // If face match take to transaction processing page
                if (result.status == 200) {
                    setVerified(true);
                    setOpenCamera(false);

                    // Take to transaction processing page
                    setTransactionStatus('YES');

                    const ph = await AsyncStorage.getItem('phone');
                    var receipt = await fetch('http://127.0.0.1:8000/transaction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            from: mobNo,
                            to: ph,
                            pass: pin,
                            amount: parseInt(amt),
                            note:"tago"
                        })
                    });

                    if(receipt.status == 200) {
                        receipt = await receipt.json();
                        console.log(receipt);
                        setTransactionStatus(receipt.status);                        
                    } 
                    else {
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
                }
                else {
                    Alert.alert("OOPS", "Could not verify it's you", [
                        { text: "OK", onPress: () => console.log("alert done") },
                    ]);

                    setOpenCamera(false);
                    setTransactionStatus('NO');
                    setVerified(false);
                }

                // Send this image to backend to match
            } catch (e) {
                setOpenCamera(false);
                setTransactionStatus('NO');
                setVerified(false);

                console.log(e);
            }
        }
    }

    function resetState() {
        setOpenCamera(false);
        setTransactionStatus('NO');
        setVerified(false);
        setMobNo(null);
        SetPin(null);
        setAmt(null);

    }


    return (
        <Layout style={global.screen}>
            {
                transactionStatus == 'NO' ? (<Layout style={global.screen}>
                    {!openCamera ?
                        <Layout>
                            <Input
                                style={global.input}
                                label="Mobile Number"
                                placeholder='Enter your Mobile Number'
                                value={mobNo}
                                onChangeText={(text) => setMobNo(text)}
                                keyboardType='numeric' />
                            <Input
                                style={global.input}
                                label="Amount"
                                placeholder='Enter amount'
                                value={amt}
                                onChangeText={(text) => setAmt(text)}
                                keyboardType='numeric' />
                            <Input
                                style={global.input}
                                label="PIN"
                                placeholder='Enter your 4 digit PIN'
                                value={pin}
                                onChangeText={(text) => SetPin(text)}
                                keyboardType='numeric' />
                            <Button
                                style={global.button}
                                appearance='outline'
                                onPress={() => setOpenCamera(true)}
                            >
                                <Text>Submit</Text>
                            </Button>
                        </Layout>
                        :
                        <View style={global.screen}>
                            <CameraView
                                onFacesDetected={handleFacesDetected}
                                // faceDetectorSettings={{
                                //     mode: FaceDetector.FaceDetectorMode.fast,
                                //     detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                                //     runClassifications: FaceDetector.FaceDetectorClassifications.none,
                                //     minDetectionInterval: 100,
                                //     tracking: true
                                // }}
                                ref={cameraref}
                                style={{ flex: 1 }}
                                type={facing}
                            >
                                <Button
                                    style={[global.button, { position:'absolute',bottom:200 }]}
                                    appearance='outline'
                                    onPress={takePicture}
                                ><Text>Verify</Text></Button>
                            </CameraView>
                        </View>}
                </Layout>) : <TransactionSuccess transactionStatus={transactionStatus} onPressDone={resetState} />
            }
        </Layout>
    );
}