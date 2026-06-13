import React, {Fragment,useEffect,useState} from "react";
import AuthContext from "../Store/auth-context";
import styles from "./Navbar.module.css";
import logo from "../images/logo-01.png";
import addUser from "../images/add-user.png"
import login from "../images/log-in.png";
import info from "../images/info.png";
import paperPlane from "../images/paper-plane.png";
import search from "../images/search.png";
import menu from "../images/menu.png";
import Applications from "../images/application.png";
import people from "../images/people.png";
import user from "../images/user.png";
import { Link, useLocation,useSearchParams } from "react-router-dom";
import { useContext } from "react";
import logout from "../images/logout.png";
import { db } from "../config/fire";
import { collection, onSnapshot } from "firebase/firestore";
const Navbar = (probs)=>{
    const [shownav,setShowNav]=useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [initialSearch, setinitialSearch] = useState((queryParams.get('value')) || '');
    const [page, setPage] = useState(window.location.pathname.replace(/^\/([^\/]*).*$/, '$1'));
    const[searchValue,setSearchValue]=useState(initialSearch);
    const[debouncedSearchValue,setDebouncedSearchValue]=useState(searchValue);
    const [searchParams,setSeaechPararms]=useSearchParams();
    const [countReports,setCountReports]=useState(0);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchValue(searchValue), 1000);
        return () => clearTimeout(timer);
    }, [searchValue])

    useEffect(() => {

       {if(probs.onSearchResult){ if(initialSearch.length >0 ) {setSeaechPararms({value:debouncedSearchValue});}}}
            {probs.onSearchResult && probs.onSearchResult(debouncedSearchValue);}
            {probs.setSearch && probs.setSearch(debouncedSearchValue);
            }
          
    }, [debouncedSearchValue]);

    const searchChangeHandler=(e)=>{
        setSearchValue(e.target.value);
        {probs.searchValue && probs.searchValue(e.target.value);}
    }
    const showHandler=()=>{
        setShowNav(!shownav);
    }
    useEffect(() => {
        const unsubscribe = onSnapshot(
          collection(db, "reports"),
          (snapshot) => {
            let count=0;
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added"&&change.doc.data().status!=="seen") {
               count++;
                if(page != "Reports"){
                setCountReports(count);}
              }
            });
          }
        );
        return () => unsubscribe();
       
      }, []);
  
const ctx=useContext(AuthContext);
    const active=shownav ? styles.active :'';
    const backdrop=shownav ? styles.backdrop:'';
    return(
        <header className={styles.navbar}>
                
                <div className={styles.secondwrapper}>
       
                <div className={backdrop} onClick={showHandler}/>
                <div className={styles.logo}><img src={logo} alt="Find job.com logo"/></div>

               <div className={styles.searchBar}> <div  onClick={()=>probs.searchHandler(searchValue)}><img src={search}/></div> <input type="text" value={searchValue} onChange={searchChangeHandler}></input></div>
                <button className={styles.showbar} onClick={showHandler}><img src={menu} alt="menu icon" className={styles.menuButton}/></button>
                {/* <div className={styles.break}></div> */}
             
            <ul className={`${active} ${styles.list}`}>
                <li><Link to="/" className={styles.listlogo}><img src={logo} alt="Find job.com logo"></img></Link></li>
               { !ctx.isLoggedIn && <li><Link to="/Register" className={styles.createAccount}> <img src={addUser} className={styles.icon} alt="add user icon"/> Create an account</Link></li>}
               { !ctx.isLoggedIn && <li><Link to="/Login"><img src={login} className={styles.icon} alt="log in icon"/> Login</Link></li>}
                {/* <li><Link to="/"> <img src={info} className={styles.icon} alt="info icon"/> About</Link></li> */}
               {ctx.isLoggedIn && ctx.profile.profileType === 'personal' && <li><Link to="/AppliedJobs"> <img src={Applications} className={styles.icon} alt="paper plane icon"/>Applied jobs</Link></li>}
                <li><Link to="/"> <img src={search} className={styles.icon} alt="search icon"/> Search jobs</Link></li> 
                {ctx.isLoggedIn && ctx.profile.profileType === 'company' && <li><Link to="/AppliedUsers"> <img src={people} className={styles.icon} alt="search icon"/>Jobs Applications</Link></li>}
               {ctx.isLoggedIn && ctx.profile.profileType === 'personal' && <li><Link to="/Profile"> <img src={user} className={styles.icon} alt="search icon"/> Profile</Link></li>}
                {ctx.isLoggedIn && ctx.profile.profileType === 'company' && <li><Link to="/CompanyProfile"> <img src={user} className={styles.icon} alt="search icon"/>Company Profile</Link></li>} 
                {ctx.isLoggedIn && ctx.profile.profileType === 'admin' && <li><Link to="/Reports"> <img src={search} className={styles.icon} alt="search icon"/>Reports{countReports>0?<span className={styles.reports}>{countReports}</span>:''}</Link></li>} 
               {ctx.isLoggedIn && <li><Link to="/Login" onClick={ctx.onLogout}><img src={logout} alt="logout icon" className={styles.icon} ></img>Logout </Link></li>}
            </ul>
       
            </div>
            </header>
 
    );
}
export default Navbar;