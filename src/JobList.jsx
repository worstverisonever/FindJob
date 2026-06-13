import './App.css';
import {getDocs,collection} from 'firebase/firestore';
import { useReducer,useEffect, useState} from 'react';
import {db}from './config/fire';
export function Addjob() {
    const [jobList,setJobList]=useState([]);
 const userinforef=collection(db,'userinfo');
useEffect(()=> {const getdata= async()=>{
const data=await getDocs(userinforef);
const fillterdata= data.docs.map((doc)=> ({...doc.data(),id:doc.id
}
));
setJobList(fillterdata);
};
getdata();
}
    ,[]);

}
