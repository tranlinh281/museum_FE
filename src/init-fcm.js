import  firebase from "firebase/app";
import "firebase/messaging";
const initializedFirebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDEUWyAaLgDcpJdbbRFBwKy_EPF0mor8kk",
    authDomain: "mess-server.firebaseapp.com",
    databaseURL: "https://mess-server.firebaseio.com",
    projectId: "mess-server",
    storageBucket: "mess-server.appspot.com",
    messagingSenderId: "196557922537",
    appId: "1:196557922537:web:1c64183cb0b0dfc0401078",
    measurementId: "G-1C51CGV46B"
});
const messaging = initializedFirebaseApp.messaging();

export { messaging };