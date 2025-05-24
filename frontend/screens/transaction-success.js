import { Layout, Spinner, Button } from "@ui-kitten/components";
import { useState } from "react";
import { Image } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import global from "../global";
import { useVideoPlayer, VideoView } from 'expo-video';

export default function TransactionSuccess({ transactionStatus, onPressDone }) {
    // const [isLoading, setIsLoading] = useState(false);
    const player = useVideoPlayer(require('../assets/gifs/Tick.mp4'), player => {
      player.loop = true;
      player.play();
    });
    return(

      
        <Layout style={{height: 650}}>
            {transactionStatus == 'YES' ? Processing() 
            : transactionStatus == 'SUCCESS' ? Success() : Failure()}

        </Layout>
    )

  function Processing() {
    return <Layout style={styles.loading}>
      <Text style={styles.text}>Please Wait!</Text>
      <Spinner size="giant" />
    </Layout>;
  }

  function Success() {
  return (
    <Layout>
      <Text style={global.headerText}>Transaction successful!</Text>
      <Layout style={styles.tick}>
      <VideoView style={styles.video} player={player}/>
      </Layout>
      <Button
        onPress={onPressDone}
        style={[global.button, { marginBottom: 10,justifyContent: 'center',marginTop:300,
        alignItems: 'center', }]}
      >
        <Text style={[global.touchableComp, { fontFamily: "Main" }]}>Done</Text>
      </Button>
    </Layout>
  );
}

function Failure() {
  return (
    <Layout>
      <Text style={global.headerText}>Transaction Failed!</Text>
      <Layout style={styles.tick}>
      </Layout>
      <Button
        onPress={onPressDone}
        style={[global.button, { marginBottom: 10,justifyContent: 'center',
        alignItems: 'center', }]}
      >
        <Text style={[global.touchableComp, { fontFamily: "Main" }]}>Done</Text>
      </Button>
    </Layout>
  );
}
}

const styles = StyleSheet.create({
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tick: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
        color: "white",
        fontSize: 40, 
        fontWeight: 600,
        marginTop: 30,
        justifyContent: "center",
        marginLeft: 50
    },
    video: {
      width: 250,
      height: 250,
      marginTop:300,
      justifyContent:"center",
      alignSelf:'center'
    },
  });