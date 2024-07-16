import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ImageBackground,
} from 'react-native';
import camera from '../assets/images/camera.png';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';

const Community = () => {
  //constants
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  //Gallery action
  const openGallery = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    try {
      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image picker error: ', response.errorCode);
      } else {
        let imageUri = response.assets?.[0]?.uri;
        setImageUri(imageUri);
        console.log('Image URI: ', imageUri);
      }
    } catch (error) {
      console.log('Error launching image library: ', error);
    }
  };
  //Showing existing posts
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const postsSnapshot = await firestore()
  //         .collection('posts')
  //         .orderBy('createdAt', 'desc')
  //         .get();

  //       const postsData = [];
  //       for (const doc of postsSnapshot.docs) {
  //         const postData = doc.data();
  //         const userSnapshot = await firestore()
  //           .collection('users')
  //           .doc(postData.userId)
  //           .get();
  //         const userData = userSnapshot.data();
  //         postsData.push({
  //           id: doc.id,
  //           ...postData,
  //           username: userData.username,
  //         });
  //       }

  //       setPosts(postsData);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching posts:', error);
  //       setLoading(false);
  //     }
  //   };

  //   const unsubscribe = firestore()
  //     .collection('posts')
  //     .orderBy('createdAt', 'desc')
  //     .onSnapshot(snapshot => {
  //       // Handle real-time updates for new, modified, and removed posts
  //       snapshot.docChanges().forEach(change => {
  //         const post = {
  //           id: change.doc.id,
  //           ...change.doc.data(),
  //         };

  //         switch (change.type) {
  //           case 'added':
  //             setPosts(prevPosts => [post, ...prevPosts]); // Add new post
  //             break;
  //           case 'modified':
  //             // Handle modified post if needed
  //             break;
  //           case 'removed':
  //             setPosts(prevPosts => prevPosts.filter(p => p.id !== post.id)); // Remove post from state
  //             break;
  //           default:
  //             break;
  //         }
  //       });
  //     });

  //   fetchPosts();
  //   return () => unsubscribe();
  // }, []);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const postsData = [];
        snapshot.forEach(doc => {
          const postData = doc.data();
          postsData.push({
            id: doc.id,
            ...postData,
          });
        });

        const fetchUsernames = async () => {
          for (const post of postsData) {
            const userSnapshot = await firestore()
              .collection('users')
              .doc(post.userId)
              .get();
            const userData = userSnapshot.data();
            post.username = userData.username || 'Anonymous';
          }
          setPosts(postsData);
          setLoading(false);
        };

        fetchUsernames();
      });

    return () => unsubscribe();
  }, []);
  //Getting new posts
  const uploadImage = async () => {
    if (imageUri == null) {
      return null;
    }
    const uploadUri = imageUri;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to file name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const task = storage().ref(filename).putFile(uploadUri);
    task.on('state_changed', snapshot => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
      );
      setTransferred(progress);
      setUploadProgress(progress);
    });

    try {
      await task;

      const url = await storage().ref(filename).getDownloadURL();

      setUploading(false);
      setImageUri(null);

      return url;
    } catch (e) {
      console.error(e);
      setUploading(false);
      return null;
    }
  };

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    if (!text && !imageUrl) {
      return; // Prevent submitting empty posts
    }
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.error('No user authenticated.');
      return;
    }

    const newPost = {
      text,
      imageUrl,
      createdAt: firestore.FieldValue.serverTimestamp(),
      userId: currentUser.uid,
      // Assuming displayName is available after authentication
      username: currentUser.displayName || 'Anonymous', // Use 'Anonymous' if displayName is not set
    };

    try {
      await firestore().collection('posts').add(newPost);
      setText('');
      setImageUri(null);
      console.log('Post added successfully!');
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };
  const renderHeader = () => (
    <View style={styles.postContainer}>
      {imageUri && <Image source={{uri: imageUri}} style={styles.image} />}
      {uploading && (
        <Text
          style={
            styles.uploadProgress
          }>{`Upload Progress: ${uploadProgress}%`}</Text>
      )}
      <View style={styles.postInputContainer}>
        <TextInput
          style={styles.postInput}
          placeholder="Post Here"
          onChangeText={text => setText(text)}
          value={text}
          multiline
        />
        <TouchableOpacity onPress={openGallery}>
          <Image source={camera} style={styles.cameraStyles} />
        </TouchableOpacity>
        <TouchableOpacity onPress={submitPost}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <ImageBackground
      source={require('../assets/images/profileBg.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.postShow}>
            <Text style={styles.userName}>
              CrewMate : {item.username} posted
            </Text>
            <Text style={styles.postText}>{item.text}</Text>
            {item.imageUrl ? (
              <Image source={{uri: item.imageUrl}} style={styles.postImage} />
            ) : null}
          </View>
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{paddingBottom: 80}}
        style={{flex: 1}}
      />
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  uploadProgress: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  postInputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  postInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  postContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    margin: 10,
    backgroundColor: '#000000',
  },
  postButton: {
    color: 'white',
    fontSize: 16,
    marginRight: 7,
    marginTop: 10,
  },
  postShow: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  post: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  postImage: {
    marginTop: 10,

    height: 200,
    padding: 50,

    borderRadius: 8,
  },
  profileImage: {
    marginTop: 1,
    width: 20,
    height: 20,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  cameraStyles: {
    marginRight: 10,
    marginTop: 8,
    height: 25,
    width: 25,
  },
  userName: {
    fontWeight: '800',
    fontFamily: 'AntonSC-regular',
    marginLeft: 10,
    color: '#000000',
  },
  user: {
    flexDirection: 'row',
    width: '80%',
  },
  image: {
    height: 70,
    width: '100%',
    borderRadius: 21,
  },
  postText: {
    padding: 10,
    color: '#000000',
  },
});

export default Community;
