import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {

  const { name } = route.params; // route prop was set to all screen components listed under Stack.Navigator
  const { chatBackgroundColor } = route.params;
  const { userID } = route.params;
  const [messages, setMessages] = useState([]);






  useEffect(() => {

    // sets the navigation's header title to "name" prop
    navigation.setOptions({ title: name });
    //sets up a snapshot fx which pushes new changes automatically
    // the "query" & "orderedBy" functions are used to extract and sort the messages
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
      let newMessages = [];
      documentsSnapshot.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      });
      setMessages(newMessages) 

        // these values are required for GifteChat to work
        
    });

    // Clean-up code (to avoid memory leaks), called when ShoppingLists is unmounted
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, []);

  // function to add a new messages to the firebase DB

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
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


  return (
    <View style={[styles.container
      , { backgroundColor: chatBackgroundColor }
    ]}
    >
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
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