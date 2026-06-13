import React, { useContext, useRef, useState } from "react";
import JobList from "./JobList";
import Filter from "./Filter";
import filter from "../../images/filter.png";
import styles from "./JobSearch.module.css";
import { useEffect } from "react";
import Navbar from "../Navbar";
import AddJob from "./AddJob";
import { useLocation, useSearchParams } from "react-router-dom";
import AuthContext from "../../Store/auth-context";
import { FilterJobs } from "./FilterData";
import { auth } from "../../config/fire";
import { jobs_list, filtered_jobs_list } from "../../Store/jobs-list";
import Report from "../Report/Report";
import Footer from "../Footer/Footer";
import Loader from "../UI/Loader/Loader";
const JobSearch = (probs) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(false);
  const [reportedJob, setReportedJob] = useState();
  const [search, setSearch] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [initialSearch, setinitialSearch] = useState(
    queryParams.get("value") || ""
  );
  const [jobId, setJobId] = useState(queryParams.get("job") || "");
  const [searchParams, setSeaechPararms] = useSearchParams();
  const ctx = useContext(AuthContext);
  const [myfilters, setMyFilters] = useState({
    location_value: "Anywhere",
    salary_value: "any",
    job_type: "any",
  });
  const [initialJobs, setInitialJobs] = useState([]);

  useEffect(() => {

    jobs_list().then((res) => {
      if (ctx.profile.profileType === "personal") {
        res = res.filter((job) => {
          return !ctx.profile.appliedJobs.includes(job.id);
        });
      }

      setInitialJobs(res);
      if (initialSearch !== "") {
        
        FilterJobs(
          { type: "any", location: "Anywhere", salary: "any" },
          res,
          initialSearch
        ).then((res) => {
          setFilteredData(res);
        });
      } else if (jobId !== "") {
        setFilteredData(res.filter((job) => job.id === jobId));
        
      } else {
        setFilteredData(res);
      }
      setLoading(false);
    });
  }, [ctx.profile]);

  const [showAddJob, setShowAddJob] = useState(false);
  const clickHandler = () => {
    setShowFilter((prev) => {
      return !prev;
    });
  };

  const FilterAndSearch = (filters, search, jobId) => {
    const appliedfilter={type:filters.job_type,salary:filters.salary_value,location:filters.location_value}
    
    FilterJobs(appliedfilter, initialJobs, search, jobId).then((res) => {
      setFilteredData(res);
    });
  };
  const filterData = (filters) => {
    setMyFilters(filters);
    if(filters.job_type !== "any" || filters.salary_value !== "any" || filters.location_value !== "Anywhere"){
      FilterAndSearch(filters, search, "");
      setSeaechPararms("job","");
      setJobId("");
      return;
    }
  
    FilterAndSearch(filters, search, jobId);
  };

  const searchHandler = (searchValue) => {
    setSearch(searchValue);
    if(searchValue !== ""){
      FilterAndSearch(myfilters, searchValue, "");
      setSeaechPararms("job","");
      setJobId("");
      return;
    }
    FilterAndSearch(myfilters, searchValue, jobId);
  };

  const addJobHandler = () => {
    setShowAddJob((prev) => !prev);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
  } else {
    return (
      <>
        {report && (
          <Report className={styles.report} reportedJob={reportedJob} />
        )}
        {report && (
          <div className={styles.backdrop} onClick={() => setReport(false)} />
        )}
        <Navbar onSearchResult={searchHandler} setSearch={setSearch}></Navbar>
        <main className={styles.mainContainer}>
          <button className={styles.button} onClick={clickHandler}>
            <img src={filter} alt="filter icon" /> Filters
          </button>
          <button className={styles.addJobButton} onClick={addJobHandler}>
            +
          </button>
          <div className={styles.secondaryContainer}>
            <aside className={styles.aside}>
              <Filter
                className={`${styles.filter} ${
                  showFilter === true ? styles.active : ""
                }`}
                filter={filterData}
              ></Filter>
              {showAddJob && (
                <div className={styles.backdrop} onClick={addJobHandler} />
              )}
              {ctx.profile.profileType === "company" && (
                <AddJob
                  className={`${styles.addJobForm} ${
                    showAddJob ? styles.active : ""
                  }`}
                />
              )}
            </aside>
            {!loading ? (
              filteredData ? (
                filteredData.length > 0 ? (
                  <JobList
                    setReport={setReport}
                    setReportedJob={setReportedJob}
                    joblist={filteredData}
                  ></JobList>
                ) : (
                  ""
                )
              ) : (
                ""
              )
            ) : (
              ""
            )}
            {!loading ? (
              filteredData ? (
                filteredData.length === 0 ? (
                  <div className={styles.emptyJobs}>
                    <p>No jobs were found!</p>{" "}
                  </div>
                ) : (
                  ""
                )
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }
};
export default JobSearch;
