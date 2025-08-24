import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Toolbar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useChat } from "../ChatContext/ChatContext";

const ChatWindow = ({ chatId, onBack }) => {
  const { user } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const uid = user?.uid;

  const isBotChat = chatId === "аутентификацияBot" || chatId === "CRM-бот";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId || isBotChat) {
      setMessages([]);
      return;
    }

    const messagesQuery = query(
      collection(db, "chats", `chat_${chatId}_admin`, "messages"),
      orderBy("timestamp")
    );
console.log(chatId)
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId, isBotChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isBotChat) return;

    const messageText = newMessage;
    setNewMessage("");

    try {
      const chatDocRef = doc(db, "chats", `chat_${chatId}_admin`);
      await setDoc(
        chatDocRef,
        {
          lastMessage: {
            text: messageText,
            timestamp: serverTimestamp(),
            sender: user.email,
          },
          userId: uid,
          userName: user.email || uid,
          unreadCount: { admin: 1 },
        },
        { merge: true }
      );

      await addDoc(collection(chatDocRef, "messages"), {
        text: messageText,
        sender: uid,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!chatId) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "text.secondary",
        }}
      >
        <Typography variant="h6">Select a chat to start messaging</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Back button and header */}
      <Toolbar variant="dense" sx={{ borderBottom: "1px solid #ddd" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="back"
          onClick={onBack}
          sx={{
            mr: 2,
            display: { xs: "inline-flex", md: "none" },
            color: "#d32f2f",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
  {isBotChat ? chatId : user?.email?.slice(0, 6)}
</Typography>
      </Toolbar>

      {/* Message Display Area */}
      <Paper
        elevation={0}
        sx={{ flex: 1, overflowY: "auto", p: 2, backgroundColor: "inherit" }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.sender === uid ? "flex-end" : "flex-start",
              mb: 1.5,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                borderRadius:
                  msg.sender === uid
                    ? "20px 20px 5px 20px"
                    : "20px 20px 20px 5px",
                bgcolor:
                  msg.sender === uid ? "#d32f2f" : "background.paper",
                color: msg.sender === uid ? "primary.contrastText" : "text.primary",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Message Input Area */}
      <Box sx={{ p: 2, backgroundColor: "background.paper" }}>
        {isBotChat ? (
          <Typography
            sx={{ color: "text.secondary", textAlign: "center", py: 1 }}
          >
            You cannot reply to this bot.
          </Typography>
        ) : (
          <Box component="form" onSubmit={handleSendMessage} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
            <IconButton type="submit" sx={{color:'#d32f2f'}} aria-label="send message">
              <SendIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatWindow;