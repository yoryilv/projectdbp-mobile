// src/screens/TaskScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getTasks } from '../api';
import LightSensorComponent from '../sensors/LightSensor';

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
      
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <Text>No hay tareas</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={({ item }) => <Text>{item.title}</Text>}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <LightSensorComponent />
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

export default TaskScreen;
