import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useChat } from "../../src/ChatContext/ChatContext.js";
import ChatWindow from "../cmponents/ChatWindow.jsx";
import UserChatList from "../cmponents/UserChatList.jsx";

const ChatPage = () => {
  const { isAdmin } = useChat();

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {isAdmin && (
          <Grid item xs={12} md={4}>
            <UserChatList />
          </Grid>
        )}
        <Grid item xs={12} md={isAdmin ? 8 : 12}>
          <ChatWindow />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatPage;
