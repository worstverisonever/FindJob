import React, { useEffect } from "react";
import AuthContext from "../Store/auth-context";
import Navbar from "../Components/Navbar";
import { useContext } from "react";
import styles from './UserProfile.module.css';
import Button from "../Components/UI/Button/Button";
import location from "../images/location.png";
import profilePicture from "../images/profilePicutre.jpg";
import { useNavigate } from "react-router-dom";
import {Uploadfile}from "./Uploadfile";
import { auth } from "../config/fire";
function UserProfile(){
  const navigate=useNavigate();
 useEffect(()=>{

 },[])
    const ctx=useContext(AuthContext);  // getting user info from the context provider
  const onClickHandler=()=>{
navigate('/EditUserProfile');

  }

    return(
        <div>
            <Navbar></Navbar>
            <div className={styles.userprofile}>
  <img src={profilePicture} alt="Profile Picture"/>
  <h1>{ctx.profile.name}</h1>
  <p>{ctx.description}</p>
  <Uploadfile/>
  <ul>
    <li><strong>Email:</strong>{ctx.profile.email}</li>
    <li><strong>Phone:</strong> {ctx.profile.phone}</li>
    <li><strong>Website:</strong> {ctx.profile.website && <a href={ctx.profile.website}>{ctx.profile.website}</a>}</li>
    <li><strong>Resume: </strong> <br/> {ctx.profile.resuem && <iframe src={ctx.profile.resume}  ></iframe>}
</li>
  </ul>
  <button className={styles.editprofilebtn} onClick={onClickHandler}>Edit Profile</button>
</div>

        </div>
    )
};
export default UserProfile;
