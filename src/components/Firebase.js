import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAnf0kdXPndENZ9CKgbohZ3DgMRlJvcQMg',
	authDomain: 'whatsappclone-999.firebaseapp.com',
	projectId: 'whatsappclone-999',
	storageBucket: 'whatsappclone-999.appspot.com',
	messagingSenderId: '201570056537',
	appId: '1:201570056537:web:a56a6e7b5f37db9c98b448',
	measurementId: 'G-7SL8JZ925K',
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

export { db, auth, googleProvider, arrayRemove, arrayUnion };
