import React from 'react';
import { View, StyleSheet ,Text } from 'react-native';
import LoginForm from './LoginForm';

const Login = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.Text}>Welcome Back !  </Text>
      <Text style={styles.Text2}>User Nice To See You Here Again  </Text>
      <LoginForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6c6af',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Text:{
    fontWeight :"bold",
    fontSize : 20,
    color:"#814141"
  },
  Text2:{
    fontWeight :"bold",
    fontSize : 20,
    marginTop : 10,
    marginBottom:20,
    color:"#814141"
  }
});

export default Login;
