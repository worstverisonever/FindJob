import { useEffect, useRef,useState} from 'react';
import {auth, verifemaill,db} from '../../config/fire'
import AuthContext from '../../Store/auth-context';
import React,{useContext} from 'react';
import { onAuthStateChanged ,deleteUser} from 'firebase/auth';
import styles from './Registerver.module.css';
import Navbar from '../Navbar';
import {getDocs,collection,doc,deleteDoc} from 'firebase/firestore';
import ErrorModal from '../UI/ErrorModal';
import { useNavigate } from 'react-router-dom';

export function Rgisterver(){
const ctx=useContext(AuthContext);
const didload=useRef(true);
const [state,setstate]=useState(true)
const [error,setError]=useState();
const navigate=useNavigate();
const errorClickHandler=()=>{
navigate("/Register");
}
useEffect (()=>{

  onAuthStateChanged(auth,async (data)=>{
        try{
          const a=window.localStorage.getItem('var');
          if(didload.current===true&& JSON.parse(a)==false){
                if(verifemaill()===true){     
                  const usersref=collection(db,'users');
                  const data=await getDocs(usersref);
                  const fillterdata1= data.docs.map((doc)=>
                   ({...doc.data(),id:doc.id 
                  }
                  ));
                  const fillterdata2=fillterdata1.filter((user)=>
                  user.uid==auth.currentUser.uid
                );
                  const profile=fillterdata2[0];
                  if(auth.currentUser.displayName==="personal"){
                 const x={
                  firstname:profile.firstname,
                  lastname:profile.lastname,
                  email:profile.email,
                  id:profile.id,
                  appliedJobs:[],
                  profileType:auth.currentUser.displayName,
                  picture:'',
                  description:'',
                  phone:'',
                  website:'',
                 };
                 navigate("/Profile");
                ctx.onLogin(x);
                  }
                  if(auth.currentUser.displayName==="company"){
                      const x={
                       companyname:profile.companyname,
                       email:profile.email,
                       id:profile.id,
                       profileType:auth.currentUser.displayName,
                       location:profile.location,
                       picture:'',
                       description:'',
                       phone:'',
                       website:'',
                      };
                     ctx.onLogin(x);
                     navigate("/CompanyProfile");
                  }
               
                }
                if(verifemaill()=== false){
                 
                  const usersref=collection(db,'users');
                  const data=await getDocs(usersref);
                  const fillterdata1= data.docs.map((doc)=> ({...doc.data(),id:doc.id 
                  }
                  ));
                  const fillterdata2=fillterdata1.filter((user)=>user.uid==auth.currentUser.uid
              );
                  const profile=fillterdata2[0];
                  const docref=doc(db,"users",profile.id);
                   await deleteDoc(docref);
                   await deleteUser(auth.currentUser);
                  setError(<ErrorModal title="Account not verified" message="Your account isn't verified by email." solution="okay" onClick={errorClickHandler}/>)
                }
                didload.current=false;
                window.localStorage.setItem('var',JSON.stringify( true));
         }
            }
            catch{}
    });
}
,[state]);
async function  refr(e){
  e.preventDefault();
  window.localStorage.setItem('var',JSON.stringify( false))
  await auth.currentUser.reload();
 
  setstate(false);
}
const searchHandler=(searchValue)=>{
  navigate(`/?value=${searchValue}`);
 }
return(
  <>
    <Navbar searchHandler={searchHandler}></Navbar>
    {error}
    <main className={styles.mainContainer}>
    <div className={styles.secondaryContainer}>
    <h1>Verification</h1>
    <p>Go check your emails and complete the verification process inorder to create your account.</p>
    <p>After Completing the verification process press the Complete Button below.</p>
    <form action="">
        <button type='submit' onClick={refr}>Complete</button>
        </form>
        </div>
        </main>
        </>
);}