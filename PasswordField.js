import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function PasswordField({ value, onChangeText, showPassword, togglePassword, validateStrength }) {
  let isInvalid = false;
  let strengthMessage = '';

  if (validateStrength && value.length > 0) {
    const isValidPassword = /^(?=.*[A-Za-z0-9])(?=.*[!@#$%^&*])/.test(value);
    const isWeakPassword = value.length < 8 || !isValidPassword;

    if (isWeakPassword) {
      isInvalid = true;
      strengthMessage = 'Your password is weak. It should have letters, numbers, and special characters.';
    }
  }

  return (
    <View style={styles.container}>
      <Text>Password</Text>
      <TextInput
        style={isInvalid ? styles.invalidInput : styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity style={styles.toggleButton} onPress={togglePassword}>
        <Text style = {{margin : 10}}>{showPassword ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
      {isInvalid && <Text style={styles.errorText}>{strengthMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 20, // Adjust the top position for vertical alignment
  },
  invalidInput: {
    borderColor: 'red',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
  },
});
