import React, { useMemo, useState, useContext } from "react";
import styles from "./JobList.module.css";
import JobCard from "./JobCard";
import Pagination from "./Pagination";
import Button from "../UI/Button/Button";
import locationimg from "../../images/location.png";
import close from "../../images/close.png";
import logo from "../../images/logo-01.png";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../Store/auth-context";
import ErrorModal from "../UI/ErrorModal";
import { useNavigate } from "react-router-dom";
import {
  doc,
  addDoc,
  collection,
  where,
  query,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../config/fire";
const JobList = (probs) => {
  const [loading, setLoading] = useState(false);
  const [showSelectedJob, setShowSelectedJob] = useState(false);
  const [postsPerPage] = useState(3);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [currentPage, setCurrentPage] = useState(
    parseInt(queryParams.get("page")) || 1
  );
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentJobs = probs.joblist.slice(indexOfFirstPost, indexOfLastPost);
  const [selectedJob, setSelectedJob] = useState(currentJobs[0]);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedJob(
      probs.joblist.slice(
        pageNumber * postsPerPage - postsPerPage,
        pageNumber * postsPerPage
      )[0]
    );
  };
  const [error, setError] = useState("");
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();

  const clickHandler = (job) => {
    setSelectedJob(job);
    setShowSelectedJob(true);
   
  };

  const onCloseHandler = () => {
    setShowSelectedJob(false);
  };

  function errorClickHandler(message) {
    setError("");
    if (message === "paginate") {
      navigate("/login");
    }
  }

  const applyHandler = async (id) => {
    setShowSelectedJob(false);
    if (ctx.isLoggedIn && ctx.profile.profileType == "personal") {
     
      ctx.setProfile((prev) => {
        let x = {
          ...prev,
          appliedJobs: prev.appliedJobs ? [...prev.appliedJobs, id] : [id],
        };
        const userRef = doc(db, "users", auth.currentUser.uid);
        setDoc(
          userRef,
          { appliedjobs: prev.appliedJobs ? [...prev.appliedJobs, id] : [id] },
          { merge: true }
        );
        return x;
      });

      const docRef = doc(db, "Joblist", id);
      const subcollectionRef = collection(docRef, "appliedjobs");
      const q = query(subcollectionRef, where("uid", "==", ctx.profile.id));
      try {
        const appliedJob = await getDocs(q);
        const filterdata = appliedJob.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        if (filterdata.length >= 1) {
         
          return;
        }
      } catch {}
      // Add a new document to the subcollection
      addDoc(subcollectionRef, {
        uid: ctx.profile.id,
      })
        .then((docRef) => {
         
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    } else if (ctx.isLoggedIn && ctx.profile.profileType !== "personal") {
      setError(
        <ErrorModal
          title="Failed to apply"
          message="Profile type not appropriate."
          solution="Okay"
          onClick={() => errorClickHandler("")}
        />
      );
    } else if (!ctx.isLoggedIn) {
      setError(
        <ErrorModal
          title="Failed to apply"
          message="You must login inorder to be able to apply."
          solution="Login"
          onClick={() => errorClickHandler("paginate")}
        />
      );
    }
  };

  const reportHandler = (job) => {
    probs.setReport(true);
    probs.setReportedJob(job);
    setShowSelectedJob(false);
  };

  return (
    <>
      {error}
      <main className={styles.container}>
        <ul className={styles.joblist}>
          {currentJobs.map((job) => {
            return (
              <JobCard
                title={job.title}
                companyname={job.companyname}
                companyId={job.uid}
                id={job.id}
                key={job.id}
                customOnClick={() => clickHandler(job)}
                selectedJob={selectedJob}
                companylocation={job.companylocation}
                salary1={job.salary1}
                salary2={job.salary2}
                type={job.type}
                location={job.location}
                applyHandler={() => applyHandler(job.id)}
              ></JobCard>
            );
          })}

          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={probs.joblist.length}
            paginate={paginate}
          ></Pagination>
        </ul>

        <aside
          className={`${styles.jobInfo} ${
            showSelectedJob === true ? styles.active : ""
          }`}
        >
          {showSelectedJob && (
            <div className={styles.header}>
              <img src={logo} alt="fingjob.com logo" />
              <button onClick={onCloseHandler} className={styles.closeButton}>
                <img src={close} alt="close icon" />
              </button>
            </div>
          )}
          <div className={styles.mainDetails}>
            <h3>{selectedJob.title}</h3>
            <Link to={`/CompanyPreviewProfile/?user=${selectedJob.uid}`}>
              {selectedJob.companyname}
            </Link>
            <p>
              <img src={locationimg} alt="location icon" />{" "}
              {selectedJob.companylocation}
            </p>
            <Button
              className={styles.button}
              onClick={() => applyHandler(selectedJob.id)}
              disabled={
                ctx.isLoggedIn && ctx.profile.profileType == "personal"
                  ? ctx.profile.appliedJobs.includes(selectedJob.id)
                  : false
              }
            >
              {ctx.isLoggedIn && ctx.profile.profileType == "personal"
                ? ctx.profile.appliedJobs.includes(selectedJob.id)
                  ? "Applied"
                  : "Apply"
                : "Apply"}
            </Button>
          </div>
          <div className={styles.Description}>
            <div className={styles.jobDetails}>
              <h3>Job details</h3>
              <p>Salary</p>
              <span>
                {selectedJob.salary1 + "-" + selectedJob.salary2 + "$"} per
                month.
              </span>
            </div>
            <div className={styles.jobType}>
              <h3>Job Type</h3>
              <ul>
                {selectedJob.type === "FullTime" && <li> Full-Time </li>}
                {selectedJob.type === "PartTime" && <li> Part-Time </li>}
                {selectedJob.location === "Remote" && <li> Remote</li>}
              </ul>
            </div>
            <h3>Full Description</h3>
            <p>{selectedJob.description}</p>
            {ctx.isLoggedIn
              ? ctx.profile.id !== selectedJob.uid && (
                  <Button
                    onClick={() => reportHandler(selectedJob)}
                    className={styles.reportButton}
                  >
                    Report Job
                  </Button>
                )
              : ""}
          </div>
        </aside>
      </main>
    </>
  );
};
export default JobList;
