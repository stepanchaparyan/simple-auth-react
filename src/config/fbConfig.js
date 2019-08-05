import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

  const firebaseConfig = {
    apiKey: 'AIzaSyD6WVEkXqyMq0mW3lTPKXITEZ2GgLp6JaA',
    authDomain: 'simple-auth-react.firebaseapp.com',
    databaseURL: 'https://simple-auth-react.firebaseio.com',
    projectId: 'simple-auth-react',
    storageBucket: 'simple-auth-react.appspot.com',
    messagingSenderId: '420366028932',
    appId: '1:420366028932:web:5098a1d715034a63'
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();

  export { storage, firebase as default };