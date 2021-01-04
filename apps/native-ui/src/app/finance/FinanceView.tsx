import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const FinanceView
 = () => {
    return (
      <View style={styles.root}>
        <Text>Finance View</Text>
      </View>
    );
  }
  
const styles = StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'whitesmoke'
    }
  });