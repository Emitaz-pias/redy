import { Box, TextField, IconButton } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useState } from "react";
import { collection, addDoc, serverTimestamp, doc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

const MessageInput = ({ chatId, senderId }) => {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return;

    const message = {
      text,
      senderId,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), message);
      await setDoc(
        doc(db, "chats", chatId),
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
        <SendRoundedIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
