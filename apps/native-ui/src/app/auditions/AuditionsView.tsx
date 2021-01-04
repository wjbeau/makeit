import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { UpcomingAuditions } from './UpcomingAuditions';
import { RecentAuditions } from './RecentAuditions';

const Tab = createMaterialTopTabNavigator();

export const AuditionsView = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Upcoming" component={UpcomingAuditions} />
      <Tab.Screen name="Recent" component={RecentAuditions} />
    </Tab.Navigator>
  );
};
