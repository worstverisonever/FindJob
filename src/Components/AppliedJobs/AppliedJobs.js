import React,{useState,useEffect,useContext} from "react";
import AuthContext from "../../Store/auth-context";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "./AppliedJobs.module.css";
import { jobs_list } from "../../Store/jobs-list";
import JobCard from "../JobSearch/JobCard";
import Navbar from "../Navbar";
import Footer from "../Footer/Footer";
import Loader from "../UI/Loader/Loader";

const AppliedJobs=()=>{
    const ctx=useContext(AuthContext);
    const [jobs,setJobs]=useState([]);
    const [loading,setLoading]=useState(true);
    useEffect(()=>{                                // fetching all the jobs
        jobs_list().then((result)=>{
           
            if(result.length>0){
                setJobs(result.filter((job)=>{
                    return ctx.profile.appliedJobs.includes(job.id);  //filtering to only the jobs user has applied to
                }));
                setLoading(false);
            }
            else{
                setLoading(false);
                setJobs("empty");
            }
           
        })
    },[ctx.profile])
    
    const navigate=useNavigate();
    const searchHandler=(searchValue)=>{    // to handle any search done within the navbar
        navigate(`/?value=${searchValue}`);
       }
if(loading){
    return(<>
        <Navbar/>
        <main className={styles.loadingContainer}>
            <Loader/>

        </main>
        </>
    )
}
else if(!loading){
    return(<>
    <Navbar searchHandler={searchHandler}/>
    {jobs.length < 1 && <main className={styles.mainEmpty}>
       <h1>No jobs were found.</h1> 
        </main>}
    {jobs !== "empty" && jobs.length > 0 && <main className={styles.main}>
    { jobs.map((job)=>{
            return(<JobCard title={job.title} companyname={job.companyname} companyId={job.uid} id={job.id} key={job.id}  showRemoveButton={true}
                companylocation={job.companylocation} salary1={job.salary1} salary2={job.salary2} type={job.type} location={job.location}  ></JobCard>);
        })}
        </main>}
       
        <Footer/>
    </>);
}}
export default AppliedJobs;
