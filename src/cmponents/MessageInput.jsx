import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import { collection, addDoc, serverTimestamp, doc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useChat } from "../ChatContext/ChatContext.js"; // current user info

const MessageInput = ({ chatId, senderId }) => {
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);
  const { user } = useChat(); // logged-in user info

  const handleSend = async () => {
    if (!text.trim()) {
      setTouched(true);
      return;
    }

    const message = {
      text: text.trim(),
      senderId,
      createdAt: serverTimestamp(),
    };

    try {
      // 1️⃣ Add message to current chat
      await addDoc(collection(db, "chats", chatId, "messages"), message);

      // 2️⃣ Update lastMessage in current chat
      await setDoc(
        doc(db, "chats", chatId),
        {
          lastMessage: {
            text: text.trim(),
            timestamp: serverTimestamp(),
            senderId,
          },
        },
        { merge: true }
      );

      // 3️⃣ If service-user sent message → create/update admin's separate chat
      if (senderId === "service-user") {
        const adminChatId = `admin-${user.uid || chatId}`; // use unique user id
        await setDoc(
          doc(db, "chats", adminChatId),
          {
            lastMessage: {
              text: text.trim(),
              timestamp: serverTimestamp(),
              senderId: chatId, // store original sender
            },
            unreadCount: {
              admin: increment(1),
              [chatId]: 0,
            },
            userId: chatId, // store original service user id
          },
          { merge: true }
        );

        await addDoc(collection(db, "chats", adminChatId, "messages"), {
          ...message,
          senderId: chatId,
        });
      }

      setText("");
      setTouched(false);
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
        error={touched && !text.trim()}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => setTouched(true)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      {text.trim() && (
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default MessageInput;
