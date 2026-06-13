import { useState } from "react";
import { ref, getDownloadURL, uploadBytesResumable,listAll } from "firebase/storage";
import { auth,storage } from "../config/fire";
import { useEffect } from "react";
import { useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";

export function Uploadfile(probs) {
  const [pdf,setpdf]=useState(false);
  const urlref=useRef('');
  const [progress, setProgress] = useState(0);
  const formHandler = (file) => {
    console.log(file);
    uploadFiles(file);
  };

  onAuthStateChanged(auth, (data)=>{
    if (auth.currentUser===null) return;
console.log(1);
const listRef =ref(storage,`file/${auth.currentUser.uid}/picture`);


// Find all the prefixes and items.
listAll(listRef)
  .then((res) => {
    res.prefixes.forEach((folderRef) => {
      // All the prefixes under listRef.
      // You may call listAll() recursively on them.
    });
    res.items.forEach((itemRef) => {
      console.log(itemRef);
      // All the items under listRef.
      getDownloadURL(itemRef).then((url)=>{
        console.log(url);
      })
    });
  }).catch((error) => {
    // Uh-oh, an error occurred!
  });
})
  const uploadFiles = (file) => {
    //
    if (!file) return;
    const sotrageRef = ref(storage, 
      `file/${auth.currentUser.uid}/picture/${file.name}`);
    const uploadTask = uploadBytesResumable(sotrageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
      },
      (error) => console.log(error),
      () => { if(urlref!==''){
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setpdf(true);
           probs.setUploading(false);
           probs.setUploaded(true);
          console.log("File available at", downloadURL);
        });
      }
      }
    );
  };
console.log(urlref);
console.log(auth.currentUser);
  return (
    <div className="App">
      <form onSubmit={formHandler}>
        <input type="file" className="input" />
        <button type="submit">Upload</button>
      </form>
      <hr />
      <h2>Uploading done </h2>
    </div>
  );
}




