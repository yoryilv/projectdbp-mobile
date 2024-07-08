import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LightSensor } from 'expo-sensors';

const LightSensorComponent = () => {
    const [illumination, setIllumination] = useState(0);
  
    useEffect(() => {
      LightSensor.setUpdateInterval(1000);
  
      const subscription = LightSensor.addListener(sensorData => {
        setIllumination(sensorData.illuminance);
      });
  
      return () => {
        subscription && subscription.remove();
      };
    }, []);
  return (
    <View style={styles.exampleText}>
      <Text style={styles.text}>Iluminación: {illumination} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  exampleText: {
    transform: [{ translateY: 270 }],
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
});

export default LightSensorComponent;
