// screens/AnimeDetailScreen.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';

const AnimeDetailScreen = ({route}) => {
  const {anime} = route.params; // Get the anime details from the navigation params

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/profileBg.png')} // Replace with your background image path
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.box}>
          <Image
            source={{uri: anime.images.jpg.large_image_url}}
            style={styles.animeImage}
          />
          <Text style={styles.title}>{anime.title}</Text>
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{anime.status}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{anime.status}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{anime.status}</Text>
            </View>
          </View>

          <Text style={styles.synopsis}>{anime.synopsis}</Text>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#bb94d4',
  },
  backgroundImage: {
    flex: 1,

    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
    alignSelf: 'center',
    fontFamily: 'AntonSC-regular',
  },
  synopsis: {
    fontSize: 16,
    color: '#000000',
    alignSelf: 'center',
    padding: 30,
  },
  animeImage: {
    height: 150,
    width: 190,
    marginTop: 5,
    alignSelf: 'center',
    borderRadius: 10,
  },
  box: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 40,
    alignSelf: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    margin: 5,
    alignItems: 'center',
  },
  tag: {
    borderColor: '#d494ca',
    borderWidth: 2,
    margin: 6,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 15,
    alignSelf: 'center',
    color: '#bb94d4',
    padding: 10,
  },
});

export default AnimeDetailScreen;
