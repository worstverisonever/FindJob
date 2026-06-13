import React,{useReducer} from "react";
import Button from "../UI/Button/Button";
import styles from "./Report.module.css";
import { db } from "../../config/fire";
import { addDoc, collection } from "firebase/firestore";
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
    const createdAt=new Date();
    e.preventDefault();
    const jobref=collection(db,"reports");
    addDoc(jobref,{
        "companyid":probs.reportedProfile.id,"reportType":state.reportType,"companyname":probs.reportedProfile.companyName,
        "additionalInfo":state.additionalInfo,"date":createdAt.toISOString().split('T')[0]
    }).then(()=>{
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
        <li> <input type="radio" id="fake" name="reportType" value="fake" onChange={changeHandler} checked={state.reportType === 'fake'}></input>
            <label htmlFor="fake" >It seems like a fake company.</label> <br/></li>
        <li>
        <input type="radio" id="fraud" name="reportType" value="fraud" onChange={changeHandler} checked={state.reportType === 'fraud'}></input>
            <label htmlFor="offensive" >This is an impostor account.</label> <br/>
        </li>
    </ul>
    <label htmlFor="info"> Additional Information </label><br/>
    <textarea maxLength={360} id="info" value={state.additionalInfo} onChange={changeHandler} name="additionalInfo" placeholder="maximum 360 characters."/> <br/>
    <Button type="submit" onClick={submitHandler} disabled={!state.reportType.length>0}>Submit</Button>
</form>

);
    
}
export default Report;