import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Toolbar,
  Stack,
} from "@mui/material";
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
import MessageInput from "./MessageInput";
import IconButton from "@mui/material/IconButton";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const ChatWindow = ({ chatId, onBack }) => {
  const { user } = useChat();
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState(null);
  const messagesEndRef = useRef(null);
  const uid = user?.uid;
  const isBotChat = chatId === "аутентификацияBot" || chatId === "CRM-бот";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setChatData(null);
      return;
    }
    
    if (isBotChat) {
      setMessages([]);
      setChatData({
        userName: chatId
      });
      return;
    }

    const chatDocRef = doc(db, "chats", `chat_${chatId}_admin`);

    const unsubscribeChat = onSnapshot(chatDocRef, (docSnap) => {
        if (docSnap.exists()) {
            setChatData(docSnap.data());
        }
    });

    const messagesQuery = query(
      collection(chatDocRef, "messages"),
      orderBy("timestamp")
    );
    const unsubscribeMessages = onSnapshot(messagesQuery, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => {
      unsubscribeChat();
      unsubscribeMessages();
    };
  }, [chatId, isBotChat]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isBotChat) return;

    try {
      const chatDocRef = doc(db, "chats", `chat_${chatId}_admin`);
      await setDoc(
        chatDocRef,
        {
          lastMessage: {
            text: text,
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
        text: text,
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
  
  const chatPartnerName = user?.email?.slice(0, 6) || chatData?.userName || 'Loading...';

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Toolbar variant="dense" sx={{ borderBottom: "1px solid #ddd" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="back"
          onClick={onBack}
          sx={{
            mr: 2,
            display: { xs: "inline-flex", md: "none" },
            color: "grey",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {isBotChat ? chatId : 'Service Admin'}
        </Typography>
      </Toolbar>

      {/* মেসেজ ডিসপ্লে এরিয়া */}
      <Paper
        elevation={0}
        sx={{ 
          flex: 1, 
          overflowY: "auto", 
          p: 2, 
          backgroundColor: "inherit",
          // নতুন লজিক: যদি কোনো মেসেজ না থাকে এবং এটি একটি বট চ্যাট হয়
          ...((messages.length === 0 && isBotChat) && { 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center"
          })
        }}
      >
        {messages.length === 0 && isBotChat ? (
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              borderRadius: "20px",
              bgcolor: "background.paper",
              color: "text.primary",
              maxWidth: "70%",
              wordWrap: "break-word",
              textAlign: "center"
            }}
          >
            <Typography variant="body1">
              {chatId === "CRM-бот" ? "Hello, I am the CRM bot. How can I help you?" : "Welcome! Please use this chat for authentication issues."}
            </Typography>
          </Paper>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent: msg.sender === uid ? "flex-end" : "flex-start",
                mb: 1.5,
              }}
            >
              <Stack
                direction="column"
                alignItems={msg.sender === uid ? "flex-end" : "flex-start"}
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
                <Typography variant="caption" sx={{ mt: 0.5, color: "text.secondary" }}>
                  {formatTimestamp(msg.timestamp)}
                </Typography>
              </Stack>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* মেসেজ ইনপুট এরিয়া */}
      <Box sx={{ p: 2, backgroundColor: "background.paper" }}>
        {isBotChat ? (
          <Typography
            sx={{ color: "text.secondary", textAlign: "center", py: 1 }}
          >
            You cannot reply to this bot with your current account permissions.
          </Typography>
        ) : (
          <MessageInput onSend={handleSendMessage} />
        )}
      </Box>
    </Box>
  );
};

export default ChatWindow;