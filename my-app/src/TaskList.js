// src/TaskList.js
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTasks } from './TaskContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const { tasks } = useTasks();

  return (
    <View>
      {tasks.length === 0 ? (
        <Text>No hay tareas</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={({ item }) => <TaskItem task={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default TaskList;
