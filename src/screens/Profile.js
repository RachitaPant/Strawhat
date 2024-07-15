import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import user from '../assets/images/userjpeg.jpeg';
import auth from '@react-native-firebase/auth';
const Profile = () => {
  const logOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };
  return (
    <View style={styles.container}>
      <Image source={user} style={styles.profileImage}></Image>
      <Text style={styles.labelText}>Name</Text>
      <View style={styles.textBox}>
        <Text style={styles.boxText}>Rachita</Text>
      </View>
      <Text style={styles.labelText}>email</Text>
      <View style={styles.textBox}>
        <Text style={styles.boxText}>rachita@gmail.com</Text>
      </View>
      <Text style={styles.labelText}>password</Text>
      <View style={styles.textBox}>
        <Text style={styles.boxText}>rachita</Text>
      </View>

      <TouchableOpacity
        style={styles.logOutBtn}
        onPress={() => {
          logOut();
        }}>
        <Text style={styles.btnText}>Log Out</Text>
      </TouchableOpacity>
    </View>
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
});
