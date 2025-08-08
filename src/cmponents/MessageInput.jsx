import { Box, TextField, IconButton } from "@mui/material";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
const MessageInput = ({ chatId, senderId }) => {
  const [text, setText] = useState("");

 const handleSend = async () => {
  if (!text.trim()) return;

  const messageData = {
    text,
    senderId,
    createdAt: serverTimestamp(),
  };

  // 1️⃣ Send message to subcollection
  await addDoc(collection(db, "chats", chatId, "messages"), messageData);

  // 2️⃣ Update parent chat doc (main point!)
  await setDoc(
    doc(db, "chats", chatId),
    {
      lastMessage: {
        text,
        timestamp: serverTimestamp(),
        senderId,
      },
      unreadCount: {
        // jodi admin pathai, user er unread barabe
        // jodi user pathai, admin er unread barabe
        admin: senderId === "admin" ? 0 : increment(1),
        [senderId]: 0
      }
    },
    { merge: true }
  );

  setText("");
};
  return (
    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Write message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      /> 
     
      <IconButton color="primary" onClick={handleSend}>
        {'>>'}
      </IconButton>
    </Box>
  );
};

export default MessageInput;
