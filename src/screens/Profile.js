import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const Profile = () => {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
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
});
