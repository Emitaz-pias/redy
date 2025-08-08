// src/pages/ChatPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, List, ListItem, Paper
} from "@mui/material";
import {
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp
} from "firebase/firestore";
import { db } from "../../../src/firebase";

const ChatPage = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const chatId = `user_${userId}`;

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      sender: "user",
      text: newMsg,
      timestamp: serverTimestamp()
    });
    setNewMsg("");
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5">Private Chat with Admin</Typography>
      <Paper sx={{ maxHeight: 400, overflowY: "auto", mt: 2, p: 2 }}>
        <List>
          {messages.map((msg) => (
            <ListItem key={msg.id} sx={{ justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
              <Box
                sx={{
                  bgcolor: msg.sender === "user" ? "primary.main" : "grey.300",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: "70%",
                }}
              >
                {msg.text}
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Box mt={2} display="flex" gap={1}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Write a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </Box>
    </Box>
  );
};

export default ChatPage;
