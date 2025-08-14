import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";

const UserChatList = ({ onSelectChat, activeChat }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
      const userList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          lastMessage: data?.lastMessage?.text || "No messages yet",
          updatedAt: data?.lastMessage?.timestamp
            ? data.lastMessage.timestamp.toDate().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
        };
      });
      setUsers(userList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Typography variant="h6" sx={{ padding: "10px" }}>All Chats</Typography>
      <List sx={{ padding: 0 }}>
        {users.map((user) => (
          <ListItem
            key={user.id}
            button
            selected={user.id === activeChat}
            onClick={() => onSelectChat(user.id)}
            sx={{
              borderBottom: "1px solid #f0f0f0",
              backgroundColor: user.id === activeChat ? "#e0f7fa" : "transparent",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <ListItemAvatar>
              <Avatar>{user.id[0]?.toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography fontWeight="bold">{user.id}</Typography>}
              secondary={<Typography noWrap sx={{ color: "gray" }}>{user.lastMessage}</Typography>}
            />
            <Typography variant="caption" sx={{ color: "gray" }}>
              {user.updatedAt}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default UserChatList;
