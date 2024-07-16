import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import SplashScreen from 'react-native-splash-screen';
import firestore from '@react-native-firebase/firestore';

const SignUp = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);
  const onRegister = async () => {
    if (!email || !password || !username) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      const user = userCredential.user;
      await user.updateProfile({
        displayName: username,
      });
      await firestore().collection('users').doc(user.uid).set({
        username: username,
        email: email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('User account created!');
      navigation.navigate('LoginScreen');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('That email address is invalid!');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.signup}>Sign Up Screen</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        style={styles.inputBox}
        value={email}
        onChangeText={value => setEmail(value)}
      />
      <TextInput
        placeholder="Password"
        style={styles.inputBox}
        value={password}
        onChangeText={value => setPassword(value)}
      />
      <TouchableOpacity onPress={onRegister} style={styles.register}>
        <Text style={styles.registerTitle}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.ques}>ALready a user ?</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('LoginScreen');
        }}
        style={styles.login}>
        <Text style={styles.registerTitle}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#000000',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 12,
    borderRadius: 5,
    width: '90%',
    marginTop: 20,
    color: '#000000',
    backgroundColor: 'grey',
  },
  register: {
    width: '90%',
    backgroundColor: '#a28be8',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  registerTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    fontFamily: 'AntonSC-Regular',
  },
  signup: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 80,
  },
  ques: {
    paddingTop: 10,
  },
  login: {
    width: '90%',
    backgroundColor: '#a28be8',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
});

export default SignUp;
