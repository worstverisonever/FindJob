import React,{useState,useEffect,useContext} from "react";
import styles from "./AppliedUsers.module.css";
import { getAppliedUsers } from "../../Store/jobs-list";
import AuthContext from "../../Store/auth-context";
import { auth, getUserWithId } from "../../config/fire";
import Navbar from "../Navbar";
import profile from "../../images/profilePicutre.jpg";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import Loader from "../UI/Loader/Loader";


const AppliedUsers=()=>{
const [appliedUsers,setAppliedUsers]=useState([]);
const[users,setUsers]=useState([]);
const [loading,setLoading]=useState(true);
const ctx=useContext(AuthContext);
const [initialValue,setInitialValue]=useState([]);
const navigate=useNavigate();
useEffect(()=>{
    
try {getAppliedUsers(ctx.profile.id).then(async (res)=>{
    setAppliedUsers(res);
   
    let users1=[];
    await Promise.all(
    res.map( async (user)=>{
        if(user[0]){
            if(Object.keys(user[0]).length > 0){
               
                let profile=await getUserWithId(user[0].uid);
       users1.push({...profile,jobId:user[0].jobId,jobName:user[0].jobName,userId:user[0].uid});
        }}
    }));
   
        setUsers(users1);
        setInitialValue(users1);
 
  setLoading(false);
})
}
catch(error){

}
},[ctx.profile])

const onChange=(e)=>{
    let filteredAppliers;
if(e.target.value != "all"){
filteredAppliers=initialValue.filter((applier)=>{
    return applier.jobName === e.target.value;
})
setUsers(filteredAppliers);
}
else{
   
    setUsers(initialValue);
}
}
const clickHandler=(id)=>{
navigate(`/PreviewUserProfile/?user=${id}`)
}

if(loading){
    return <><Navbar/><Loader/></>;
}
else if(!loading && users.length < 1){
    return (
        <>
        <Navbar/>
        <main className={styles.errorContainer}>
        <h2>No Application were found.</h2></main></>
    )
}
else{
return(
<>
<Navbar/>
<div className={styles.firstContainer}>
<main className={styles.mainContainer}>
<select type="select"  name="job" onChange={onChange}> 
<option value="all" >All</option>
{ appliedUsers.map((job)=>{
if(job[0]){
return <option value={`${job[0].jobName}`}>{job[0].jobName}</option>}})
}
   </select>
    <ul className={styles.usersList}>
        {users.map((user)=>{
            return <li key={user.userId+user.jobId} onClick={()=>clickHandler(user.userId)}>
                      <div className={styles.userContainer}>
                           <img src={user.profilepicture? user.profilepicture:profile}></img>
                            <Link to={`/PreviewUserProfile?user=${user.userId}`}><h3>{user.firstname + ' ' + user.lastname}</h3></Link>
                            <p>{user.jobName}</p>
                       </div>
                   </li>
        })}
    </ul>
  
</main>
<Footer className={styles.footer}/>
</div>
</>
);
}}
export default AppliedUsers;