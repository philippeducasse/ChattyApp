import { StyleSheet, View, Text } from 'react-native';
import { useEffect } from 'react';

const Chat = ({route, navigation}) => {

    const {name} = route.params; // route prop was set to all screen components listed under Stack.Navigator
    const {chatBackgroundColor} = route.params;

// sets the navigation's header title to "name" prop

    useEffect(() => {
        navigation.setOptions({title: name});
    }, [])

 return (
   <View style={[styles.container, {backgroundColor: chatBackgroundColor}]}>
     <Text>Hello Chat!</Text>
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 }
});

export default Chat;