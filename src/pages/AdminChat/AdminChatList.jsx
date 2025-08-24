import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Badge, Typography } from "@mui/material";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const AdminChatList = ({ onSelectChat, selectedChatId }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("lastMessage.timestamp", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatsData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Typography variant="h6" mb={2}>
        Active Chats
      </Typography>
      <List>
        {chats.map(chat => {
          const unreadAdmin = chat.unreadCount?.admin || 0;
          return (
            <ListItem
              button
              key={chat.id}
              selected={chat.id === selectedChatId}
              onClick={() => onSelectChat(chat.id)}
            >
              <ListItemText
                primary={chat.userName.slice(0,6) || chat.id}
                secondary={chat.lastMessage?.text || "No messages yet"}
              />
              {unreadAdmin > 0 && <Badge color="error" badgeContent={unreadAdmin} />}
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default AdminChatList;
