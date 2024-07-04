// src/screens/MainScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import TaskList from '../TaskList';
import VoiceRecognition from '../VoiceRecognition';

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TaskList />
      <VoiceRecognition />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;
