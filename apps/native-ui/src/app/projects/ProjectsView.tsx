import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ProjectsView = () => {
  return (
    <View style={styles.root}>
      <Text>Projects View</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'whitesmoke',
  },
});
