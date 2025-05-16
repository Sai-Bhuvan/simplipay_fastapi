import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Signup from './screens/signup';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import SignIn from './screens/signin';


export default function App() {

  const [currentPage, setCurrentPage] = useState("SignUp")

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
    <ApplicationProvider icons={EvaIconsPack} {...eva} theme={eva.dark}>
     
      <View style = {{flex: 1, }}>
        {renderPage()}

      </View>
    </ApplicationProvider>
    
  );
  
}

  