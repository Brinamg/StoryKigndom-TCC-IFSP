import firebase from 'firebase'
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD_YxDnrobJqdOrc8e0_ct41UmEYXdTmqg",
  authDomain: "storykingdom-e1d0d.firebaseapp.com",
  projectId: "storykingdom-e1d0d",
  storageBucket: "storykingdom-e1d0d.appspot.com",
  messagingSenderId: "343854389870",
  appId: "1:343854389870:web:c4457b96b4b5ae0584647f"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
export default firebase;