import axios from 'axios';
import qs from 'qs';

import { PROFILE_DB_REF } from '../constants/firebaseRefs';
import { MSG_PROFILE_NOT_FOUND } from '../constants/messages';

const AVATAR_STORAGE_PATH = process.env.REACT_APP_FIREBASE_AVATAR_PATH;

class UserProvider {
  constructor(firebaseAuth, firebaseDatabase, firebaseStorage, dbPath) {
    this.auth = firebaseAuth;
    this.db = firebaseDatabase;
    this.storage = firebaseStorage;
    this.dbPath = dbPath;
  }

  getProfile = uid => this.db.ref(`${this.dbPath}/${PROFILE_DB_REF}/${uid}`).once('value');

  getAuthUserProfile = authUser =>
    new Promise(resolve => {
      this.auth.currentUser.getIdToken(true).then(idToken => {
        this.getProfile(authUser.uid).then(snapshot => {
          if (snapshot.val()) {
            const dbProfile = {
              avatar: snapshot.val().avatar ? snapshot.val().avatar : null,
              firstName: snapshot.val().firstName,
              lastName: snapshot.val().lastName,
              location: snapshot.val().location ? snapshot.val().location : '',
              jobTitle: snapshot.val().jobTitle ? snapshot.val().jobTitle : '',
              emailVerified: snapshot.val().emailVerified ? snapshot.val().emailVerified : false,
              uid: snapshot.val().uid,
              token: snapshot.val().token ? snapshot.val().token : null,
              social: snapshot.val().social ? snapshot.val().social : false,
              roles: snapshot.val().roles ? snapshot.val().roles : {},
            };

            // merge auth and db user
            const authUserProfile = {
              uid: authUser.uid,
              displayName: authUser.displayName,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              photo: authUser.photoURL ? authUser.photoURL : null,
              idToken,
              ...dbProfile,
            };

            resolve(authUserProfile);
          }
        });
      });
    });

  doVerifyAuthUser = authUser =>
    new Promise((resolve, reject) => {
      this.getProfile(authUser.uid).then(snapshot => {
        if (!snapshot.val()) {
          return reject(new Error(MSG_PROFILE_NOT_FOUND));
        }

        const dbProfile = {
          email: authUser.email,
          firstName: snapshot.val().firstName,
          emailVerified: snapshot.val().emailVerified ? snapshot.val().emailVerified : false,
          uid: snapshot.val().uid,
          token: snapshot.val().token ? snapshot.val().token : null,
          social: snapshot.val().social ? snapshot.val().social : false,
        };

        resolve(dbProfile);
      });
    });

  doVerifySocialUser = async authUser => {
    let profileInfo = null;
    const { uid } = authUser;

    const snaps = await this.getProfile(uid);
    if (snaps.val() === null) {
      profileInfo = await this.doRegisterSocialProfile(authUser);
    } else if (!snaps.val().emailVerified) {
      const updates = {};
      updates[`${this.dbPath}/${PROFILE_DB_REF}/${uid}/emailVerified`] = true;
      updates[`${this.dbPath}/${PROFILE_DB_REF}/${uid}/social`] = true;

      await this.db.ref().update(updates);
      await this.auth.currentUser.updateProfile({ emailVerified: true });
    }

    if (!profileInfo) {
      profileInfo = {
        email: snaps.val().email,
        firstName: snaps.val().firstName,
        emailVerified: true,
        uid: snaps.val().uid ? snaps.val().uid : uid,
        token: snaps.val().token,
        social: true,
      };
    }

    return profileInfo;
  };

  doSignOut = () => {
    localStorage.removeItem('fundra-profile');
    this.auth.signOut();
  };

  doRegisterToken = uid =>
    new Promise(resolve => {
      const token = Math.random()
        .toString(36)
        .slice(-8);
      this.db
        .ref(`${this.dbPath}/${PROFILE_DB_REF}/${uid}/token`)
        .set(token)
        .then(() => {
          resolve({ status: 'registered', token });
        });
    });

  doSendVerify = (profile, id = 1) =>
    new Promise((resolve, reject) => {
      const axiosConfig = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
      const mode = this.dbPath === 'dev' ? 'DEV' : 'PROD';
      const VERIFY_URL = `${process.env.REACT_APP_FIREBASE_CLOUD_FUNCTION}/sendVerify`;
      const formData = {
        id,
        mode,
        data: JSON.stringify(profile),
        token: '8pS3d6GxECa9hNQd',
      };

      axios
        .post(VERIFY_URL, qs.stringify(formData), axiosConfig)
        .then(() => {
          resolve({ status: 'send' });
        })
        .catch(err => {
          reject(err.message);
        });
    });

  doRegisterNewUser = async (uid, data, userForm = 1) => {
    const { firstName, lastName, email, phone, payment } = data;

    await this.auth.currentUser.updateProfile({ displayName: `${firstName} ${lastName}` });

    const token = Math.random()
      .toString(36)
      .slice(-8);
    const userProfile = {
      uid,
      firstName,
      lastName,
      email,
      phone,
      token,
      emailVerified: false,
    };
    if (payment) {
      userProfile.payment = payment;
    }

    await this.db.ref(`${this.dbPath}/${PROFILE_DB_REF}/${uid}`).set(userProfile);
    await this.doSendVerify(userProfile, userForm);

    return { status: 'ok', uid };
  };

  doRegisterSocialProfile = async authUser => {
    const { uid } = authUser;
    const fullName = authUser.displayName.split(' ');
    const userProfile = {
      uid,
      firstName: fullName[0],
      lastName: fullName[1] ? fullName[1] : '',
      email: authUser.email,
      phone: '',
      emailVerified: true,
      social: true,
    };

    await this.db.ref(`${this.dbPath}/${PROFILE_DB_REF}/${uid}`).set(userProfile);
    await this.auth.currentUser.updateProfile({ emailVerified: true });

    return userProfile;
  };

  doUpdateUserProfile = async data => {
    const { uid, firstName, lastName, location, jobTitle, avatar, prevAvatar } = data;
    let avatarUrl = prevAvatar;

    const updates = {};
    updates[`${this.dbPath}/${PROFILE_DB_REF}/${uid}/firstName`] = firstName;
    updates[`${this.dbPath}/${PROFILE_DB_REF}/${uid}/lastName`] = lastName;
    updates[`${this.dbPath}/${PROFILE_DB_REF}/${uid}/location`] = location;
    updates[`${this.dbPath}/${PROFILE_DB_REF}/${uid}/jobTitle`] = jobTitle;

    if (avatar) {
      const avatarPath = `${AVATAR_STORAGE_PATH}/${uid}.jpg`;
      const avatarSnap = await this.storage.child(avatarPath).put(avatar, { contentType: avatar.type });
      avatarUrl = await avatarSnap.ref.getDownloadURL();
      updates[`${this.dbPath}/${PROFILE_DB_REF}/${uid}/avatar`] = avatarUrl;
    }

    await this.db.ref().update(updates);
    await this.auth.currentUser.updateProfile({ displayName: `${firstName} ${lastName}` });

    return { uid, firstName, lastName, location, jobTitle, avatar: avatarUrl };
  };
}

export default UserProvider;
