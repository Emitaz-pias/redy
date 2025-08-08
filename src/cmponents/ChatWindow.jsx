import { useEffect, useState, useRef } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useChat } from "../../src/ChatContext/ChatContext.js";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { Box } from "@mui/material";

const ChatWindow = () => {
  const { user, isAdmin } = useChat();
  const [messages, setMessages] = useState([]);
  const containerRef = useRef();
const uid = user?.uid;
const chatWith = isAdmin ? localStorage.getItem("chatWith") : `user_${uid}`;
const chatId = chatWith;

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box justifyContent='center' sx={{overflow:'none', backgroundColor:'lightgray',borderRadius: 2,width:{xs:'90vw',sm:'90vw',md:'50vw'},padding:'0.5em' }}>
      {messages.map((msg) => (
        <MessageBubble  key={msg.id} msg={msg} self={msg.senderId === uid} />
      ))}
      <div ref={containerRef} />
      {(!isAdmin || chatWith) && (
        <MessageInput chatId={chatId} senderId={uid} />
      )}
    </Box>
  );
};

export default ChatWindow;
