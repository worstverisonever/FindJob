import React,{useContext,useState} from "react";
import styles from './CompanyProfile.module.css';
import AuthContext from "../../Store/auth-context";
import CompanyEditProfile from "./CompanyEditProfile";
import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";
import profile from "../../images/profilePicutre.jpg";
import { auth } from "../../config/fire";
import Footer from "../../Components/Footer/Footer";

const CompanyProfile=()=>{
    const [rightContainer,setRightContainer]=useState(<CompanyEditProfile />)
const [header,setHeader]=useState({title:'Edit Profile',desc:'Edit your profile info.'})
const ctx=useContext(AuthContext);
const navigate=useNavigate();
    const clickHandler=(probs)=>{
        switch(probs){
            case 'preview-profile':
                navigate(`/CompanyPreviewProfile/?user=${auth.currentUser.uid}`);
                break;
            case 'edit-profile':
                setRightContainer(<CompanyEditProfile />)
                setHeader({title:'Edit Profile',desc:'Edit your profile info.'})
                break;
                case 'privacy':
                setRightContainer(<CompanyEditProfile />)
                setHeader({title:'Edit Profile',desc:'Edit your profile info.'})
                break;
            default:
                break;
        }
    }
    const searchHandler=(searchValue)=>{
        navigate(`/?value=${searchValue}`);
       }
    return(
    <>
    <Navbar searchHandler={searchHandler}></Navbar>
    <main className={styles.mainCoontainer}>
        <div className={styles.secondaryContainer}>
            <aside className={styles.sideContainer}>
                <div>
                <img src={ctx.profile.picture? ctx.profile.picture:profile} alt="profile"></img>
                <h3>{ctx.profile.name}</h3>
                </div>
                <ul>
                    <li onClick={()=>clickHandler('preview-profile')} className={`${header.title==='Privacy' ? styles.activeLink :''}`}>PreviewProfile</li>
                    <li onClick={()=>clickHandler('edit-profile')} className={`${header.title==='Edit Profile' ? styles.activeLink :''}`}>Edit Profile</li>
                </ul>
            </aside>
            <div className={styles.rightContainer}>
                <div className={styles.header}>
                    <h3>{header.title}</h3>
                    <p>{header.desc}</p>
                </div>
                <div className={styles.body}>
                 {rightContainer}
                </div>
            </div>
        </div>
    </main>
    <Footer/>
    </>);
}
export default CompanyProfile;