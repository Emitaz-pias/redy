// /src/context/ChatContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, "admins", u.uid);
        const docSnap = await getDoc(docRef);
        setIsAdmin(docSnap.exists()); // admin user check
      }
    });
    return () => unsub();
  }, []);

  return (
    <ChatContext.Provider value={{ user, isAdmin }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
