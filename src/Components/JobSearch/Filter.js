import React, { useReducer } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import styles from "./Filter.module.css";
import Button from "../UI/Button/Button";
const Filter=(probs)=>{
    const [showInput,setShowInput]=useState(false);
    let initialstate={
        location_value:'Anywhere',
        salary_value:'any',
        job_type:'any'
    };
    const salaryInput=useRef();
    const [salaryInputInvalid,setSalaryInputInvalid]=useState(true);
    const[filterType,setFilterType]=useState('');
    const [state,dispatch]=useReducer(reducer,initialstate);
function reducer(state,action){
    let newstate;
    switch(action.type){
        case 'location':
            
            newstate={...state,location_value:action.value};
            setFilterType('location');
            break;
        case 'salary':
            newstate={...state,salary_value:action.value};
            setFilterType('salary');
            break;
        case 'jobtypes':
            newstate={...state,job_type:action.value}
            setFilterType('jobtypes');
            break;
         default:
                break;
    }
    return newstate;
};
useEffect(()=>{
    probs.filter(state,filterType);
},[state,filterType]);
const submitHandler=(event)=>{
event.preventDefault();
   let action={
    type:'salary',
    value:salaryInput.current.value
   };
  dispatch(action);
}
    const radioChangeHandler=(event)=>{
       
    const action={
        type: event.target.name,
        value:event.target.value
    }
    if(event.target.name==="salary" && event.target.value === "other"){
        setShowInput(true);
    }
    else if(event.target.name==="salary" && event.target.value !== "other"){
        setShowInput(false);
    }
    dispatch(action);
}
const inputChangeHandler=(event)=>{
if(event.target.value.trim() >= 1){
    setSalaryInputInvalid(false);
}
else{
    setSalaryInputInvalid(true);
}
}
    return(
    <aside className={`${styles.mainContainer} ${probs.className}`}>
        <form>
            <h3>Filters</h3>
            <ul className={styles.formList}>
                <p>Location</p>
                <li>
                    <input type="radio" id="anywhere" name="location" value="Anywhere" onChange={radioChangeHandler} checked={state.location_value === 'Anywhere'}></input>
                    <label htmlFor="anywhere" > Anywhere</label> <br/>
                </li>
                <li>
                <input type="radio" id="nearme" name="location" value="office" onChange={radioChangeHandler} checked={state.location_value === 'office'}></input>
                    <label htmlFor="nearme"> Office</label> <br/>
                </li>
                <li>
                <input type="radio" id="remote" name="location" value="Remote" onChange={radioChangeHandler} checked={state.location_value === 'Remote'}></input>
                    <label htmlFor="remote"> Remote</label> <br/>
                </li>
            </ul>
            <ul className={styles.formList}>
                <p>Salary</p>
                <li>
                    <input type="radio" id="any" name="salary" value="any" onChange={radioChangeHandler} checked={state.salary_value === 'any'}></input>
                    <label htmlFor="any"> Any</label> <br/>
                </li>
                <li>
                    <input type="radio" id="SE500" name="salary" value="500" onChange={radioChangeHandler} checked={state.salary_value === '500'}></input>
                    <label htmlFor="SE500"> Higher than 500$</label> <br/>
                </li>
                <li>
                    <input type="radio" id="SE1000" name="salary" value="1000" onChange={radioChangeHandler} checked={state.salary_value === '1000'}></input>
                    <label htmlFor="SE1000"> Higher than 1000$</label> <br/>
                </li>
                <li>
                    <input type="radio" id="other" name="salary" value="other" onChange={radioChangeHandler} checked={state.salary_value !== '1000' && state.salary_value !== '500' && state.salary_value !== 'any' }></input>
                    <label htmlFor="other" > Other</label> <br/>
                   {showInput && <input type="text"   placeholder="minimum salary" name="salary" onChange={inputChangeHandler} ref={salaryInput} ></input>}
                 
                   {showInput && <Button type="submit" className={styles.Button} disabled={salaryInputInvalid} onClick={submitHandler}> Apply Filter</Button>}
                </li>
            </ul>
            <ul className={styles.formList}>
                <p>Type of employment</p>
                <li>
                    <input type="radio" id="anyjobtype" name="jobtypes" value="any" onChange={radioChangeHandler} checked={state.job_type === 'any'}></input>
                    <label htmlFor="anyjobtype"> Any</label> <br/>
                </li>
                <li>
                    <input type="radio" id="fulltime" name="jobtypes" value="FullTime" onChange={radioChangeHandler} checked={state.job_type === 'FullTime'}></input>
                    <label htmlFor="fulltime"> FullTime</label> <br/>
                </li>
                <li>
                    <input type="radio" id="parttime" name="jobtypes" value="PartTime" onChange={radioChangeHandler} checked={state.job_type === 'PartTime'}></input>
                    <label htmlFor="parttime"> PartTime</label> <br/>
                </li>
            </ul>
        </form>
    </aside>);
}
export default Filter;