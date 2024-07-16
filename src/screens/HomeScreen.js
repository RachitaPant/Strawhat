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
  ImageBackground,
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

    getData();

    return () => {
      // Clean up background service if necessary
      BackgroundService.stop();
    };
  }, [search]);

  const getData = async () => {
    setIsLoading(true);
    try {
      const url = search
        ? `https://api.jikan.moe/v4/anime?q=${search}&limit=20`
        : 'https://api.jikan.moe/v4/top/anime';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const data = await response.json();
      setAnimeData(data.data);
    } catch (error) {
      console.error('Error fetching anime data:', error);
      setError('Failed to fetch anime data');
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.text}>Top Anime</Text>
          <ScrollView horizontal>
            <View style={styles.anime}>
              {animeData.map((anime, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.item}
                  onPress={() => navigation.navigate('AnimeScreen', {anime})}>
                  <LinearGradient
                    key={index}
                    colors={['#2e32a3', '#bb94d4', '#d494ca']}
                    style={[styles.animeBlock]}>
                    <Image
                      source={{uri: anime.images.jpg.large_image_url}}
                      style={styles.animeImage}
                    />
                    <Text style={styles.animeTitle}>{anime.title}</Text>
                  </LinearGradient>
                </TouchableOpacity>
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
      <ImageBackground
        source={require('../assets/images/profileBg.png')} // Replace with your background image path
        style={styles.backgroundImage}
        resizeMode="cover">
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
              cursorColor={'purple'}
              inputMode="search"
              placeholder="Search your fav anime"
              value={search}
              onChangeText={text => setSearch(text)}></TextInput>
            <TouchableOpacity onPress={getData} style={styles.searchBtn}>
              <Text style={styles.searchBtnText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderContent()}
        <View>
          <Image source={homeimage} style={styles.homeimage}></Image>
        </View>
      </ImageBackground>
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
    flexDirection: 'row',
    borderRadius: 10,
  },
  searchBtn: {
    backgroundColor: '#ffffff',
    width: 80,
    marginLeft: 195,
    borderRadius: 10,
  },
  searchBtnText: {
    color: '#000000',
    alignSelf: 'center',
    margin: 10,
  },
  middle: {
    height: '5%',
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
    margin: 5,
    borderRadius: 100,
  },
  animeContainer: {
    flex: 1,

    marginBottom: 10,
  },
  anime: {
    flexDirection: 'row',
  },
  animeBlock: {
    height: 200,
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
