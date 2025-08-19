import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfarlwSpSwZk0BLOIiR3yKkDASp_OC2HA",
  authDomain: "video-sharing-app-61b52.firebaseapp.com",
  projectId: "video-sharing-app-61b52",
  storageBucket: "video-sharing-app-61b52.appspot.com",
  messagingSenderId: "515875966205",
  appId: "1:515875966205:web:9a0ce60d90a6e615554294",
  measurementId: "G-HH01J5E6XB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const provider=new GoogleAuthProvider();

export const auth=getAuth();

export default app;