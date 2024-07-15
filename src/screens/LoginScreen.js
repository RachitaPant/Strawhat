import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = () => {
    if (!email || !password) {
      Alert.alert('Please enter both email and password.');
      return;
    }
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        setLoading(false);
        Alert.alert('Login successfully!');
        navigation.navigate('HomeScreen');
        console.log('response :', response);
      })
      .catch(error => {
        setLoading(false);
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Password is not correct!');
        }
        console.log('error :', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.signup}>Login Screen</Text>
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
      <TouchableOpacity
        onPress={onLogin}
        style={styles.register}
        disabled={loading}>
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
    color: '#000000',
    fontWeight: '600',
    fontFamily: 'AntonSC-Regular',
  },
  signup: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 80,
    fontFamily: 'AntonSC-Regular',
  },
});

export default LoginScreen;
