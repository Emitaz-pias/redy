import { useEffect, useState } from "react";
import { List, ListItem, ListItemAvatar, Avatar,Box,ListItemText, Typography } from "@mui/material";
import { useChat } from "../ChatContext/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const getTimeAgo = (date) => {
  if (!date) return "";
  
  let timestamp;
  if (date.toDate) {
    timestamp = date.toDate();
  } else {
    timestamp = date;
  }
  
  const seconds = Math.floor((new Date() - timestamp) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return "just now";
};

const UserChatList = ({ onSelectChat, activeChat }) => {
  const { user } = useChat();
  const [users, setUsers] = useState([
    { id: "аутентификацияBot", lastMessage: "Добро пожаловать!", updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), isBot: true },
    { id: "CRM-бот", lastMessage: "привет!", updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000), isBot: true }
  ]);

  useEffect(() => {
    if (!user) return;
    
    setUsers(prev => {
      const exists = prev.find(u => u.id === user.uid);
      if (!exists) {
        return [{ id: user.uid, lastMessage: "", updatedAt: new Date(), isBot: false }, ...prev];
      }
      return prev;
    });

    const userChatDocRef = doc(db, "chats", `chat_${user.uid}_admin`);
    const unsubscribe = onSnapshot(userChatDocRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().lastMessage) {
        const { text, timestamp } = docSnap.data().lastMessage;
        
        setUsers(prev => prev.map(u => {
          if (u.id === user.uid) {
            return {
              ...u,
              lastMessage: text,
              updatedAt: timestamp ? timestamp.toDate() : u.updatedAt
            };
          }
          return u;
        }));
      }
    });

    return () => unsubscribe();
  }, [user]);

  // মূল পরিবর্তনটি এই return স্টেটমেন্টের মধ্যে করা হয়েছে
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ p: 1 , }}>
        All Chats
      </Typography>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List>
          {users.map(u => {
            const isActive = activeChat === u.id;
            return (
              <ListItem
                key={u.id}
                button
                selected={isActive}
                onClick={() => onSelectChat(u.id)}
              >
                <ListItemAvatar sx={{ position: "relative" }}>
                  <Avatar
                    sx={{
                      backgroundColor: u.isBot
                        ? "#d32f2f"
                        : "grey",
                    }}
                  >
                    {u.id[0].toUpperCase()}
                  </Avatar>
                  
                  {!u.isBot && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 25,
                        right: 10,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: "green",
                        border: "2px solid white",
                      }}
                    />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={u.isBot ? u.id : "Service Admin" || u.id}
                  secondary={u.lastMessage || "No messages yet"}
                />
                <Typography variant="caption">{getTimeAgo(u.updatedAt)}</Typography>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default UserChatList;