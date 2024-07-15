import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

const Community = () => {
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState([]);

  // Example function to fetch posts (replace with your actual data fetching logic)
  const fetchPosts = async () => {
    try {
      // Assuming 'dummy.json' is located in the 'assets/dummy' directory
      const data = require('../assets/dummy/dummy.json');
      setPosts(data); // Update state with fetched posts
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    // Fetch posts when component mounts
    fetchPosts();
  }, []);

  const handlePost = () => {
    // Example function to handle posting (replace with your actual posting logic)
    console.log('Posted:', postText);
    // Here you can add logic to send the post data to your backend/database
    // and update the UI accordingly
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postInputContainer}>
        <TextInput
          style={styles.postInput}
          placeholder="Post Here"
          onChangeText={text => setPostText(text)}
          value={postText}
          multiline
        />
        <Text style={styles.postButton} onPress={handlePost}>
          Post
        </Text>
      </View>

      <View style={styles.postsContainer}>
        {posts.map((post, index) => (
          <View key={index} style={styles.post}>
            <View>
              <Image
                source={{uri: post.profilePic}}
                style={styles.profileImage}></Image>
              <Text>{post.username}</Text>
            </View>

            <Text>{post.text}</Text>
            {post.photo && (
              <Image source={{uri: post.photo}} style={styles.postImage} />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  postInputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  postInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  postButton: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  postsContainer: {
    flex: 1,
    padding: 10,
  },
  post: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  postImage: {
    marginTop: 10,
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  profileImage: {
    marginTop: 1,
    width: 20,
    height: 20,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default Community;
