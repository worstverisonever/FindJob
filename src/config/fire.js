// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Persistence } from 'firebase/compat/auth';
import React,{useContext} from "react";
import {getStorage} from 'firebase/storage'
import AuthContext from "../Store/auth-context";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,signInWithRedirect,signInWithPopup
,signInWithEmailAndPassword,
createUserWithEmailAndPassword,
} 
from 'firebase/auth';
import {getFirestore,doc,getDoc,setDoc,collection,query,where,getDocs} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9TINPWPJdzebOhrm1-VmLBf847P8cbBM",
  authDomain: "jobs-245f8.firebaseapp.com",
  projectId: "jobs-245f8",
  storageBucket: "jobs-245f8.appspot.com",
  messagingSenderId: "601953853856",
  appId: "1:601953853856:web:f1efdcb8250d7fbef484c5",
  measurementId: "G-6GYHVGSFFQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const app = initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db=getFirestore(app);
export const storage =getStorage(app);

export const creatuserdoc=async (userAuth,addinfo={})=>{
const userdocref=doc(db,'users',userAuth.uid);
const usersnapshot=await getDoc(userdocref);
if(!usersnapshot.exists()){
  const{email}=userAuth;
  const createdAt=new Date();
 try{
  await setDoc(userdocref,{
    email,createdAt,
    ...addinfo

  });
}
  catch(error){
    
  }
}
return userdocref;
}
export const signwithuser= async(email,password)=>{
  if(!email ||!password) return;
  return await signInWithEmailAndPassword(auth,email,password)
}
export const createauthUserWithEmailAndPassword=async(email,password)=>{
  if(!email ||!password) return;
  return await createUserWithEmailAndPassword(auth,email,password);
}

export function verifemaill(){

  if(auth.currentUser.emailVerified===true){
    
  return true; }
  else{
    
  return false;
  }
}
export async function persistence(){
  const persistence = firebase.auth.Auth.Persistence.LOCAL;
  await auth.setPersistence(persistence);
}

export const creatcompanydoc=async (userAuth,addinfo={})=>{
  const userdocref=doc(db,'users',userAuth.uid);
  const usersnapshot=await getDoc(userdocref);
  if(!usersnapshot.exists()){
    const{email}=userAuth;
    const createdAt=new Date();
   try{
    await setDoc(userdocref,{
      email,createdAt,
      ...addinfo
  
    });
   }
   catch(error){
    
  }
}
return userdocref;
}
export const getUserWithId=async(id)=>{
  
  const usersref=doc(db,'users',id);
   const profile=(await getDoc(usersref)).data();
   
 return profile;
}