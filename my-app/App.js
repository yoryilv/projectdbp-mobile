import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TaskProvider } from './src/TaskContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainScreen from './src/screens/MainScreen';
import TaskScreen from './src/screens/TaskScreen'; // Asegúrate de que el nombre sea correcto

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = ({ setIsLoggedIn }) => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login">
      {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Stack.Screen>
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Main" component={MainScreen} />
    <Tab.Screen name="Tasks" component={TaskScreen} /> {/* Asegúrate de no tener comentarios aquí */}
  </Tab.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <TaskProvider>
      <NavigationContainer>
        {isLoggedIn ? <AppTabs /> : <AuthStack setIsLoggedIn={setIsLoggedIn} />}
      </NavigationContainer>
    </TaskProvider>
  );
};

export default App;
