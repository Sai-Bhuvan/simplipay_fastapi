import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Signup from './screens/signup';
import { ApplicationProvider,IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import * as Font from 'expo-font'
import SignIn from './screens/signin';
import { useState } from 'react';
import HomePage from './screens/HomePage';
import AppLoading from 'expo-app-loading';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

export default function App() {

  const [currentPage, setCurrentPage] = useState("SignIn")
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
      'Main': require('./assets/fonts/paypal-sans-font/others/PayPal.ttf'),
      'Bold': require('./assets/fonts/paypal-sans-font/others/Bold.ttf'),
      'ExtraBold': require('./assets/fonts/paypal-sans-font/others/ExtraBold.ttf'),
    });
  };

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }
  const handlechangePage = (newPage) => {
    setCurrentPage(newPage);
  }

  const renderPage = () => {
    switch(currentPage){
      case "SignUp": return <Signup onPageChange={handlechangePage}/>
      case "SignIn": return <SignIn onPageChange={handlechangePage}/>
      case "HomePage": return <HomePage onPageChange={handlechangePage}/>
    }
  }

  return(
    <>
    <IconRegistry icons={[EvaIconsPack]} />
    <ApplicationProvider {...eva} theme={eva.light}>
     
      <View style = {{flex: 1, }}>
        {renderPage()}

      </View>
    </ApplicationProvider>
    </>
  );
  
}

  