import React, { useEffect, useState } from "react";
import styles from "./Reports.module.css";
import { collection, getDocs, onSnapshot, setDoc ,doc, query, orderBy,deleteDoc} from "firebase/firestore";
import { db } from "../../config/fire";
import Navbar from "../Navbar";
import companylogo from "../../images/company.png";
import joblogo from "../../images/job.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import remove from "../../images/close.png";
const Reports=()=>{
const [reports,setReports]=useState([]);
const [loading,setLoading]=useState(true);
const [showDetails,setShowDetails]=useState(false);
const [selectedReport,setSelectedReport]=useState();
const navigate=useNavigate();
useEffect(() => {
    let isMounted = true; // add a flag to check if component is mounted
    let initialFetchComplete = false;
    const q=query(collection(db, "reports"),orderBy("storetime","desc"));
    const unsubscribe = onSnapshot(
      collection(db, "reports"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(initialFetchComplete);
          if (change.type === "added"&&initialFetchComplete) {
            setDoc(doc(db,"reports",change.doc.id),{"status":"seen"},{ merge: true })
            
            if(reports.length===0){
                console.log("adddddddd");

          const temp={...change.doc.data(),"id":change.doc.id}
          setReports((prev)=>{
            return [temp,...prev];})
            }
            else{
                console.log("adddddddd");
                const temp={...change.doc.data(),"id":change.doc.id}
                setReports((prev)=>{
                    return [temp,...prev];})

            }
          }
        });
      }
    );
    const initialFetch = async () => {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const refrence=collection(db,"reports");
getDocs(q).then((res)=>{
    const reportsList= res.docs.map((doc1)=> 
        {
            let type;
            if(doc1.data().companyid){
                type="company";
            }
            else{
                type="job";
            }
            setDoc(doc(db,"reports",doc1.id),{"status":"seen"},{ merge: true })
        
       return {...doc1.data(),id:doc1.id,type:type};
    }
        );
        console.log(reportsList);
        if(reportsList.length > 1){
    setReports(reportsList);}
    else{
        setReports("empty");
    }
    setLoading(false);
})
        if (isMounted) {
          
          initialFetchComplete = true; // set initial fetch flag to true
        }
      };
    
      initialFetch();
    
      return () => {
        unsubscribe();
        isMounted = false; // set flag to false when component unmounts
      };
  }, []);



const clickHandler=(id)=>{
setSelectedReport(id);

if(id == selectedReport && showDetails){
    setShowDetails(false);
}
else{
    setShowDetails(true);
}

}
const searchHandler=(searchValue)=>{
    navigate(`/?value=${searchValue}`);
   }
   const removeHandler=(reportId)=>{
    deleteDoc(doc(db,"reports",reportId))
    setReports((prev)=>(prev.filter((report)=>(report.id != reportId))));
   };
if(loading){
    return (<>
    <Navbar/>
    </>)
}
else if(!loading && reports =="empty"){
    return (<>
        <Navbar/>
        <div className={styles.mainContainer}>
            <h1>No reports where found.</h1>
        </div>
        </>)
}
else{
    return(
        <>
        <Navbar searchHandler={searchHandler}/>
        <main className={styles.mainContainer}>
            <h2>Reports</h2>
        <ul className={styles.reportsList}>
        {reports.map((report)=>{
            if(report.type == "company"){
            return( <div className={`${styles.secondaryContainer} ${selectedReport== report.id && showDetails?styles.selected:''}`}><li key={report.id} className={styles.reportContainer} onClick={()=>clickHandler(report.id)} >
                        <img src={companylogo}></img>
                            <h3>{report.reportType}</h3>
                            <p>{report.date}</p>
                           <img src={remove} onClick={()=>removeHandler(report.id)}/>
                   </li>
                   { selectedReport== report.id && showDetails &&<div className={styles.details}>
                               <p>Company Name: <Link to={`/CompanyPreviewProfile/?user=${report.companyid}`}>{report.companyname}</Link></p>
                                <p>Additional Information: {report.additionalInfo}</p>
                            </div>}
                   </div>)}
             else{
             return( <div className={`${styles.secondaryContainer} ${selectedReport== report.id && showDetails?styles.selected:''}`}><li key={report.id} className={styles.reportContainer} onClick={()=>clickHandler(report.id)} >
                    <img src={joblogo}></img>
                        <h3>{report.reportType}</h3>
                        <p>{report.date}</p>
                        <img src={remove} onClick={()=>removeHandler(report.id)}/>
                        </li>
                        { selectedReport== report.id && showDetails &&  <div className={styles.details}>
                        <p>Company Name: <Link to={`/?job=${report.jobid}`}>{report.jobname}</Link></p>
                                <p>Additional Information: {report.additionalInfo}</p>
                            </div>}
                        </div>);
                   }
        })}
    </ul></main>
        </>
    )
}

}
export default Reports;