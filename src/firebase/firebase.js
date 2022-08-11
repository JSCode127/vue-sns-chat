// Import the functions you need from the SDKs you need
import firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChJXLOnneeagN8I8hZprxmRuNTmC2x_Iw",
  authDomain: "sns-chat-adc41.firebaseapp.com",
  projectId: "sns-chat-adc41",
  storageBucket: "sns-chat-adc41.appspot.com",
  messagingSenderId: "502752548374",
  appId: "1:502752548374:web:f6b31fc88cddd26b670737"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;