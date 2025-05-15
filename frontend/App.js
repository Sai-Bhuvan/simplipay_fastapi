import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text} from '@ui-kitten/components';
import Signup from './screens/signup';
import SignIn from './screens/signin';
import HomePage from './screens/HomePage';
import FaceCaptureScreen from './screens/Camera';


export default () => (
  <ApplicationProvider {...eva} theme={eva.dark}>
    <View>
      
    </View>
  </ApplicationProvider>
);