import React from 'react';
import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './utils/firebaseConfig';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import IntermediateScreen from './screens/Intermediate';
import NewDiaryEntryScreen from './screens/NewDiaryEntryScreen';
import PersonalDiaryScreen from './screens/PersonalDiaryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login"  options={{ title: 'Login' }} component={LoginScreen} />
        <Stack.Screen name="Register" options={{ title: 'Register' }} component={RegisterScreen} />
        <Stack.Screen name="Intermediate" options={{ title: ' ' }} component={IntermediateScreen} />
        <Stack.Screen name="NewDiaryEntry" options={{ title: 'New diary' }} component={NewDiaryEntryScreen} />
        <Stack.Screen name="PersonalDiary" options={{ title: 'My Diary' }} component={PersonalDiaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 