import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, orderByChild, get } from 'firebase/database';
import { db } from './Firebase';
import InputField from './InputField';
import PasswordField from './PasswordField';

export default function SignupForm() {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const auth = getAuth();
  const database = db;

  const handleSignup = async () => {
    try {
      const existingUserRef = ref(database, 'users');
      const userExists = await checkUserExists(existingUserRef, 'email', email);

      if (userExists) {
        Alert.alert('Error', 'Account already exists. Please log in.', [{ text: 'OK' }]);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const sanitizedEmail = sanitizeEmail(email);
        const userRef = ref(database, `users/${sanitizedEmail}`);
        set(userRef, { username, email });

        Alert.alert(
          'Success',
          'Congratulations! You have been signed up.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('HomeScreen', { username ,email });
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const checkUserExists = async (ref, field, value) => {
    const snapshot = await get(ref);
    if (snapshot.exists()) {
      // Check if the user with the specified email already exists
      const userData = snapshot.val();
      const userExists = Object.values(userData).some(user => user[field] === value);
      return userExists;
    } else {
      return false;
    }
  };

  const sanitizeEmail = (email) => {
    return email.replace(/[.$#[\]]/g, ''); 
  };

  return (
    <View style={styles.container}>
      <InputField label="Username" value={username} onChangeText={setUsername} validation="max15" />
      <InputField label="Email" value={email} onChangeText={setEmail} validation="email" />
      <PasswordField
        value={password}
        onChangeText={setPassword}
        showPassword={showPassword}
        togglePassword={() => setShowPassword(!showPassword)}
        validateStrength={true}
      />
      <TouchableOpacity onPress={handleSignup} style={styles.submit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    justifyContent: 'center',
  },
  submit: {
    backgroundColor: '#8B4513',
    width: '80%',
    padding: 15,
    margin: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#E1C78F',
    fontWeight: 'bold',
  },
});
