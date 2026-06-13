
import {auth,createauthUserWithEmailAndPassword,creatcompanydoc,verifemaill}from '../../config/fire';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {sendEmailVerification,updateProfile}  from 'firebase/auth';
import { useEffect, useReducer,useState} from 'react';
import { Rgisterver } from './Rgisterver';
import Navbar from '../Navbar';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Register.module.css";
import Footer from '../Footer/Footer';
const intilistate={
companyname:'',
companynametouched:false,
location:'',
locationtouched:false,
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
 function CompanyRegister() {
  const navigate=useNavigate();
const [state,dispatch]=useReducer(reducer,intilistate);
const{companyname,email,password,location}=state;
const [formIsValid,setFormIsValid]=useState(false);
const inputsValid={
companyname:state.companyname.trim() !=='',
location:state.location.trim() !=='',
  email:state.email.includes('@') ,
  password:state.password.length>7
};
useEffect(()=>{
if(inputsValid.companyname&& inputsValid.location && inputsValid.email && inputsValid.password){
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
  if(action.value==="personalprofile"){
    navigate('/Register');
  }
  dispatch(action);
}

const handelsubmit= async (e)=>{
 e.preventDefault();
  try{
const {user}=await createauthUserWithEmailAndPassword(email,password);
await sendEmailVerification(user);
await updateProfile(auth.currentUser, {
    displayName: "company"
  });
await creatcompanydoc(user,{"uid":user.uid,"companyname":companyname,"location":location});
navigate('/RegisterVerification');
}
catch(error){
  
}
}

function onpasswordchange (e){
  const action={
    type:"input",
    input:e.target.name,
    value :e.target.value
  }
  dispatch(action);
  const passwordstate={
    input:'passwordprop',
    value : ( 8>e.target.value.length)? "weak":'strong'

  }
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
  <form action="" className=' form' onSubmit={handelsubmit}>
<h3>Register</h3>
   <label className="text"> Company Name<span className={styles.star}>*</span></label><br/>
   <input type="text" required   className={`${!inputsValid.companyname && state.companynametouched && styles.invalid}`}  name='companyname'onChange={onchange} value={state.companyname} onBlur={blurHandler}/> <br/>
   { !inputsValid.companyname && state.companynametouched && <p className={styles.errorText}> Company name must not be empty!</p>}
   <label className="text"> Location<span className={styles.star}>*</span></label><br/>
   <input type="text" required   className={`${!inputsValid.location && state.location && styles.invalid}`}  name='location'onChange={onchange} value={state.location} onBlur={blurHandler}/> <br/>
   { !inputsValid.location && state.locationtouched && <p className={styles.errorText}> Location must not be empty!</p>}
   <label>Profile Type</label><br/>
   <select type="select"  name="profiletype" onChange={onchange} onBlur={blurHandler}> 
   <option value="companyprofile">Company Profile</option>
    <option value="personalprofile">Personal Profile</option>
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

export default CompanyRegister;
