import React from "react";
import styles from "./CompanyPreviewProfile.module.css"
import Navbar from "../../Components/Navbar";
import ReportCompany from "../../Components/Report/ReportCompany";
import { getUserWithId } from "../../config/fire";
import { getCompanyJobs } from "../../Store/jobs-list";
import { useState } from "react";
import JobCard from "../../Components/JobSearch/JobCard";
import { useEffect } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import profile from "../../images/profilePicutre.jpg";
import Button from "../../Components/UI/Button/Button";
import { useContext } from "react";
import option from "../../images/option.png";
import Loader from "../../Components/UI/Loader/Loader";
import AuthContext from "../../Store/auth-context";
import Footer from "../../Components/Footer/Footer";
const CompanyPreviewProfile=(probs)=>{
    const[user,setUser]=useState();
    const location = useLocation();
    const [loading,setLoading]=useState(true);
    const queryParams = new URLSearchParams(location.search);
    const [showReport,setShowReport]=useState(false);
    const [userId, setUserId] = useState(queryParams.get('user'));
    const [profilePicture,setProfilePicture]=useState(profile);
    const [jobs,setJobs]=useState([]);
    const navigate=useNavigate();
    const [showDropDown,setShowDropDown]=useState(false);
    const ctx=useContext(AuthContext);
    
     
    useEffect(()=>{
        try{
        getUserWithId(userId).then(
            (result)=>{setUser(result)
            if(result.profilepicture){
                if(result.profilepicture.length>0){
            setProfilePicture(result.profilepicture);
          
                }
            }
            setLoading(false);
            }
).then(getCompanyJobs(userId).then(
             (result)=>{
                setJobs(result);
            
                        }
))
    }
    catch(error){}
}

    ,[])
    const searchHandler=(searchValue)=>{
        navigate(`/?value=${searchValue}`);
       }

       const deleteHandler=()=>{
//company id is userId
       }

    if(loading){
        return(<><Navbar/><Loader/></>)
    }
    else{
    return(<>
  
    {ctx.isLoggedIn ? ctx.profile.id !== userId &&showReport &&  <ReportCompany className={styles.report} reportedProfile={{id:userId,companyName:user.companyname}}/>:''}
       {ctx.isLoggedIn ? ctx.profile.id !== userId &&showReport && <div className={styles.backdrop} onClick={()=>setShowReport(false)}/>:''}
    <Navbar searchHandler={searchHandler}></Navbar>
     <div className={styles.mainContainer}>
      <div className={styles.secondaryContainer}>
        <aside>
        {ctx.isLoggedIn && ctx.profile.profileType=="admin" &&<div className={`${styles.removeButton} ${showDropDown?styles.selected:''}`} > <button onClick={()=>setShowDropDown((prev)=>(!prev))}><img src={option}></img></button>
          <div  className={`${styles.dropDown} ${showDropDown?styles.active:''}`}>
        <span onClick={deleteHandler}>Delete</span>
        </div>
         </div>
         }
                <img src={profilePicture} className={styles.profilePicture}/>
                    <h3>{user.companyname }</h3>
                    <p>{user.description}</p>
                 {ctx.isLoggedIn ? ctx.profile.id !== userId  &&    <Button className={styles.reportButton} onClick={()=>setShowReport(true)}>Report Company</Button>:''}
        </aside>
        <main className={styles.rightContainer}>
            <section className={styles.basicInfo}>
                <h2>Basic Information</h2>
                <div>
                     <span>
                    <p>Location</p>
                    <p>{user.location}</p>
                    </span>
                    <span>
                    <p>Phone</p>
                    <p>{user.phone?user.phone:''}</p>
                    </span>
                    <span>
                    <p>Email</p>
                    <p>{user.email}</p> </span>     
                </div>
                <div>
                    <span>
                <p>Instagram</p>
                <p>{user.instagram?user.instagram:''}</p></span>
                <span><p>Twitter</p>
                    <p>{user.twitter?user.twitter:''}</p></span> 
                <span><p>Facebook</p>
                    <p>{user.facebook?user.facebook:''}</p></span>  
                </div>
            </section>
           {jobs == "empty" && <div className={styles.noJobs}>
             <p>No posted jobs were found!</p>
            </div>}
            { jobs !="empty" && <div className={styles.jobs}>{
            jobs.map((job)=>{
            return(<Link to={`/?job=${job.id}`} key={job.id}><JobCard title={job.title} companyname={job.companyname}  id={job.jobId} key={job.id}  
                companylocation={job.companylocation} salary1={job.salary1} salary2={job.salary2} type={job.type} location={job.location} className={styles.jobcard}></JobCard></Link>);
        })}
            </div>}
        </main>
      </div>
    </div> 
    <Footer/>
    </>)}
}

export default CompanyPreviewProfile;