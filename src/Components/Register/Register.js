
import {auth,createauthUserWithEmailAndPassword,creatuserdoc}from '../../config/fire';
import {sendEmailVerification,updateProfile}  from 'firebase/auth';
import { useEffect, useReducer,useState} from 'react';
import Navbar from '../Navbar';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Register.module.css";
import ErrorModal from '../UI/ErrorModal';
import Footer from '../Footer/Footer';
const intilistate={
firstname:"",
firstnametouched:false,
lastname:'',
lastnametouched:false,
email:'',
emailtouched:false,
password:'',
passwordtouched:false,
profiletype:'',
passwordprop:'',
}

function reducer(state,action){
let newstate={};
  switch(action.type){
    case 'touch':
      newstate={...state,[action.value]:true}
      break;
      case 'input':
        newstate={...state,[action.input]:action.value};
        break;
        default:}
  return (newstate);
}
 function Register() {
  const navigate=useNavigate();
const [state,dispatch]=useReducer(reducer,intilistate);
const{firstname,lastname,email,password}=state;
const [formIsValid,setFormIsValid]=useState(false);
const [error,setError]=useState();
const [showError,setShowError]=useState(false);
const inputsValid={
  firstname:state.firstname.trim() !=='',
  lastname:state.lastname.trim() !=='' ,
  email:state.email.includes('@') ,
  password:state.password.length>7
};

useEffect(()=>{
if(inputsValid.firstname  && inputsValid.lastname && inputsValid.email && inputsValid.password){
setFormIsValid(true);}
else{
setFormIsValid(false);}
},[inputsValid]);

function onchange(e){
  const action={
    type:"input",
    input:e.target.name,
    value :e.target.value
  }
  if(action.value==="companyprofile"){
    navigate('/CompanyRegister');
  }
  dispatch(action);
}
const errorClickHandler=()=>{
setShowError(false);
navigate('/Login')
}
const handelsubmit= async (e)=>{
 e.preventDefault();
  try{
const {user}=await createauthUserWithEmailAndPassword(email,password);
await sendEmailVerification(user);
const uid=auth.currentUser.uid;
await updateProfile(auth.currentUser, {
  displayName: "personal"
});
await creatuserdoc(user,{
  "firstname":firstname,
"lastname":lastname,
"uid":uid});
navigate('/RegisterVerification');
}
catch(error){
if(error.code=== 'auth/email-already-in-use'){
  setShowError(true);
   setError(<ErrorModal title="Error creating your account" message="Your email is Already in use." solution="Go to login"onClick={errorClickHandler}></ErrorModal>)}
}
}

function onpasswordchange (e){
  const action={
    type:"input",
    input:e.target.name,
    value :e.target.value
  }
  dispatch(action);
}
const blurHandler=(e)=>{
  const action={
    type:"touch",
    value:e.target.name+"touched"
  }
  dispatch(action);
  }
  const searchHandler=(searchValue)=>{
    navigate(`/?value=${searchValue}`);
   }
  return (
    <>
   
      <Navbar searchHandler={searchHandler}></Navbar>
    <div  type='get' className={styles.container}>
    {showError && error}
  <form action="" className=' form' onSubmit={handelsubmit}>
<h3>Register</h3>
    <label className="text"> First Name<span className={styles.star} >*</span></label><br/>
   <input  type="text"   className={`${!inputsValid.firstname && state.firstnametouched && styles.invalid}`} name='firstname' required onChange={onchange} value={state.firstname} onBlur={blurHandler}/><br/>
   { !inputsValid.firstname && state.firstnametouched && <p className={styles.errorText}> First name must not be empty!</p>}
   <label className="text"> Last Name<span className={styles.star}>*</span></label><br/>
   <input type="text" required   className={`${!inputsValid.lastname && state.lastnametouched && styles.invalid}`}  name='lastname'onChange={onchange} value={state.lastname} onBlur={blurHandler}/> <br/>
   { !inputsValid.lastname && state.lastnametouched && <p className={styles.errorText}> Last name must not be empty!</p>}
   <label>Profile Type</label><br/>
   <select type="select"  name="profiletype" onChange={onchange} onBlur={blurHandler}> 
    <option value="personalprofile">Personal Profile</option>
    <option value="companyprofile">Company Profile</option>
   </select><br/>
   <label className="text">Email Address<span className={styles.star}>*</span></label><br/>
   <input  type="text" required   className={`${!inputsValid.email && state.emailtouched && styles.invalid}`} name='email' onChange={onchange} onBlur={blurHandler}/><br/>
   { !inputsValid.email && state.emailtouched && <p className={styles.errorText}> Email must be valid!</p>}
   <label className="text">Password<span className={styles.star}>*</span></label><br/>
   <input  type="password" required   className={`${!inputsValid.password && state.passwordtouched && styles.invalid}`} name='password' placeholder='At least 8 characters' onChange={onpasswordchange} value={state.password} onBlur={blurHandler}/> <br/>
   { !inputsValid.password && state.passwordtouched && <p className={styles.errorText}> Password must be longer than 7 characters!</p>}
   <div className={styles.button}>
   <button type='submit' disabled={!formIsValid}>Confirm</button>
   <p>Already have an account? <Link to="/Login">Log in</Link></p>
   </div>
  </form>
 
  </div>
  </>
  );
}

export default Register;
