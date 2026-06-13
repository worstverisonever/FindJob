import React, { useContext,useState,useRef  } from "react";
import Card from "../UI/Card";
import Button from "../UI/Button/Button";
import styles from "./JobCard.module.css";
import close from "../../images/close.png"
import AuthContext from "../../Store/auth-context";
import { useNavigate } from "react-router-dom";
import {doc,collection,deleteDoc,getDoc,getDocs, query, where, setDoc}from "firebase/firestore";
import { auth,db } from "../../config/fire";
import option from "../../images/option.png";
const JobCard=(probs)=>{
    let FullTime= probs.type === "FullTime";
    let Parttime=probs.type === "PartTime";
    let remote=probs.location === "Remote";
    let salaryRange= probs.salary+"$";
    const id2=useRef("");
const ctx=useContext(AuthContext);
const navigate=useNavigate();
const [showDropDown,setShowDropDown]=useState(false);

const removeHandler=  ()=>{
   
    ctx.setProfile({...ctx.profile,appliedJobs:(ctx.profile.appliedJobs.filter((job) => (job !== probs.id)))});
    const docRef = doc(db, "Joblist", probs.id);
    const userRef=doc(db, "users", auth.currentUser.uid);
    const subcollectionRef = collection(docRef, "appliedjobs");
    const q=query(subcollectionRef,where("uid","==",auth.currentUser.uid));
   getDocs(q).then((docs)=>{
   docs.forEach((doc)=>{
            id2.current=doc.id;
        }
        );
        if(id2.current!==null){
    deleteDoc(doc(subcollectionRef,id2.current));
   getDoc(userRef).then((res)=>{
    const appliedjobs=res.data().appliedjobs;
    const newappliedjobs= appliedjobs.filter(
        (appliedjob)=>{return appliedjob!==probs.id })
   
    setDoc(userRef,{"appliedjobs":newappliedjobs},{merge:true});
   }
   );
    
        }
    
    });
}

const deleteHandler=()=>{
    setShowDropDown((prev)=>(!prev));
    //job id is probs.id
    const joblistRef=doc(db,"Joblist",probs.id);
    const subcollectionRef = collection(joblistRef, "appliedjobs");
getDocs(subcollectionRef).then((res) => {
  const filterIds = res.docs.map((doc1) => {
   
    return doc1.id;
  });
 
  if (filterIds.length > 0) {
    filterIds.forEach((id) => {
      deleteDoc(doc(subcollectionRef, id));
    });
  }
});
    deleteDoc(joblistRef);
    const usersRef = collection(db, "users");
const q = query(usersRef, where("appliedjobs", "array-contains", probs.id));
getDocs(q).then((res) => {
  res.docs.forEach(async (doc1) => {
    const newappliedjobs = doc1
      .data()
      .appliedjobs.filter((appliedJob) => appliedJob !== probs.id);
    const userRef = doc(db, "users", doc1.id);
    await setDoc(userRef, { appliedjobs: newappliedjobs }, { merge: true });
  });
});}
    return(
        <>
        <li className={`${styles.list} ${probs.selectedJob? (probs.id===probs.selectedJob.id ? styles.selected:''):''} ${probs.className}`} >
         {probs.showRemoveButton? probs.showRemoveButton? <button onClick={removeHandler} className={`${styles.removeButton} ${styles.unApplyButton}`} title="Unapply from job"><img src={close}></img></button>:'':''}
         {ctx.isLoggedIn && ctx.profile.profileType=="admin" &&<div className={`${styles.removeButton} ${showDropDown?styles.selected:''}`} > <button onClick={()=>setShowDropDown((prev)=>(!prev))}><img src={option}></img></button>
          <div  className={`${styles.dropDown} ${showDropDown?styles.active:''}`}>
        <span onClick={deleteHandler}>Delete</span>
        </div>
         </div>
         }
          <span onClick={probs.customOnClick}>
            <h3 className={styles.title}>{probs.title}</h3>
           <div className={styles.info}> <p>{probs.companyname} </p>
           <span> &#x2022;</span>
            <p> {probs.companylocation}</p></div>
          
<div className={styles.proberties}> {FullTime && <p className={styles.proberty}>FullTime</p>} {Parttime && <p className={styles.proberty}>PartTime</p>} {remote && <p className={styles.proberty}>Remote</p>} <p className={styles.proberty}>{probs.salary1 + '-' +probs.salary2 + '$'}</p></div>
</span>
<Button className={`${styles.button}`}  disabled={ctx.isLoggedIn && ctx.profile.profileType=="personal"?(ctx.profile.appliedJobs.includes(probs.id)):false} onClick={probs.applyHandler}>{ctx.isLoggedIn && ctx.profile.profileType=="personal"?(ctx.profile.appliedJobs.includes(probs.id)?'Applied':'Apply'):'Apply'}</Button>
        </li>
        </>
    )
}
export default JobCard;