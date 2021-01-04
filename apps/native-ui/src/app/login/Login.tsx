import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import SyncStorage from 'sync-storage';
import { routes } from '../routes';

const doLogin = () => {
    //logged in
    console.log("Do login")
}

export const Login = () => {
  return (
    <View style={styles.root}>
      <Text>Login</Text>
      

      <Button
        title='Log in'
        color='#710ce3'
        onPress={doLogin} />
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
