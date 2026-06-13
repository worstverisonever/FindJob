import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth, signwithuser } from "../config/fire";
import { useReducer } from "react";
import Navbar from "../Components/Navbar";
import styles from "./Login.module.css";
import { verifemaill, db } from "../config/fire";
import {
  getDocs,
  collection,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useContext } from "react";
import AuthContext from "../Store/auth-context";
import { useState } from "react";
import ErrorModal from "../Components/UI/ErrorModal";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer/Footer";

const intilistate = {
  emailaddress: "",
  emailaddresstouched: false,
  password: "",
  passwordtouched: false,
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
    default:
  }
  return newstate;
}

function Login() {
  const ctx = useContext(AuthContext);
  const [error, setError] = useState();
  const [showError, setShowError] = useState(false);
  const [state, dispatch] = useReducer(reducer, intilistate);
  const navigate = useNavigate();
  const errorClickHandler = () => {
    setShowError(false);
  };
  const inputsValid = {
    emailaddress: state.emailaddress.includes("@"),
    password: state.password.length > 0,
  };

  function onchange(e) {
    const action = {
      type: "input",
      input: e.target.name,
      value: e.target.value,
    };
    dispatch(action);
  }
  const submitt = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const response = await signwithuser(state.emailaddress, state.password);

      const profiletype = auth.currentUser.displayName;
     
      const id = response.user.uid;
      const usersref = doc(db, "users", id);
      const profile = (await getDoc(usersref)).data();
     

      if (auth.currentUser.displayName === "personal") {
        const x = {
          firstname: profile.firstname,
          lastname: profile.lastname,
          email: profile.email,
          id: profile.uid,
          appliedJobs: profile.appliedjobs ? profile.appliedjobs : "",
          profileType: profiletype,
          picture: profile.profilepicture ? profile.profilepicture : "",
          resume: profile.resume ? profile.resume : "",
          description: profile.description ? profile.description : "",
          phone: profile.phone ? profile.phone : "",
          website: profile.website ? profile.website : "",
          twitter: profile.twitter ? profile.twitter : "",
          facebook: profile.facebook ? profile.facebook : "",
          instagram: profile.instagram ? profile.instagram : "",
        };
       
        if (verifemaill()) {
         
          ctx.onLogin(x);
          setTimeout(navigate("/Profile"), 3500);
        }
      } else if (auth.currentUser.displayName === "company") {
       
        const x = {
          companyname: profile.companyname,
          email: profile.email,
          id: auth.currentUser.uid,
          profileType: auth.currentUser.displayName,
          location: profile.location,
          picture: profile.profilepicture ? profile.profilepicture : "",
          phone: profile.phone ? profile.phone : "",
          website: profile.website ? profile.website : "",
          twitter: profile.twitter ? profile.twitter : "",
          facebook: profile.facebook ? profile.facebook : "",
          instagram: profile.instagram ? profile.instagram : "",
        };
        if (verifemaill()) {
         
          ctx.onLogin(x);

          setTimeout(navigate("/CompanyProfile"), 3500);
        }
      } else {
        const adminref = collection(db, "Admin");
        const q = query(adminref, where("uid", "==", auth.currentUser.uid));
        getDocs(q).then((res) => {
          if (res.docs[0].exists()) {
            const x = {
              uid: res.docs[0].data().uid,
              email: res.docs[0].data().email,
              profileType: "admin",
            };
            ctx.onLogin(x);
            navigate("/");
          }
        });
      }
    } catch (error) {
     
      if (
        error.code == "auth/invalid-email" ||
        error.code == "auth/invalid-password" ||
        error.code == "auth/wrong-password" ||
        error.code == "auth/user-not-found"
      ) {
        setError(
          <ErrorModal
            title="Failed to login"
            message="Wrong email or password."
            solution="Okay"
            onClick={errorClickHandler}
          />
        );
        setShowError(true);
      } else if (error.code == "auth/too-many-requests") {
        setError(
          <ErrorModal
            title="Failed to login"
            message="Too many failed requests, try again later."
            solution="Okay"
            onClick={errorClickHandler}
          />
        );
        setShowError(true);
      }
    }
  };
  const blurHandler = (e) => {
    const action = {
      type: "touch",
      value: e.target.name + "touched",
    };
    dispatch(action);
  };
  const searchHandler = (searchValue) => {
    navigate(`/?value=${searchValue}`);
  };
  return (
    <>
      <Navbar searchHandler={searchHandler} />
      {showError && error}
      <div className={styles.container}>
        <form action="" className=" form">
          <h3>Login</h3>
          <label className="text">
            Email Address<span className={styles.star}>*</span>
          </label>
          <br />
          <input
            type="text"
            placeholder=""
            className="text"
            name="emailaddress"
            onChange={onchange}
            onBlur={blurHandler}
            value={state.emailaddress}
          />
          {!inputsValid.emailaddress && state.emailaddresstouched && (
            <p className={styles.errorText}>Email must be valid!</p>
          )}
          <label className="text">
            Password<span className={styles.star}>*</span>
          </label>
          <br />
          <input
            type="password"
            placeholder=""
            className="text"
            name="password"
            onChange={onchange}
            onBlur={blurHandler}
            value={state.password}
          />
          {!inputsValid.password && state.passwordtouched && (
            <p className={styles.errorText}>Password must not be empty!</p>
          )}
          <div className={styles.button}>
            {" "}
            <button onClick={submitt}>Confirm</button>
            <p>
              Don't have an account? <Link to="/Register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
export default Login;
