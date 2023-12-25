import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons'; // You may need to install these icons
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const navigation = useNavigation();

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <View style={styles.container}>
      {/* Hide Sidebar Button */}
      <TouchableOpacity onPress={toggleSidebar}>
        <AntDesign name="menufold" size={24} color="white" />
      </TouchableOpacity>

      {/* Create Button */}
      <TouchableOpacity onPress={() => console.log('Create button pressed')}>
        <View style={styles.create}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>+Create</Text>
        </View>
      </TouchableOpacity>

      {/* Search Box */}
      <TextInput
        style={{ flex: 1, height: 40, backgroundColor: 'white', marginHorizontal: 10, paddingHorizontal: 10, borderRadius: 5 }}
        placeholder="Search"
        onChangeText={(text) => console.log('Search: ', text)}
      />

      {/* User Account Profile Button */}
      <TouchableOpacity onPress={() => console.log('User Profile pressed')}>
        <FontAwesome name="user-circle" size={24} color="white" />
      </TouchableOpacity>

      {/* Sidebar */}
      {isSidebarVisible && (
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>

          {/* Sidebar Items */}
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.sidebarItem}>
            <AntDesign name="home" size={20} color="white" />
            <Text style={styles.sidebarText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('MyTask')} style={styles.sidebarItem}>
            <FontAwesome name="tasks" size={20} color="white" />
            <Text style={styles.sidebarText}>My Task</Text>
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Bottom Buttons */}
          <TouchableOpacity onPress={() => console.log('Invite pressed')} style={styles.bottomButton}>
            <FontAwesome name="user-plus" size={16} color="white" style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Invite</Text>
          </TouchableOpacity>

          {/* Vertical Separator */}
          <View style={styles.verticalSeparator} />

          <TouchableOpacity onPress={() => console.log('Help pressed')} style={styles.bottomButton}>
            <FontAwesome name="question-circle" size={16} color="white" style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Help</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#8B4513',
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  create: {
    backgroundColor: '#E1C78F',
    padding: 5,
    borderRadius: 15,
    left: 3,
  },
  sidebar: {
    backgroundColor: '#8B4513',
    position: 'absolute',
    top: 60, // Adjusted to start below the header
    left: 0,
    height: '100%', // Take full height of the screen vertically
    width: '70%', // Take 70% of the screen horizontally
    paddingHorizontal: 10,
  },
  
  closeButton: {
    padding: 10,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sidebarText: {
    color: 'white',
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  bottomButtonIcon: {
    marginRight: 5,
  },
  verticalSeparator: {
    width: 1,
    height: 20,
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  bottomButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Header;
