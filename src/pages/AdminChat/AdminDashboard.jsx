import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import AdminChatList from "./AdminChatList";
import AdminChatWindow from "./AdminChatWindow";

const AdminDashboard = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <AdminChatList selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
        </Grid>
        <Grid item xs={8}>
          {selectedChatId ? (
            <AdminChatWindow chatId={selectedChatId} />
          ) : (
            <Box sx={{ p: 4, color: "gray", textAlign: "center" }}>
              Select a chat to start messaging
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
