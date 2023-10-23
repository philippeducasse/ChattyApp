import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';
import { getAuth, signInAnonymously } from "firebase/auth";

// navigation is pased from stack-navigation in app.js
const Start = ({ navigation }) => {

    const [name, setName] = useState('');
    const [chatBackgroundColor, setChatBackgroundColor] = useState('#8A95A5');

    // initialises the firebase authentication handler
    const auth = getAuth();

    const signInUser = () => {
        signInAnonymously(auth)
        // if signed in:
            .then(result => {
                navigation.navigate('Chat', { userID: result.user.uid, name: name, chatBackgroundColor: chatBackgroundColor});
                Alert.alert('Signed in successfully');
            })
        // otherwise
            .catch((error) => {
                Alert.alert('Sign-in failed, please try again');
            });
    };


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/BackgroundImage.png')} style={styles.image}>
                <Text style={styles.title}>ChattyApp</Text>
                <View style={styles.card}>
                    <Image
                        source={require('../assets/icon.svg')}
                        style={styles.icon}
                    />
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder='Your Name'
                    />
                    <Text style={styles.chooseBackground} >Choose Background Color:</Text>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <TouchableOpacity style={[styles.backgrounds, { backgroundColor: '#fff' }]}
                            onPress={() => setChatBackgroundColor('#fff')}
                        />
                        <TouchableOpacity style={[styles.backgrounds, { backgroundColor: '#474056' }]}
                            onPress={() => setChatBackgroundColor('#474056')}
                        />
                        <TouchableOpacity style={[styles.backgrounds, { backgroundColor: '#8A95A5' }]}
                            onPress={() => setChatBackgroundColor('#8A95A5')}
                        />
                        <TouchableOpacity style={[styles.backgrounds, { backgroundColor: '#B9C6AE' }]}
                            onPress={() => setChatBackgroundColor('#B9C6AE')}
                        />
                    </View>
                    <View style={styles.buttonComponent}>
                        <TouchableOpacity
                            onPress={signInUser}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Start Chatting</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        resizeMode: 'cover', // Stretch or cover the image to fill the container
    },
    title: {
        flex: 1,
        fontSize: 45,
        fontWeight: '600',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#FFFF',
        textAlign: 'center',
        marginTop: 100,
    },
    card: {

        backgroundColor: '#fff',
        padding: 15,
        // this was set to a specific height otherwise the keyboard messes up the layout
        height: 350,
        margin: 25,
    },
    textInput: {
        width: 320,
        borderColor: 'black',
        padding: 15,
        borderWidth: 1,
        marginBottom: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    chooseBackground: {
        fontSize: 16,
        fontWeight: '300',
        color: 'black',
        justifyContent: 'flex-start',
        marginLeft: 10,
    },
    backgrounds: {
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
        display: 'fixed',
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 15,
    },
    button: {
        display: 'fixed',
        width: '88%',
        justifyContent: 'center',
        height: 60,
        backgroundColor: '#757083',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center'
    },
    buttonComponent: {
        alignItems: 'center',

    }

});

export default Start;