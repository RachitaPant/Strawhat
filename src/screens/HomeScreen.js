import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import SplashScreen from 'react-native-splash-screen';

import BackgroundService from 'react-native-background-actions';
import profile from '../assets/images/profile.png';
import homeimage from '../assets/images/homeimage.jpg';
import LinearGradient from 'react-native-linear-gradient';

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 1000,
  },
};

const HomeScreen = ({navigation}) => {
  const [search, setSearch] = useState();
  const [animeData, setAnimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    async function startBackgroundService() {
      try {
        await BackgroundService.start(getData, options);
        await BackgroundService.updateNotification({
          taskDesc: 'New ExampleTask description',
        });
        // iOS will run everything here in the background until .stop() is called
        await BackgroundService.stop();
      } catch (error) {
        console.error('Failed to start background service:', error);
      }
    }
    startBackgroundService();

    // Hide splash screen after 3 seconds
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
    return () => {
      // Clean up background service if necessary
      BackgroundService.stop();
    };
  }, [search]);
  const getData = async () => {
    if (BackgroundService.isRunning) {
      console.log('Background task started');
      try {
        const response = await fetch(
          'https://api.jikan.moe/v4/anime?q=${search}&limit=20',
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setAnimeData(data.data);
        console.log(data);
        setIsLoading(false);
        return data;
      } catch (error) {
        console.error('Background task error:', error);
        throw error; // Ensure the error is propagated back
      }
    }
  };

  const toggleExpand = index => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#fff" />;
    }
    if (error) {
      return <Text>{error}</Text>;
    }
    if (animeData) {
      return (
        <View style={styles.animeContainer}>
          <Text style={styles.text}>Trending Anime</Text>
          <ScrollView horizontal>
            <View style={styles.anime}>
              {animeData.map((anime, index) => (
                <LinearGradient
                  key={index}
                  colors={['#2e32a3', '#bb94d4', '#d494ca']}
                  style={[
                    styles.animeBlock,
                    expanded[index] ? {height: 350} : {height: 300},
                  ]}>
                  <Image
                    source={{uri: anime.images.jpg.large_image_url}}
                    style={styles.animeImage}
                  />
                  <Text style={styles.animeTitle}>{anime.title}</Text>
                  <Text style={styles.animeDescription}>
                    {expanded[index] || anime.synopsis.length <= 20
                      ? anime.synopsis
                      : `${anime.synopsis.substring(0, 80)}...`}
                  </Text>
                  {anime.synopsis.length > 20 && (
                    <TouchableOpacity onPress={() => toggleExpand(index)}>
                      <Text style={styles.showMore}>
                        {expanded[index] ? 'Show Less' : 'Show More'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
              ))}
            </View>
          </ScrollView>
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
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
        <View style={styles.searchContainer}>
          <TextInput
            cursorColor={'red'}
            inputMode="search"
            placeholder="Search your fav anime"
            onChange={e => setSearch(e.target.value)}></TextInput>
        </View>
        <Image source={homeimage} style={styles.homeimage}></Image>
      </View>
      {renderContent()}
    </ScrollView>
  );
};

export default HomeScreen;
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
  searchContainer: {
    height: 40,
    width: '100%',
    borderColor: '#a28be8',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
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
  animeContainer: {
    flex: 1,
    backgroundColor: 'black',
    marginBottom: 150,
  },
  anime: {
    flexDirection: 'row',
  },
  animeBlock: {
    width: 200,
    margin: 20,
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  animeImage: {
    height: 150,
    width: 190,
    marginTop: 5,
    alignSelf: 'center',
    borderRadius: 5,
  },
  animeImageBlock: {},
  animeDescription: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  animeTitle: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  showMore: {
    color: 'white',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
});
