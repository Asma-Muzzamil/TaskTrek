import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share, Image, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getAuth, deleteUser } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { db } from './Firebase'; // Import your Firebase database instance

export default function ProfileScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { username, email } = route.params || {};
    const [profileImage, setProfileImage] = useState(null);


    const handleInvite = () => {
        try {
            const dynamicLink = 'https://myapp24.page.link'; // Your pre-configured dynamic link

            Share.share({
                message: `Join me on this app for working together! ${dynamicLink} assigned by ${username}`,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share invite link');
        }
    };


    const auth = getAuth();
    const database = db;
    const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // Sanitize the email for use in the database path
    const handleLogout = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                // Remove user data from the database
                const userRef = ref(database, `users/${sanitizedEmail}`);
                await set(userRef, null); // Set the user data to null effectively removing it

                // Delete user from authentication
                await deleteUser(user);

                Alert.alert('Logout', 'Account successfully deleted.');
                navigation.navigate('Splash'); // Navigate to Splash Screen after logout
            } else {
                Alert.alert('Error', 'User not found.');
            }
        } catch (error) {
            console.error('Error logging out:', error.message);
            Alert.alert('Error', 'Failed to logout.');
        }
    };

    const selectImage = async () => {
        try {
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!pickerResult.cancelled) {
                setProfileImage(pickerResult); // Set the entire pickerResult as profileImage
            }
        } catch (error) {
            console.log('Image selection error:', error);
        }
    };

    return (
        <View style={styles.container}>
            {username !== undefined && username !== '' && <Text style={styles.Text}>Hello, {username}!</Text>}
            <Text style={{color:"#993300", fontWeight:"bold", fontSize:20,position:"relative", bottom:50}}>Enhance Your Profile</Text>
            <Text style={{color:"#993300", fontWeight:"bold", fontSize:20,position:"relative", bottom:40}}> Invite Some One To Work Together</Text>
            <View style={styles.imageContainer}>
                {profileImage && profileImage.assets && profileImage.assets.length > 0 ? (
                    <Image source={{ uri: profileImage.assets[0].uri }} style={styles.profileImage} />
                ) : (
                    <View style={styles.placeholderCircle}>
                        <Text>No Image Selected</Text>
                    </View>
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={selectImage}>
                <Text style={{ color: "#DAA06D", fontWeight: "bold" }}>Upload Profile Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInvite} style={styles.button}>
                <Text style={{ color: "#DAA06D", fontWeight: "bold" }}>Invite Anyone for To-Do</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Text style={{ color: "#DAA06D", fontWeight: "bold" }}>Logout</Text>
            </TouchableOpacity>



            {console.log(profileImage)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e6c6af"
    },
    button: {
        backgroundColor: '#993300',
        width: "80%",
        padding: 15,
        margin: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Text: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom:20,
        fontStyle:"italic",
        position:"relative",
        bottom:70,
        color:"#993300"
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderRadius: 100, // half the width or height to make it a circle
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position:"relative",
        bottom:20
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    placeholderCircle: {
        width: '100%',
        height: '100%',
        borderRadius: 100, // half the width or height to make it a circle
        backgroundColor: '#F5DEB3',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
