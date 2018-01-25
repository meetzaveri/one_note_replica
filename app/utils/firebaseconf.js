import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyATliCBv-skkUjBT_CLP_xMtPFnkKuzlHw",
    authDomain: "friendlychat-12895.firebaseapp.com",
    databaseURL: "https://friendlychat-12895.firebaseio.com",
    projectId: "friendlychat-12895",
    storageBucket: "friendlychat-12895.appspot.com",
    messagingSenderId: "463457546136"
  };

const firebasconfig = firebase.initializeApp(config);

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

export default firebasconfig;