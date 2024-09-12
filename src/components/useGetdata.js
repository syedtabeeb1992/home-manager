import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase-config";

const useGetdata = () => {
  const [householditems, sethouseholditems] = useState([]);

  const collectionRef = collection(db, "householditems");
  const getdata = async () => {
    const data = await getDocs(collectionRef);
    sethouseholditems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getdata();
  }, []);

  return householditems;
};

export default useGetdata;
