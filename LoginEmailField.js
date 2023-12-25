import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const LoginEmailField= ({ value, onChangeText, validateEmail }) => {
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleEmailChange = (email) => {
    onChangeText(email);
    setIsValidEmail(validateEmail(email));
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput
        value={value}
        onChangeText={handleEmailChange}
        placeholder="Enter Email"
        style={[styles.input, !isValidEmail && styles.invalidInput]}
      />
      {!isValidEmail && <Text style={styles.warningText}>Write a correct email</Text>}
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
  invalidInput: {
    borderColor: 'red',
  },
  warningText: {
    color: 'red',
  },
});

export default LoginEmailField;
