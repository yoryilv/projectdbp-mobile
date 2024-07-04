import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://52.90.215.71:8080';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    await SecureStore.setItemAsync('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration failed', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync('token');
  } catch (error) {
    console.error('Logout failed', error);
    throw error;
  }
};

const getAuthHeaders = async () => {
  const token = await SecureStore.getItemAsync('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getTasks = async () => {
  try {
    const config = await getAuthHeaders();
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (task) => {
  try {
    const config = await getAuthHeaders();
    const response = await axios.post(API_URL, task, config);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};