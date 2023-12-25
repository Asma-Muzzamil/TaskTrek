import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation , useRoute } from '@react-navigation/native';
import Header from './Header';

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { username  , email} = route.params || {}; // Retrieve the username from the navigation params

  const goToTodoScreen = () => {
    navigation.navigate('TodoScreen'); // Replace 'Todo' with your actual screen name
  };
  const goToProfileScreen = () => {
    navigation.navigate('ProfileScreen', { username ,email });
  };
  const goToCalendar = () => {
    navigation.navigate('CalendarScreen');
  };



  return (

    <ScrollView contentContainerStyle={styles.container}>
    {/* Include the Header component */}
    <Header />
  
    {/* Customized Button */}
    {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => console.log("customize")}>
      <Text style={styles.buttonText}>Customize</Text> */}
      {/* You can add an icon or symbol here */}
    {/* </TouchableOpacity> */}

    {/* Section with Blocks */}
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>Steps to get started</Text>

      {/* First Block */}
      <TouchableOpacity onPress={goToProfileScreen}>
        <View style={[styles.block, {backgroundColor:'peachpuff' }]}>
          <Image source={require('./img1.png')} style={styles.blockImage} />
          <Text style={styles.blockTitle}>Setup</Text>
          <Text style={styles.blockHeading}>Complete your profile</Text>
          <Text style={styles.blockDescription}>Add a profile picture,so that the team can find and recognize you.</Text>
        </View>
      </TouchableOpacity>

      {/* Second Block */}
      <TouchableOpacity onPress={goToProfileScreen}>
        <View style={[styles.block, { backgroundColor: '#36454F' }]}>
          <Image source={require('./invitation.png')} style={styles.blockImage} />
          <Text style={styles.blockTitle}>Collaboration</Text>
          <Text style={styles.blockHeading}>Invite someone to collaborate</Text>
          <Text style={styles.blockDescription}>This platform is designed for collaboration. Invite your friend to use it with you.</Text>
        </View>
      </TouchableOpacity>

      {/* Third Block */}
      <TouchableOpacity onPress={goToTodoScreen}>
        <View style={[styles.block, { backgroundColor: 'rgb(97, 64, 81)' }]}>
          <Image source={require('./sticky-note.png')} style={styles.blockImage} />
          <Text style={styles.blockTitle}>To-Do List</Text>
          <Text style={styles.blockHeading}>Update your project</Text>
          <Text style={styles.blockDescription}>Visit your project to start organizing work and get things done.</Text>
        </View>
      </TouchableOpacity>

      {/* Fourth Block */}
      <TouchableOpacity onPress={goToCalendar}>
        <View style={[styles.block, { backgroundColor: '#AAAAAA' }]}>
          <Image source={require('./schedule.png')} style={styles.blockImage} />
          <Text style={styles.blockTitle}>Calendar</Text>
          <Text style={styles.blockHeading}>Manage your work</Text>
          <Text style={styles.blockDescription}>Mark your events for reminder</Text>
        </View>
      </TouchableOpacity>
      
    </View>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D2B48C', // Background color
    paddingVertical: 20, // Add padding to the top and bottom
    paddingHorizontal: 16, // Add padding to the sides
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: 70,
    marginLeft: 230,
    marginBottom:-20, 
  },
  buttonText: {
    color: 'white',
    marginRight: 5,
  },
  sectionContainer: {
    marginTop: 70,
  },
  sectionHeading: {
    fontSize: 25 ,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  block: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 16, // Increase padding for blocks
    borderRadius: 8,
    marginBottom: 20, // Increase margin between blocks
  },
  blockImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8, // Increase margin between title and heading
  },
  blockHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8, // Increase margin between heading and description
  },
  blockDescription: {
    fontSize: 12,
  },
});


// asma123$