import React, { useState, useEffect, useReducer } from "react";
import { useContext } from "react";
import AuthContext from "../../Store/auth-context";
import styles from "./AddJob.module.css";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../config/fire";
function splitnumber(str) {
  const numbers = str.split("-").map(Number);
  return numbers;
}
const intilistate = {
  title: "",
  titletouched: false,
  salary: "",
  salarytouched: false,
  jobType: "FullTime",
  jobLocation: "office",
  jobTypetouched: false,
  description: "",
  descriptiontouched: false,
};
function reducer(state, action) {
  let newstate = {};
  switch (action.type) {
    case "touch":
      newstate = { ...state, [action.value]: true };
      break;
    case "input":
      newstate = { ...state, [action.input]: action.value };
      break;
    case "reset":
      newstate = {
        title: "",
        titletouched: false,
        salary: "",
        salarytouched: false,
        jobType: "FullTime",
        jobLocation: "office",
        jobTypetouched: false,
        description: "",
        descriptiontouched: false,
      };
    default:
  }
  return newstate;
}

const AddJob = (probs) => {
  const ctx = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, intilistate);
  const inputsValid = {
    title: state.title.trim() !== "",
    salary: state.salary.trim() !== "",
    description: state.description.trim() !== "",
  };
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (inputsValid.salary && inputsValid.title && inputsValid.description) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [inputsValid]);

  const blurHandler = (e) => {
    const action = {
      type: "touch",
      value: e.target.name + "touched",
    };
    dispatch(action);
  };

  function onchange(e) {
    const action = {
      type: "input",
      input: e.target.name,
      value: e.target.value,
    };
    dispatch(action);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const jobref = collection(db, "Joblist");
    await addDoc(jobref, {
      description: state.description,
      companyname: ctx.profile.companyname,
      type: state.jobType,
      location: state.jobLocation,
      salary1: splitnumber(state.salary)[0],
      salary2: splitnumber(state.salary)[1],
      uid: auth.currentUser.uid,
      companylocation: ctx.profile.location,
      title: state.title,
    });
    const action = {
      type: "reset",
    };
    dispatch(action);
    window.location.reload();
  };

  return (
    <div className={`${styles.container} ${probs.className}`}>
      <form action="" className=" form">
        <h3>Add Job</h3>
        <label className="text">
          Job Title<span className={styles.star}>*</span>
        </label>
        <input
          type="text"
          placeholder=""
          className="text"
          name="title"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.title}
        />
        {!inputsValid.title && state.titletouched && (
          <p className={styles.errorText}>Title must be not empty!</p>
        )}
        <label className="text">
          Salary Range<span className={styles.star}>*</span>
        </label>
        <input
          placeholder="xx-xx"
          className="text"
          name="salary"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.salary}
        />
        {!inputsValid.salary && state.salarytouched && (
          <p className={styles.errorText}>Salary must not be empty!</p>
        )}
        <label>Job Type</label>
        <select
          type="select"
          name="jobType"
          onChange={onchange}
          onBlur={blurHandler}
        >
          <option value="FullTime">FullTime</option>
          <option value="PartTime">PartTime</option>
        </select>
        <br />
        <label>Job Location</label>
        <select
          type="select"
          name="jobLocation"
          onChange={onchange}
          onBlur={blurHandler}
        >
          <option value="Office">Office</option>
          <option value="Remote">Remote</option>
        </select>
        <br />
        <label className="text">
          {" "}
          Description<span className={styles.star}>*</span>
        </label>
        <br />
        <textarea
          type="text"
          name="description"
          onChange={onchange}
          value={state.description}
          maxLength={120}
          placeholder="maximum 120 characters"
          onBlur={blurHandler}
        />{" "}
        <br />
        {!inputsValid.description && state.descriptiontouched && (
          <p className={styles.errorText}>description must not be empty!</p>
        )}
        <div className={styles.button}>
          {" "}
          <button onClick={submitHandler} disabled={!formIsValid}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddJob;
