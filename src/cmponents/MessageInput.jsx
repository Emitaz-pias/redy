import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import { collection, addDoc, serverTimestamp, doc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

const MessageInput = ({ chatId, senderId }) => {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return;

    const message = {
      text,
      senderId,  // sender's uid
      createdAt: serverTimestamp(),
    };

    try {
      // Save message under service-user/messages collection
      await addDoc(collection(db, "chats", "service-user", "messages"), message);

      // Update last message and unread counts in chat doc
      await setDoc(
        doc(db, "chats", "service-user"),
        {
          lastMessage: {
            text,
            timestamp: serverTimestamp(),
            senderId,
          },
          unreadCount: {
            admin: senderId === "admin" ? 0 : increment(1),
            [senderId]: 0,
          },
        },
        { merge: true }
      );

      setText("");
    } catch (error) {
      console.error("Message send error:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Write a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
