import {getDownloadURL, uploadBytesResumable,ref, listAll  } from "firebase/storage";
import {storage } from "../config/fire";
export function listallpic (folder){
    const listRef = ref(storage, folder);
    // Find all the prefixes and items.
    listAll(listRef)
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
        });
        res.items.forEach((itemRef) => {
          // All the items under listRef.
          itemRef.getDownloadURL.then((url)=>{

          })
        });
      }).catch((error) => {
        // Uh-oh, an error occurred!
      });
    
}