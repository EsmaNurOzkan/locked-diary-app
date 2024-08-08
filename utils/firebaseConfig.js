import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyDBgLvO9PKAyIEdqoeou90oy0tEAtUatds",
    authDomain: "diary-app-upgrated.firebaseapp.com",
    projectId: "diary-app-upgrated",
    storageBucket: "diary-app-upgrated.appspot.com",
    messagingSenderId: "17969906755",
    appId: "1:17969906755:android:8a6b70efbd4369b0ec80f6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app); 

export { auth, firestore };