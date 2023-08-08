## ChattyApp Chat App

This project aims at creating an App for mobile devices using React Native. The app will
provide users with a chat interface and options to share images and their
location.

## Technologies Used

- React Native
- Expo
- Google Firestore DB
- Google Firebase Authentication

## Key Features

- A page where users can enter their name and choose a background color for the chat screen
before joining the chat.
- A page displaying the conversation, as well as an input field and submit button.
- The chat must provide users with two additional communication features: sending images
and location data.
- Data gets stored online and offline.

## How to set up the application

As this application requires react native and is devvelopped with Expo, the first step involves downgrading (if necessary) to a node version compatible with Expo:

nvm install 16.19.0
nvm use 16.19.0
nvm alias default 16.19.0

Next, install expo CLI on your machine: 

npm install -g expo-cli

Then create an expo account (https://expo.dev/), and either install expo on your smartphone, or install a virtual machine on your computer.

Create a react native line by running this command:

npx create-expo-app ChattyApp --template

Run expo:

npm start, or expo start

sync Metro Bundler either with your smartphone or using your device emulator to see the app live.
