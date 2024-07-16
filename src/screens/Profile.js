import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import defaultUserImage from '../assets/images/userjpeg.jpeg';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        try {
          const userDoc = await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            console.error('User document not found.');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error('No authenticated user found.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  const logOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };
  const openGallery = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    try {
      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image picker error: ', response.errorCode);
      } else {
        const imageUri = response.assets?.[0]?.uri;
        setProfileImage(imageUri);
        uploadProfileImage(imageUri);
      }
    } catch (error) {
      console.log('Error launching image library: ', error);
    }
  };
  const uploadProfileImage = async imageUri => {
    try {
      const uploadUri = imageUri;
      const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const storageRef = storage().ref(`profileImages/${filename}`);
      await storageRef.putFile(uploadUri);
      const url = await storageRef.getDownloadURL();
      console.log('Image uploaded to:', url);

      // Update user document with profile image URL
      const currentUser = auth().currentUser;
      if (currentUser) {
        await firestore().collection('users').doc(currentUser.uid).update({
          profileImage: url,
        });
        console.log('Profile image URL updated in user document');
      } else {
        console.error('No authenticated user found.');
      }
    } catch (error) {
      console.error('Error uploading profile image: ', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/profileBg.png')} // Replace with your background image path
      style={styles.container}
      resizeMode="cover">
      <View>
        <TouchableOpacity onPress={openGallery}>
          <Image
            source={profileImage ? {uri: profileImage} : defaultUserImage}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.labelText}>Name</Text>
        <View style={styles.textBox}>
          <Text style={styles.boxText}>{userData?.username}</Text>
        </View>
        <Text style={styles.labelText}>email</Text>
        <View style={styles.textBox}>
          <Text style={styles.boxText}>{userData?.email}</Text>
        </View>

        <TouchableOpacity
          style={styles.logOutBtn}
          onPress={() => {
            logOut();
          }}>
          <Text style={styles.btnText}>Log Out</Text>
        </TouchableOpacity>
        <Text style={styles.leaving}>Leaving ? Will see you soon !</Text>
      </View>
    </ImageBackground>
  );
};

export default Profile;
const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 18,
    margin: 20,
    fontWeight: '600',
    fontFamily: 'AntonSC-Regular',
  },
  container: {
    backgroundColor: '#000',
    height: '100%',
    width: '100',
    flex: 1,
  },
  profileImage: {
    height: 180,
    width: 180,
    borderRadius: 80,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  textBox: {
    height: 40,
    width: '80%',
    borderColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    alignContent: 'flex-start',
    justifyContent: 'center',
    marginBottom: 20,

    alignSelf: 'center',
  },
  logOutBtn: {
    height: 50,
    width: 150,
    backgroundColor: '#a28be8',
    alignSelf: 'center',
    borderRadius: 10,
  },
  btnText: {
    alignSelf: 'center',
    padding: 15,
  },
  boxText: {
    fontSize: 20,
    marginLeft: 10,
  },
  labelText: {marginLeft: 45, marginBottom: 8, color: '#fff'},
  leaving: {
    alignSelf: 'center',
    padding: 10,
  },
});
