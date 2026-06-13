import React,{useState,useEffect,useReducer,useContext,useRef,useCallback} from "react";
import AuthContext from "../../Store/auth-context";
import { useNavigate } from "react-router-dom";
import {doc,setDoc,collection,query,where,getDocs} from 'firebase/firestore';
import {db,auth}from '../../config/fire';
import { onAuthStateChanged } from "firebase/auth";
import Uploadfile from "../Uploadfile";
import styles from "./CompanyEditProfile.module.css";
const intilistate={
    companyname:"",
    companynametouched:false,
    location:'',
    locationtouched:false,
    image:'',
    phone:'',
    website:'',
    twitter:'',
    instagram:'',
    facebook:'',
    description:'',
    picture:'',
    picturetouched:false
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
            case 'untouch':
              newstate={...state,[action.value]:false}
              break;
              default:
            newstate=state;    
            }
        return (newstate);
      }

const CompanyEditProfile=()=>{
        const imgInputRef=useRef();
      const [formIsValid,setFormIsValid]=useState(false);
      const [uploading,setUploading ]=useState(false);
      const[uploaded,setUploaded]=useState(true);
      const navigate=useNavigate();
      const didload=useRef(true);
      const ctx=useContext(AuthContext);
      const [state,dispatch]=useReducer(reducer,intilistate);
     
      const [img,setImg]=useState(ctx.profile.picture ? ctx.profile.picture:"./edit.png");
      const inputsValid={
        companyname: state.companyname.trim() !=='',
        location:state.location.trim() !==''
      };

      useEffect(()=>{
      
          if(inputsValid.companyname){
          setFormIsValid(true);}
          else{
          setFormIsValid(false);}
        
      },[inputsValid]);

      useEffect(()=>{
        
        function mapData(object,input){
            const action={
                   type:"input",
                   input:input,
                   value :object
                 }
                setTimeout(dispatch(action),2000);
          }
          const objectMap = (obj, fn) =>
          Object.fromEntries(
            Object.entries(obj).map(
              ([k, v], i) => [k, fn(v, k, i)]
            )
          )
        objectMap(ctx.profile,mapData)
        if(img === './edit.png' && state.picture){
          setImg(state.picture);
        }
        if(ctx.profile.picture){
          if(ctx.profile.picture.length >0){
        if(img !=ctx.profile.picture){
          setImg(ctx.profile.picture)
        }}}
        
        },[ctx.profile]); 

        const handelsubmit=(e)=>{
            e.preventDefault();
            const userRef = doc(db, 'users', auth.currentUser.uid);
            setDoc(userRef, { companyname:state.companyname,location:state.location,phone:state.phone,website:state.website,
             instagram:state.instagram,facebook:state.facebook,twitter:state.twitter,description:state.description
           }, { merge: true });
            const x={
            companyname:state.companyname,
            location:state.location,
             email:ctx.profile.email,
             id:ctx.profile.id,
             profileType:ctx.profile.profileType,
             picture:(state.picture ? state.picture:''),
             phone:(state.phone? state.phone:''),
             website:state.website,
             instagram:state.instagram,
             facebook:state.facebook,
             twitter:state.twitter,
             description:state.description
            };
           
         if(img !== './edit.png' && state.picturetouched){
           imgInputRef.current.formHandler(e.target[0].files[0]);
           setUploading(true);
           setUploaded(false);
        
         const action={
           type:"untouch",
           value:'picturetouched'
         };
         dispatch(action);
         }
            ctx.onLogin(x);
         }
        
        function onchange(e){
                const action={
                  type:"input",
                  input:e.target.name,
                  value :e.target.value
                }
                dispatch(action);
        }

        const imageChangeHandler= useCallback((event)=>{
               
                setImg(URL.createObjectURL(event.target.files[0]));
                const action={
                  type:"touch",
                  value:'picturetouched'
                };
               
                dispatch(action);
         });
            
        const blurHandler=(e)=>{
                const action={
                  type:"touch",
                  value:e.target.name+"touched"
                }
                dispatch(action);
        }
    
    return(
        <>
        <div  type='get' className={styles.container}>
    <form action="" className=' form' onSubmit={handelsubmit}>
  <div className={styles.img}>
    <label htmlFor="image"><img  src={img? img:''}alt="Profile"/></label> <br/>
    <Uploadfile ref={imgInputRef} id="image" name="image" hidden onChange={imageChangeHandler}  setUploaded={setUploaded} setUploading={setUploading} />
    </div>
      <label className="text"> Company Name<span className={styles.star} >*</span></label><br/>
     <input  type="text"   className={`${!inputsValid.companyname && state.companyname && styles.invalid}`} name='companyname' required onChange={onchange} value={state.companyname} onBlur={blurHandler}/><br/>
     { !inputsValid.companyname && state.companyname && <p className={styles.errorText}> Company name must not be empty!</p>}
     <label className="text"> Location<span className={styles.star} >*</span></label><br/>
     <input  type="text"   className={`${!inputsValid.location && state.location && styles.invalid}`} name='location' required onChange={onchange} value={state.location} onBlur={blurHandler}/><br/>
     { !inputsValid.location && state.location && <p className={styles.errorText}> Location must not be empty!</p>}
     <br/>
    <hr></hr>
    <label className="text" > Description</label><br/>
    <textarea type="text" name="description" onChange={onchange} value={state.description} maxLength={140} placeholder="maximum 140 characters"/> <br/>
     <label className="text" > Phone Number</label><br/>
     <input type="number"   name='phone'onChange={onchange} value={state.phone}/> <br/>
     <label className="text"> Website</label><br/>
     <input type="url"   name='website'onChange={onchange} value={state.website}/> <br/>
     <div className={styles.links}>
      <label htmlFor="twitter" > http://twitter.com/ </label>
      <input type="text" id="twitter" name="twitter" onChange={onchange} value={state.twitter} placeholder="@TwitterUsername"/>
     </div>
     <div  className={styles.links}>
      <label htmlFor="facebook" > http://facebook.com/ </label>
      <input type="text" id="facebook" name="facebook"  onChange={onchange} value={state.facebook} placeholder="FacebookUsername"/>
     </div>
     <div  className={styles.links}>
      <label htmlFor="instagram" > http://instagram.com/ </label>
      <input type="text" id="instagram" name="instagram"  onChange={onchange}  value={state.instagram} placeholder="InstagramUsername"/>
     </div>
     <div className={styles.button}>
     <button type='submit' disabled={!formIsValid || (uploading && !uploaded) }>Confirm</button>
     </div>
    </form>
   
    </div>
    </>);
}

export default CompanyEditProfile;