import React, { useState } from "react";
import { Grid, useMediaQuery, Box, IconButton, Badge } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useChat } from "../../src/ChatContext/ChatContext.js";
import ChatWindow from "../cmponents/ChatWindow.jsx";
import UserChatList from "../cmponents/UserChatList.jsx";
import StaticUserChatList from "../cmponents/StaticUserChatList.jsx";
import {
  AppBar,
  Toolbar,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import MarkChatUnreadRoundedIcon from '@mui/icons-material/MarkChatUnreadRounded';
import ChatIcon from "@mui/icons-material/Chat";
import CallIcon from "@mui/icons-material/Call";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { isAdmin } = useChat();
  const [activeChat, setActiveChat] = useState(localStorage.getItem("chatWith") || null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleSelectChat = (uid) => {
    localStorage.setItem("chatWith", uid);
    setActiveChat(uid);
  };

  const handleBack = () => {
    setActiveChat(null);
    localStorage.removeItem("chatWith");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f4f4f6" }}>
      {/* Top Navbar */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #f04343ff 0%, #b81818ff 80%)",
          color: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ fontWeight: 700, fontSize: "1.3rem" }}>Reddy Chat</Box>
          <Box>
            <IconButton sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
              <SearchRoundedIcon sx={{ color: "#fff" }} />
            </IconButton>
            <IconButton sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
              <Badge badgeContent={3} color="error">
                <MarkChatUnreadRoundedIcon sx={{ color: "#fff" }} />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Grid container sx={{ height: "100%" }}>
          {/* Sidebar */}
          {(!isMobile || !activeChat) && (
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                borderRight: { md: "1px solid #e0e0e0" },
                height: "100%",
                overflowY: "auto",
                bgcolor: "#fff",
                boxShadow: "inset 0 0 15px rgba(0,0,0,0.02)",
                borderRadius: { md: "8px 0 0 8px" },
              }}
            >
              {isAdmin ? (
                <UserChatList onSelectChat={handleSelectChat} activeChat={activeChat} />
              ) : (
                <StaticUserChatList onSelectChat={handleSelectChat} activeChat={activeChat} />
              )}
            </Grid>
          )}

          {/* Chat Window / Placeholder */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              height: "100%",
              borderRadius: { md: "0 8px 8px 0" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              transition: "all 0.3s ease",
              bgcolor: activeChat
                ? "#fff"
                : "linear-gradient(135deg, #f37e7eff 0%, #fd7a7aff 100%)",
            }}
          >
            {!activeChat ? (
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  px: 5,
                  py: 4,
                  borderRadius: 3,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.3rem",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                💬 Select a chat to start messaging
              </Box>
            ) : (
              <ChatWindow chatId={activeChat} onBack={handleBack} />
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Bottom Navigation */}
      <Paper elevation={3}>
        <BottomNavigation sx={{ borderTop: "1px solid #e0e0e0", bgcolor: "#fff" }}>
          <BottomNavigationAction sx={{ color: "#cc0000" }} label="Chats" icon={<ChatIcon />} />
          <BottomNavigationAction sx={{ color: "#cc0000" }} label="Calls" icon={<CallIcon />} />
          <BottomNavigationAction sx={{ color: "#cc0000" }} label="Contacts" icon={<PeopleIcon />} />
          <BottomNavigationAction sx={{ color: "#cc0000" }} label="Settings" icon={<SettingsIcon />} />
          <IconButton onClick={handleLogout} sx={{ ml: 1 }}>
            <LogoutIcon sx={{ color: "#cc0000" }} />
          </IconButton>
        </BottomNavigation>
      </Paper>

      {/* Floating animation */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </Box>
  );
};

export default ChatPage;
