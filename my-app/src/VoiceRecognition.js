import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
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
    const { status } = await Audio.requestPermissionsAsync();
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
      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
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
    if (!text) {
      console.error('No transcription text received.');
      return;
    }

    const commands = text.split(/(Crear|Descripcion|fecha fin)/i).filter(Boolean);

    if (commands.length < 2) {
      console.error('Invalid command structure.');
      return;
    }

    let currentTask = {
      title: '',
      description: '',
      dueDate: '',
    };

    commands.forEach((command, index) => {
      if (command.match(/crear/i)) {currentTask.title = commands[index + 1] ? commands[index + 1].trim() : '';} 
      else if (command.match(/descripcion/i)) {currentTask.description = commands[index + 1] ? commands[index + 1].trim() : '';} 
      else if (command.match(/fecha fin/i)) {currentTask.dueDate = commands[index + 1] ? commands[index + 1].trim() : '';}
    });

    if (currentTask.title) {
      setTasks([...tasks, currentTask]);
      sendTaskToBackend(currentTask);
    } 
    else {console.error('Task title is required.');}
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
      <Text style={styles.guideText}>
        Ejemplo de comando de voz:
      </Text>
      <Text style={styles.exampleText}>
      Crear = Informe semanal
      </Text>
      <Text style={styles.exampleText}>
      Descripcion = Escribir el informe semanal sobre mis actividades
      </Text> 
      <Text style={styles.exampleText}>
      Fecha fin 15 de julio de 2024
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideText: {
    transform: [{ translateY: 205 }],
    fontSize: 16,
    fontWeight: 'bold',
  },
  exampleText: {
    transform: [{ translateY: 210 }],
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default VoiceRecognition;
