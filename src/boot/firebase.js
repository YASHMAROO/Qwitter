import firebase from "firebase/app"
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBp-foqAXHoKR3O4Zp2niz4sCnw3f9K4y4",
  authDomain: "qwitter-10e7e.firebaseapp.com",
  projectId: "qwitter-10e7e",
  storageBucket: "qwitter-10e7e.appspot.com",
  messagingSenderId: "554505083780",
  appId: "1:554505083780:web:be5a307d56dc8acb255bd1"

}

firebase.initializeApp(firebaseConfig)

const db=firebase.firestore()

export default db;