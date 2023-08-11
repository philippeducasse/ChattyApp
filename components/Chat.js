import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {

  const { name } = route.params; // route prop was set to all screen components listed under Stack.Navigator
  const { chatBackgroundColor } = route.params;
  const [messages, setMessages] = useState([]);

  // sets the navigation's header title to "name" prop

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  useEffect(() => {
    setMessages([

      // these values are required for GifteChat to work

      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  //setMessage is called with a callback fx where first parameters is previous mxs
  // appends newmxs (always just one mx) to prevmxs 
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
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
        user={{ _id: 1 }}

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