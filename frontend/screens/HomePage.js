import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fontisto from '@expo/vector-icons/Fontisto';
import Home from './Home';
import Transactions from './Transaction';
import InitiateTransaction from './initiate-transaction';

const { Navigator, Screen } = createBottomTabNavigator();

const icons = [
  (props) => <Icon {...props} name='home-outline' />,
  (props) => <Fontisto {...props} name="history" size={24} color="grey" />,
  (props) => <Icon {...props} name='credit-card-outline' />
];

const BottomTabBar = ({ navigation, state, isMerchant }) => {
  const titles = isMerchant
    ? ['Home', 'Transactions', 'Payment']
    : ['Home', 'Transactions'];

  const availableIcons = isMerchant ? icons : icons.slice(0, 2);

  return (
    <BottomNavigation
      selectedIndex={state.index}
      appearance="noIndicator"
      onSelect={index => navigation.navigate(state.routeNames[index])}
      style={{
        marginBottom: 20,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#f8f8f8',
      }}
    >
      {titles.map((title, index) => (
        <BottomNavigationTab key={index} title={title} icon={availableIcons[index]} />
      ))}
    </BottomNavigation>
  );
};

const MerchantNavigator = () => (
  <Navigator
    screenOptions={{ headerShown: false }}
    tabBar={props => (
      <BottomTabBar {...props} isMerchant={true} />
    )}
  >
    <Screen name="Home" component={Home} />
    <Screen name="Transaction" component={Transactions} />
    <Screen name="Payment" component={InitiateTransaction} />
  </Navigator>
);

const UserNavigator = () => (
  <Navigator
    screenOptions={{ headerShown: false }}
    tabBar={props => (
      <BottomTabBar {...props} isMerchant={false} />
    )}
  >
    <Screen name="Home" component={Home} />
    <Screen name="Transaction" component={Transactions} />
  </Navigator>
);

export default function HomePage() {
  const [isMerchant, setIsMerchant] = useState(false);

  useEffect(() => {
    async function fetchUserRole() {
      const value = await AsyncStorage.getItem('isMerchant');
      setIsMerchant(value === 'true');
    }
    fetchUserRole();
  }, []);

  return (
    <NavigationContainer>
      {isMerchant ? <MerchantNavigator /> : <UserNavigator />}
    </NavigationContainer>
  );
}
