// src/components/TaskItem.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TaskItem = ({ task, onDelete, onComplete }) => {
  return (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Button title="Completar" onPress={() => onComplete(task.id)} />
      <Button title="Eliminar" onPress={() => onDelete(task.id)} />
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskTitle: {
    fontSize: 18,
  },
});

export default TaskItem;
