import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from 'react-native-maps';

import CustomActions from './CustomActions';

const Chat = ({ route, navigation, db, isConnected, storage }) => {

  const { name, chatBackgroundColor, userID } = route.params; // route prop was set to all screen components listed under Stack.Navigator
  const [messages, setMessages] = useState([]);


  let unsubMessages;
  useEffect(() => {

    // sets the navigation's header title to "name" prop
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
      //sets up a snapshot fx which pushes new changes automatically
      // the "query" & "orderedBy" functions are used to extract and sort the messages
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      // here, onsnapshot is a fx, which can then be called by calling unsubMessages();
      // with this specific logic
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach(doc => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          })
        });
        // stores new messages to cache if online
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean-up code (to avoid memory leaks), called when ShoppingLists is unmounted
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  // function to add a new messages to the firebase DB

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  };

  // adds new messages to the cache

  const cacheMessages = async (messageToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messageToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  // loads messages from cache

  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem('messages') || [];// sets cached list to empty array if something fails
    // cache stores lists as strings, so have to parse them first
    setMessages(JSON.parse(cachedMessages));

  }

  // modifies styling of the chat bubbles
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#001'
        },
        left: {
          backgroundColor: '#fff'
        }
      }}
    />
  }

  // what does this do?
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }

  // adds the + button 
  const renderCustomActions = (props) => {
    return <CustomActions
      storage={storage}
      userID = {userID}
      {...props}
    />;
  };

  // checks if message contains location data, and if it does, returns a MapView
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null
  }


  return (
    <View style={[styles.container
      , { backgroundColor: chatBackgroundColor }
    ]}
    >
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        InputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
          name
        }}

      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Chat;