import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Badge,
  Box,
} from "@mui/material";

const staticUsers = [
  { id: "authenticationBot", lastMessage: "937229", updatedAt: "12:24 PM" },
  { id: "Service User", role: "admin",lastMessage: "Your account has been logged into New s...", updatedAt: "Yesterday" },
  { id: "CRM Bot", lastMessage: "Привет, Kamal Uddin! Рады приветств...", updatedAt: "10 Dec" },
];

const StaticUserChatList = ({ onSelectChat, activeChat }) => {
  return (
    <>
      <Typography variant="h6" sx={{ px: 2, py: 1.5, fontWeight: 700 }}>
        All Chats
      </Typography>
      <List sx={{ p: 0 }}>
        {staticUsers.map((user) => {
          const chatId = user.id === "Service User" ? "service-user" : user.id;
          const isActive = activeChat === chatId;
          return (
            <ListItem
              key={user.id}
              onClick={() => onSelectChat(chatId)}
              sx={{
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                bgcolor: isActive ? "action.selected" : "transparent",
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <ListItemAvatar>
                <Badge
                  color="success"
                  variant={user.id === "Service User" ? "dot" : "standard"}
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <Avatar>{user.id[0]?.toUpperCase()}</Avatar>
                </Badge>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography fontWeight={700}>{user.id}</Typography>
                  </Box>
                }
                secondary={
                  <Typography noWrap sx={{ color: "text.secondary" }}>
                    {user.lastMessage}
                  </Typography>
                }
              />
              <Typography variant="caption" sx={{ color: "text.secondary", ml: 1 }}>
                {user.updatedAt}
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default StaticUserChatList;
