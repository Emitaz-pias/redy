import React, { useEffect, useState, useRef } from "react";
import { Box, List, ListItem, TextField, Button } from "@mui/material";
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

const AdminChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const containerRef = useRef();

  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      sender: "admin",
      timestamp: serverTimestamp()
    });

    const chatDocRef = doc(db, "chats", chatId);
    await updateDoc(chatDocRef, {
      lastMessage: { text, timestamp: serverTimestamp(), sender: "admin" },
      [`unreadCount.${chatId}`]: 0
    });

    setText("");
  };

  return (
    <Box sx={{ height: "70vh", overflowY: "auto", p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <List>
        {messages.map(msg => (
          <ListItem key={msg.id} sx={{ justifyContent: msg.sender === "admin" ? "flex-end" : "flex-start" }}>
            <Box sx={{
              bgcolor: msg.sender === "admin" ? "primary.main" : "grey.300",
              color: msg.sender === "admin" ? "white" : "black",
              p: 1,
              borderRadius: 2,
              maxWidth: "70%"
            }}>
              {msg.text}
            </Box>
          </ListItem>
        ))}
        <div ref={containerRef} />
      </List>
      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField fullWidth placeholder="Type message..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} />
        <Button variant="contained" onClick={handleSend} sx={{ ml: 1 }}>Send</Button>
      </Box>
    </Box>
  );
};

export default AdminChatWindow;
