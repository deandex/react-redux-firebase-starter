import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_DB_PATH,
  CONFIRMATION_EMAIL_REDIRECT,
} from '../../global/environment';

// Providers
import UserProvider from '../../services/user/firebase';

const config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage().ref();

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();

    this.userProvider = new UserProvider(this.auth, this.db, this.storage, FIREBASE_DB_PATH);
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doHiddenSignInWithGoogle = (email) => {
    this.googleProvider.setCustomParameters({ login_hint: email });
    return this.auth.signInWithPopup(this.googleProvider);
  };

  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  fetchProvidersForEmail = (email) => this.auth.fetchProvidersForEmail(email);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doVerifyPassword = async (data) => {
    const { email, currentPassword, password, linkPasswordProvider } = data;

    if (linkPasswordProvider) {
      const credential = app.auth.EmailAuthProvider.credential(email, password);
      await this.auth.currentUser.linkWithCredential(credential);
    } else {
      const credential = app.auth.EmailAuthProvider.credential(email, currentPassword);
      await this.auth.currentUser.reauthenticateWithCredential(credential);
      await this.doPasswordUpdate(password);
    }

    return { status: 'updated' };
  };

  doPasswordUpdate = (password) => this.auth.currentUser.updatePassword(password);

  doSendEmailVerification = () => this.auth.currentUser.sendEmailVerification({ url: CONFIRMATION_EMAIL_REDIRECT });

  getFreshToken = async () => {
    let idToken = null;
    if (this.auth.currentUser) {
      idToken = await this.auth.currentUser.getIdToken(true);
    }

    return idToken;
  };

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.userProvider.getAuthUserProfile(authUser).then((authUserProfile) => {
          next(authUserProfile);
        });
      } else {
        fallback();
      }
    });
}

export default Firebase;
