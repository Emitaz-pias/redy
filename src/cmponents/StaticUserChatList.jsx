import { useEffect, useState } from "react";
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
import { useChat } from "../ChatContext/ChatContext.js"; // get current user
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const StaticUserChatList = ({ onSelectChat, activeChat }) => {
  const { user } = useChat(); // logged-in user info
  const [dynamicUser, setDynamicUser] = useState({
    id: "User",
    lastMessage: "No messages yet",
    updatedAt: "",
  });

  // fetch username from DB if available
  useEffect(() => {
    const fetchUsername = async () => {
      if (!user?.uid) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
        setDynamicUser({
  id: user.email ? user.email.slice(0, 6) : "User",  // email er first 6 char
  lastMessage: data.lastMessage || "No messages yet",
  updatedAt: data.lastMessageTimestamp
    ? data.lastMessageTimestamp
        .toDate()
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "",
});

        } else {
          // fallback if no user doc
        setDynamicUser({
  id: user.email ? user.email.slice(0, 6) : "User",
  lastMessage: "No messages yet",
  updatedAt: "",
});

        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUsername();
  }, [user]);

  // static bots
  const staticUsers = [
    { id: "authenticationBot", lastMessage: "937229", updatedAt: "12:24 PM" },
    { id: "CRM Bot", lastMessage: "Привет, Kamal Uddin! Рады приветств...", updatedAt: "10 Dec" },
  ];

  return (
    <>
      <Typography variant="h6" sx={{ px: 2, py: 1.5, fontWeight: 700 }}>
        All Chats
      </Typography>
      <List sx={{ p: 0 }}>
        {/* dynamic user (previously service-user) */}
        <ListItem
          key={dynamicUser.id}
          onClick={() => onSelectChat(dynamicUser.id)}
          sx={{
            cursor: "pointer",
            borderBottom: "1px solid #f0f0f0",
            bgcolor: activeChat === dynamicUser.id ? "action.selected" : "transparent",
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <ListItemAvatar>
            <Badge
              color="success"
              variant="dot"
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Avatar sx={{backgroundColor:'olive'}} >{dynamicUser.id[0]?.toUpperCase()}</Avatar>
            </Badge>
          </ListItemAvatar>

          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography  fontWeight={700}>{dynamicUser.id}</Typography>
              </Box>
            }
            secondary={
              <Typography noWrap sx={{ color: "text.secondary" }}>
                {dynamicUser.lastMessage}
              </Typography>
            }
          />
          <Typography variant="caption" sx={{ color: "text.secondary", ml: 1 }}>
            {dynamicUser.updatedAt}
          </Typography>
        </ListItem>

        {/* static bots */}
        {staticUsers.map((user) => {
          const isActive = activeChat === user.id;
          return (
            <ListItem
              key={user.id}
              onClick={() => onSelectChat(user.id)}
              sx={{
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                bgcolor: isActive ? "action.selected" : "transparent",
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <ListItemAvatar >
                <Avatar sx={{backgroundColor:'red'}} >{user.id[0]?.toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography fontWeight={700}>{user.id}</Typography>}
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
