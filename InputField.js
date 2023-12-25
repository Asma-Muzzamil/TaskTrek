import React from 'react';
import { View, TextInput, Text, Image, StyleSheet } from 'react-native';

export default function InputField({ label, value, onChangeText, validation }) {
  let isInvalid = false;
  let errorMessage = '';

  if (validation === 'max15' && value.length > 15) {
    isInvalid = true;
    errorMessage = 'Username should be 15 characters or less.';
  } else if (validation === 'username' && /[^a-zA-Z]/.test(value)) {
    isInvalid = true;
    errorMessage = 'Username should only contain letters.';
  } else if (validation === 'email') {
    if (value.length > 0 && !isValidEmail(value)) {
      isInvalid = true;
      errorMessage = 'Enter a valid email address.';
    }
  }

  function isValidEmail(email) {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  }
  

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <TextInput
        style={isInvalid ? styles.invalidInput : styles.input}
        value={value}
        onChangeText={onChangeText}
      />
      {isInvalid && <Text style={styles.errorText}>{errorMessage}</Text>}
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
    borderRadius : 10
    
  },
  invalidInput: {
    borderColor: 'red',
    borderWidth: 1,
    padding: 10,
  },
  errorText: {
    color: 'red',
  },
});
