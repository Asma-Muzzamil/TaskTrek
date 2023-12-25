import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginPasswordField = ({ value, onChangeText, showPassword, togglePassword }) => {
  return (
    <View style={styles.container}>
      <Text>Password</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter Password"
        secureTextEntry={!showPassword}
        style={styles.input}
      />
      <TouchableOpacity onPress={togglePassword} style={styles.toggleButton}>
        <Text>{showPassword ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width : "80%"
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius : 10
  },
  toggleButton: {
    position: 'absolute',
    top: '65%',
    right: 10,
    transform: [{ translateY: -10 }],
  },
});

export default LoginPasswordField;
