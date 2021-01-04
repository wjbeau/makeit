import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AuditionsView } from './AuditionsView';
import { AuditionEdit } from './AuditionEdit';

const Stack = createStackNavigator();

export const AuditionsHome = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Auditions" component={AuditionsView} />
      <Stack.Screen name="Edit Audition" component={AuditionEdit} />
    </Stack.Navigator>
  );
};