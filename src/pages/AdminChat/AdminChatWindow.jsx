import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  List,
  ListItem,
  Typography,
  TextField,
  Button
} from "@mui/material";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase";

const AdminChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const containerRef = useRef();

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
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

    const msgRef = collection(db, "chats", chatId, "messages");

    await addDoc(msgRef, {
      text,
      senderId: "admin",
      createdAt: serverTimestamp()
    });

    // update last message and reset unread count for admin
    const chatDocRef = doc(db, "chats", chatId);
    await updateDoc(chatDocRef, {
      lastMessage: {
        text,
        timestamp: serverTimestamp(),
        senderId: "admin"
      },
      [`unreadCount.${chatId}`]: 0 // reset unread count for this user
    });

    setText("");
  };

  return (
    <Box sx={{ height: "70vh", overflowY: "auto", p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <List>
        {messages.map(msg => (
          <ListItem
            key={msg.id}
            sx={{ justifyContent: msg.senderId === "admin" ? "flex-end" : "flex-start" }}
          >
            <Box
              sx={{
                bgcolor: msg.senderId === "admin" ? "primary.main" : "grey.300",
                color: msg.senderId === "admin" ? "white" : "black",
                p: 1,
                borderRadius: 2,
                maxWidth: "70%"
              }}
            >
              {msg.text}
            </Box>
          </ListItem>
        ))}
        <div ref={containerRef} />
      </List>

      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <Button onClick={handleSend} disabled={!text.trim()} variant="contained" sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default AdminChatWindow;
