import '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA3nqOwERkWik2UINhjDQZjzE1E6yIhbjo',
  authDomain: 'strawhat-19.firebaseapp.com',
  projectId: 'strawhat-19',
  storageBucket: 'strawhat-19.appspot.com',
  messagingSenderId: '1083668305902',
  appId: '1:1083668305902:android:3f412859714fa3a83820ff',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};
