import { useEffect, useState } from "react";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from "@mui/material";
import { useChat } from "../ChatContext/ChatContext";

const UserChatList = ({ onSelectChat, activeChat }) => {
  const { user } = useChat();
  const [users, setUsers] = useState([
    { id: "аутентификацияBot", lastMessage: "Добро пожаловать!", updatedAt: "12:24 PM", isBot: true },
    { id: "CRM-бот", lastMessage: "привет!", updatedAt: "10 Dec", isBot: true }
  ]);

  // logged in user add
  useEffect(() => {
    if (user) {
      setUsers(prev => {
        const exists = prev.find(u => u.id === user.uid);
        if (!exists) return [{ id: user.uid, lastMessage: "", updatedAt: "", isBot: false }, ...prev];
        return prev;
      });
    }
  }, [user]);

  return (
    <>
      <Typography variant="h6" sx={{ p: 1 }}>All Chats</Typography>
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
              <ListItemAvatar><Avatar>{u.id[0].toUpperCase()}</Avatar></ListItemAvatar>
              <ListItemText
                primary={u.isBot ? u.id :'Service Admin' || u.id}
                secondary={u.lastMessage || "No messages yet"}
              />
              <Typography variant="caption">{u.updatedAt}</Typography>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default UserChatList;
