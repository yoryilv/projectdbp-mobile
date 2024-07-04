// src/components/VoiceRecognition.js
import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import OpenAISpeechService from './VoiceCommands';
import { createTask } from './api';
import { useTasks } from './TaskContext';

const VoiceRecognition = () => {
  const { tasks, setTasks } = useTasks();
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    getAudioPermission();
  }, []);

  const getAudioPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') {
      alert('Permission to access microphone is required!');
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();

      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording URI:', uri);

    const audioBlob = await (await fetch(uri)).blob();
    console.log('Audio Blob:', audioBlob);

    try {
      const transcriptionText = await OpenAISpeechService(audioBlob);
      console.log('Transcription Text:', transcriptionText);
      processTranscription(transcriptionText);
    } catch (error) {
      console.error('Error processing transcription:', error);
    }
  };

  const processTranscription = (text) => {
    const commands = text.split(/(Crear|FIN|fecha fin)/i).filter(Boolean);

    let currentTask = {
      title: '',
      description: '',
      dueDate: '',
    };

    commands.forEach((command, index) => {
      if (command.match(/crear/i)) {
        currentTask.title = commands[index + 1].trim();
      } else if (command.match(/fin/i)) {
        currentTask.description = commands[index + 1].trim();
      } else if (command.match(/fecha fin/i)) {
        currentTask.dueDate = commands[index + 1].trim();
      }
    });

    setTasks([...tasks, currentTask]);
    sendTaskToBackend(currentTask);
  };

  const sendTaskToBackend = async (task) => {
    try {
      const response = await createTask(task);
      console.log('Task created:', response);
    } catch (error) {
      console.error('Error sending task to backend:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {transcription ? <Text>{transcription}</Text> : null}
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

export default VoiceRecognition;
