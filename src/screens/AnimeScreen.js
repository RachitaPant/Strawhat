// screens/AnimeDetailScreen.js

import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const AnimeDetailScreen = ({route}) => {
  const {anime} = route.params; // Get the anime details from the navigation params

  return (
    <View style={styles.container}>
      <Image
        source={{uri: anime.images.jpg.large_image_url}}
        style={styles.animeImage}
      />
      <Text style={styles.title}>{anime.title}</Text>
      <Text style={styles.synopsis}>{anime.synopsis}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
  },
  animeImage: {
    height: 150,
    width: 190,
    marginTop: 5,
    alignSelf: 'center',
    borderRadius: 5,
  },
});

export default AnimeDetailScreen;
