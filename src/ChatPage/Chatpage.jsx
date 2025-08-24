import React, { useState } from "react";
import {
  Grid,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import UserChatList from "../cmponents/UserChatList";
import ChatWindow from "../cmponents/ChatWindow";

import MarkChatUnreadRoundedIcon from "@mui/icons-material/MarkChatUnreadRounded";
import ChatIcon from "@mui/icons-material/Chat";
import CallIcon from "@mui/icons-material/Call";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LogoutIcon from "@mui/icons-material/Logout";

import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const STATIC_USERS = [
  { id: "user1", name: "User One" },
  { id: "user2", name: "User Two" },
];

const colors = {
  background: "#fafafa",
  surface: "#ffffff",
  primary: "#d32f2f",
  text: "#212121",
  icon: "#616161",
};

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [navValue, setNavValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
  };

  const handleBackToList = () => {
    setActiveChat(null);
  };
  
  const currentChatId = activeChat || STATIC_USERS[0].id;
console.log(activeChat)
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: colors.primary,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1200px",
            width: "100%",
            mx: "auto",
            px: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: "#fff",
              fontSize: { xs: "1rem", sm: "1.25rem" },
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            Reddy Chat
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
            <IconButton sx={{ color: "#fff" }}>
              <SearchRoundedIcon />
            </IconButton>
            <IconButton sx={{ color: "#fff" }}>
              <MarkChatUnreadRoundedIcon />
            </IconButton>
            <IconButton onClick={handleLogout} sx={{ color: "#fff" }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Grid container sx={{ flex: 1, minHeight: 0 }}>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: { xs: activeChat ? "none" : "block", md: "block" },
            borderRight: { md: "1px solid #e0e0e0" },
            height: "100%",
            overflowY: "auto",
            backgroundColor: colors.surface,
          }}
        >
          <UserChatList
            staticUsers={STATIC_USERS}
            onSelectChat={handleSelectChat}
            activeChat={activeChat}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: { xs: activeChat ? "block" : "none", md: "block" },
            height: "100%",
            flexDirection: "column",
            backgroundColor: "#f5f5f5",
          }}
        >
          <ChatWindow
            chatId={currentChatId}
            userId={currentChatId}
            onBack={handleBackToList}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: { xs: "block", md: "block" },
          borderTop: "1px solid #ddd",
        }}
      >
        <BottomNavigation
          value={navValue}
          onChange={(e, newValue) => {
            setNavValue(newValue);
            if (newValue !== 0) {
              setOpenDialog(true);
            }
          }}
          showLabels
          sx={{
            backgroundColor: colors.surface,
            "& .MuiBottomNavigationAction-root": {
              color: colors.icon,
            },
            "& .Mui-selected": {
              color: colors.primary,
            },
          }}
        >
          <BottomNavigationAction label="Chats" icon={<ChatIcon />} />
          <BottomNavigationAction label="Calls" icon={<CallIcon />} />
          <BottomNavigationAction label="Contacts" icon={<PeopleIcon />} />
          <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Service Not Available!</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#f00" }}>
            Ei service gula ei account er jonno projojjo na.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatPage;