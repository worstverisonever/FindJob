import React,{useReducer} from "react";
import Button from "../UI/Button/Button";
import styles from "./Report.module.css";
import { db } from "../../config/fire";
import { addDoc, collection,serverTimestamp } from "firebase/firestore";
let initialstate={
    reportType:'',
    additionalInfo:''
}
const reducer=(state,action)=>{
    let newstate;
    switch(action.type){
        case 'reportType':
            newstate={...state,reportType:action.value};
            break;
        case 'additionalInfo':
            newstate={...state,additionalInfo:action.value}
            break;
         case 'clear':
                newstate={reportType:'',additionalInfo:''};
                break;
         default:
                break;
    }
    return newstate;
}
const Report = (probs)=>{
const [state,dispatch]=useReducer(reducer,initialstate);

const changeHandler=(event)=>{
    const action={
        type: event.target.name,
        value:event.target.value
    }
    dispatch(action);
}
const submitHandler=(e)=>{
    e.preventDefault();
    const createdAt=new Date();
    const jobref=collection(db,"reports");
    addDoc(jobref,{
        "jobid":probs.reportedJob.id,"reportType":state.reportType,"jobname":probs.reportedJob.title,
        "additionalInfo":state.additionalInfo,'date':createdAt.toISOString().split('T')[0],
    "storetime":serverTimestamp(),}).then(()=>{
        const action={
            type:'clear'
        };
        dispatch(action);
    }).catch((error)=>{})
}
return(
<form className={`${probs.className} ${styles.report}`}>
    <h1>Report this job</h1>
    <hr></hr>
    <ul>
        <li>
            <input type="radio" id="offensive" name="reportType" value="offensive" onChange={changeHandler} checked={state.reportType === 'offensive'}></input>
            <label htmlFor="offensive" >It is offensive</label> <br/>
        </li>
        <li> <input type="radio" id="fake" name="reportType" value="fake" onChange={changeHandler} checked={state.reportType === 'fake'}></input>
            <label htmlFor="fake" >It seems like a fake job</label> <br/></li>
        <li>
        <input type="radio" id="inaccurate" name="reportType" value="inaccurate" onChange={changeHandler} checked={state.reportType === 'inaccurate'}></input>
            <label htmlFor="offensive" >It contains inaccurate information</label> <br/>
        </li>
    </ul>
    <label htmlFor="info"> Additional Information </label><br/>
    <textarea maxLength={360} id="info" value={state.additionalInfo} onChange={changeHandler} name="additionalInfo" placeholder="maximum 360 characters."/> <br/>
    <Button type="submit" onClick={submitHandler} disabled={!state.reportType.length>0}>Submit</Button>
</form>

);
    
}
export default Report;