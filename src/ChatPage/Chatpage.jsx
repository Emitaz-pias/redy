import React, { useState } from "react";
import { Grid, useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useChat } from "../../src/ChatContext/ChatContext.js";
import ChatWindow from "../cmponents/ChatWindow.jsx";
import UserChatList from "../cmponents/UserChatList.jsx";
import StaticUserChatList from "../cmponents/StaticUserChatList.jsx";
import {
  AppBar,
  Toolbar,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import MarkChatUnreadRoundedIcon from "@mui/icons-material/MarkChatUnreadRounded";
import ChatIcon from "@mui/icons-material/Chat";
import CallIcon from "@mui/icons-material/Call";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
const ChatPage = () => {
  const { isAdmin } = useChat();
  const [activeChat, setActiveChat] = useState(localStorage.getItem("chatWith") || null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSelectChat = (uid) => {
    localStorage.setItem("chatWith", uid);
    setActiveChat(uid);
  };

  const handleBack = () => {
    setActiveChat(null);
    localStorage.removeItem("chatWith");
  };

  return (
    <Box sx={{ p: 0, height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          boxShadow: "none",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
         

          <Box>
            <IconButton>
              <SearchRoundedIcon />
            </IconButton>
            <IconButton>
              <MarkChatUnreadRoundedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Grid container sx={{ height: "100%" }}>
          {/* Sidebar: Chat List */}
          {(!isMobile || !activeChat) && (
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                borderRight: { md: "1px solid #ddd" },
                height: "100%",
                overflowY: "auto",
              }}
            >
              {isAdmin ? (
                <UserChatList onSelectChat={handleSelectChat} activeChat={activeChat} />
              ) : (
                <StaticUserChatList onSelectChat={handleSelectChat} activeChat={activeChat} />
              )}
            </Grid>
          )}

          {/* Chat Window */}
          {(!isMobile || activeChat) && (
            <Grid item xs={12} md={8} sx={{ height: "100%" }}>
              <ChatWindow chatId={activeChat} onBack={handleBack} />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation sx={{ borderTop: "1px solid #ddd" }}>
        <BottomNavigationAction label="Chats" icon={<ChatIcon />} />
        <BottomNavigationAction label="Calls" icon={<CallIcon />} />
        <BottomNavigationAction label="Contacts" icon={<PeopleIcon />} />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Box>
  );
};

export default ChatPage;
