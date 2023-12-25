import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import SignupForm from './SignupForm';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.Text}>Welcome User to Task Trek  !  </Text>
      <SignupForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6c6af',
  },
  Text:{
    fontWeight :"bold",
    fontSize : 20,
    marginBottom:20,
    color :"#814141"
  },
  Text2:{
    fontWeight :"bold",
    fontSize : 20,
    marginTop : 10,
    marginBottom:20,
    color:"#814141"
  }
});
