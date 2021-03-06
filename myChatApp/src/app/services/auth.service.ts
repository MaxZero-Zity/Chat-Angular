import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { User } from "../shared/services/user";
import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { RestApiService } from '../shared/services/rest-api.service';
import Swal from 'sweetalert2'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    public restApi: RestApiService,
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  // Sign in with email/password
  async logIn(email, password)  {
    Swal.fire({
      title: 'Loading...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    await firebase.auth().signInWithEmailAndPassword(email, password)
    .then((result) => {
      Swal.close()
      setTimeout(()=>{
        this.gotoDashboard()
      }, 10);
    }).catch((error) => {
      Swal.close()
      setTimeout(()=>{
        var errorCode = error.code;
        var errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: errorMessage,
        })
       }, 10);
    })
  }
  gotoDashboard(){
    this.router.navigate(['/dashboard']);
  }
  // Sign up with email/password
  register(email, password) {
    Swal.fire({
      title: 'Loading...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        Swal.close()
        setTimeout(()=>{
          this.gotoLogin();
        }, 10);
        this.setDataUserRegister(result.user);
      }).catch((error) => {
        Swal.close()
        setTimeout(()=>{
          var errorCode = error.code;
          var errorMessage = error.message;
          Swal.fire({
            icon: 'error',
            title: errorMessage,
          })
         }, 10);
    })
  }
  gotoLogin(){
    this.router.navigate(['/login']);
  }
  // Send email verfificaiton when new user sign up
  sendVerificationMail() {
    return firebase.auth().currentUser.sendEmailVerification()
    .then(() => {
      this.router.navigate(['/verify-email-address']);
    })
  }

  // Reset Forggot password
  forgotPassword(passwordResetEmail) {
    return firebase.auth().sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }

  setDataUserRegister(user){
        //ใส่ user ลง Db
    this.restApi.createUser({email:user.email}).subscribe((data: {}) => {
      this.router.navigate(['login'])
    })
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }


  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })

  }

  // Sign out
  logOut() {
    return firebase.auth().signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    })
  }

}
