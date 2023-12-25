import React from 'react';
import { View, TouchableOpacity, StyleSheet ,Text, Image} from 'react-native';
import Splash from './SPLASHIMAGE.jpg'


export default function SplashScreen({ navigation }) {
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };
  
  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };
  return (
    <View style={styles.container}>
        <Image source={Splash} style={styles.logoImage} />
      <Text style={styles.boldText}>TaskTrek</Text>
      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignupPress}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6c6af',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoImage: {
    width: "100%",
    height:"65%",
    position:"relative",
    top : 0
  },
  boldText:{
    fontWeight: '900',
    margin : 20 ,
    fontSize : 30,
    color : "#5A463C"
  },
  button: {
    backgroundColor: '#8B4513', 
    width:"80%",
    padding: 15,
    margin: 10,
    borderRadius :20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#E1C78F', 
    fontWeight: 'bold',
  },
});
