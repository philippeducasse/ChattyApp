import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Start from './components/Start.js';
import Chat from './components/Chat.js';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const App = () => {

  // these are the firbase DB credentials

  const firebaseConfig = {

    apiKey: "AIzaSyA605ujMJYSzmcgIcV1x__tjnSfiwVx_EA",
    authDomain: "chattyapp-8a59c.firebaseapp.com",
    projectId: "chattyapp-8a59c",
    storageBucket: "chattyapp-8a59c.appspot.com",
    messagingSenderId: "436868320889",
    appId: "1:436868320889:web:54d63fbcf57cd2615a4ea8"
  };
  
   // Initialize Firebase
   const app = initializeApp(firebaseConfig);

   // Initialize Cloud Firestore and get a reference to the service
   const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start} />
        {/* this is the syntax for passing a prop (db) through StackScreen */}
        <Stack.Screen name='Chat'>
          {props => <Chat db={db} {...props} />} 
          </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;