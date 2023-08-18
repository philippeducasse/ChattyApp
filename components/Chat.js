import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {

  const { name } = route.params; // route prop was set to all screen components listed under Stack.Navigator
  const { chatBackgroundColor } = route.params;
  const { userID } = route.params;
  const [messages, setMessages] = useState([]);

  let unsubMessages;
  useEffect(() => {

    // sets the navigation's header title to "name" prop
    navigation.setOptions({ title: name });

    if(isConnected === true) {
      if(unsubMessages) unsubMessages();
      unsubMessages = null;
    //sets up a snapshot fx which pushes new changes automatically
    // the "query" & "orderedBy" functions are used to extract and sort the messages
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
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

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
   }

  return (
    <View style={[styles.container
      , { backgroundColor: chatBackgroundColor }
    ]}
    >
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        InputToolbar = {renderInputToolbar}
        onSend={messages => onSend(messages)}
        _id={userID}
        name={name}

      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Lets you choose to send an image or your geolocation."
        accessibilityRole="button"
      // onPress={onPress}
      >
        <View style={styles.button}>

        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Chat;