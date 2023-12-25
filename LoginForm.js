import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, orderByChild, equalTo, get } from 'firebase/database';
import EmailInput from './LoginEmailField';
import PasswordInput from './LoginPasswordField';
import { db } from './Firebase';

const LoginForm = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const auth = getAuth();
  const database = db;

  const validateEmail = (email) => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password correctly.', [{ text: 'OK' }]);
      return;
    }

    const userExists = await checkUserExists();
    if (!userExists) {
      Alert.alert('Error', 'Account does not exist. Please sign up.', [{ text: 'OK' }]);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      try {
        const user = auth.currentUser;
        if (user) {
          const email = user.email;
          if (email) {
            const sanitizedEmail = sanitizedEmail(email);
            const userRef = ref(database, `users/${sanitizedEmail}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
              const userData = snapshot.val();
              if (userData.todos) {
                setTodos(userData.todos); // Set the retrieved todos to the state
              }
            }
          }
        }
      } catch (error) {
        console.log('No todos found in the database for this user.');
      }
      const username = await getUsernameFromEmail(email);
      Alert.alert('Success', 'You are logged in!', [{ text: 'OK' }]);
      navigation.navigate('HomeScreen', { username  , email});
    } catch (error) {
      console.error('Error logging in:', error.message);
      Alert.alert('Error', 'Please write correct information.', [{ text: 'OK' }]);
    }
  };



  const checkUserExists = async () => {
    const sanitizedEmail = encodeURIComponent(email.toLowerCase());

    try {
      const userRef = ref(database, 'users');
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const userExists = Object.keys(users).some((key) => {
          const storedEmail = users[key].email;
          const sanitizedStoredEmail = encodeURIComponent(storedEmail.toLowerCase());
          return sanitizedStoredEmail === sanitizedEmail;
        });

        if (userExists) {
          console.log('User exists:', sanitizedEmail);
          return true;
        } else {
          console.log('User does not exist:', sanitizedEmail);
          return false;
        }
      } else {
        console.log('No users found in the database.');
        return false;
      }
    } catch (error) {
      console.error('Error checking user existence:', error.message);
      return false;
    }
  };

  const getUsernameFromEmail = async (email) => {
    const sanitizedEmail = encodeURIComponent(email.toLowerCase());

    try {
      const userRef = ref(database, 'users');
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const userKey = Object.keys(users).find((key) => {
          const storedEmail = users[key].email;
          const sanitizedStoredEmail = encodeURIComponent(storedEmail.toLowerCase());
          return sanitizedStoredEmail === sanitizedEmail;
        });

        if (userKey) {
          return users[userKey].username; // Return the username associated with the email
        }
      }
    } catch (error) {
      console.error('Error fetching username:', error.message);
    }

    return ''; // Return empty string if username not found or error occurs
  };

  return (
    <View style={styles.container}>
      <EmailInput value={email} onChangeText={setEmail} validateEmail={validateEmail} />
      <PasswordInput
        value={password}
        onChangeText={setPassword}
        showPassword={showPassword}
        togglePassword={() => setShowPassword(!showPassword)}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
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

export default LoginForm;
