import { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useChat } from "../ChatContext/ChatContext.js";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TITLES = {
  "service-user": "Service User",
  "authenticationBot": "Authentication Bot",
  "CRM Bot": "CRM Bot",
};

const ChatWindow = ({ chatId, onBack }) => {
  const { user } = useChat();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const uid = user?.uid || "guest";

  useEffect(() => {
    if (chatId !== "service-user") {
      setMessages([]);
      return;
    }
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatId]);

  if (!chatId) {
    return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="text.secondary">Select a chat to start messaging</Typography>
      </Box>
    );
  }
// new icon button added
  const isServiceChat = chatId === "service-user";

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center", // center on large screens
        bgcolor: "#f0f2f5",
      }}
    >
      <Box
        sx={{
          width: { xs: "100vw", md: "100vw" }, // full width on mobile, fixed width on desktop
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f6f7fb",
          boxShadow: { md: "0 0 10px rgba(0,0,0,0.05)" }, // subtle shadow
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#fff",
          }}
        >
          {onBack && (
            <IconButton onClick={onBack} sx={{ display: { xs: "inline-flex", md: "none" } }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          
          <Avatar sx={{ width: 32, height: 32 }}>{TITLES[chatId]?.[0] || "C"}</Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {TITLES[chatId] || "Chat"}
          </Typography>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            py: 2,
            background: "linear-gradient(to bottom right, #b3c3f2ff, #e8ebf2)",
          }}
        >
          {isServiceChat ? (
            messages.length ? (
              messages.map((m) => <MessageBubble key={m.id} msg={m} self={m.senderId === uid} />)
            ) : (
              <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
                Say hi 👋 — no messages yet
              </Typography>
            )
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
              No messages yet
            </Typography>
          )}
          <div ref={bottomRef} />
        </Box>

        {/* Input */}
        {isServiceChat && (
          <Box
            sx={{
              borderTop: "1px solid #ddd",
              p: 1,
              bgcolor: "#fff",
              position: "sticky",
              bottom: 0,
            }}
          >
            <MessageInput chatId={chatId} senderId={uid} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatWindow;
