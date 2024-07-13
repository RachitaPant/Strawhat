import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect} from 'react';
import profile from '../assets/images/profile.png';
import homeimage from '../assets/images/homeimage.jpg';
import SplashScreen from 'react-native-splash-screen';

const Home = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide(); // Hides the splash screen
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Strawhat</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile');
          }}
          style={styles.imagecontainer}>
          <Image source={profile} style={styles.image}></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.middle}>
        <Text style={styles.textmiddle}>Welcome Friend !</Text>
        <Image source={homeimage} style={styles.homeimage}></Image>
      </View>
      <View>
        <Text style={styles.text}>Trending Anime </Text>
        <View style={styles.anime}>
          <View style={styles.animeBlock}></View>
          <View style={styles.animeBlock}></View>
          <View style={styles.animeBlock}></View>
        </View>
      </View>
    </View>
  );
};

export default Home;
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
  image: {
    height: 30,
    width: 30,
    margin: 20,
  },
  imagecontainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 0,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
  },
  middle: {
    backgroundColor: '#000',
    height: '40%',
    width: '90%',
    margin: 20,
  },
  textmiddle: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  homeimage: {
    height: 250,
    width: '60%',
    alignSelf: 'center',
    margin: 10,
    borderRadius: 120,
  },
  anime: {
    flexDirection: 'row',
  },
  animeBlock: {
    height: 120,
    backgroundColor: 'red',
    width: 100,
    margin: 20,
  },
});
