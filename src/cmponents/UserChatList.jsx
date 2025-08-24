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
import { useChat } from "../ChatContext/ChatContext.js"; // for current user info

const UserChatList = ({ onSelectChat, activeChat }) => {
  const [users, setUsers] = useState([]);
  const { user } = useChat(); // logged-in admin info

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
      const userList = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          // Only show chats meant for this admin or general service-user messages
          if (data.userId && data.userId !== user.uid && data.userId !== "service-user") return null;

          return {
            id: doc.id,
            lastMessage: data?.lastMessage?.text || "No messages yet",
            updatedAt: data?.lastMessage?.timestamp
              ? data.lastMessage.timestamp.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            originalUser: data.userId || doc.id, // preserve original sender
          };
        })
        .filter(Boolean); // remove nulls

      // Sort by lastMessage timestamp descending
      userList.sort((a, b) => {
        const ta = a.updatedAt ? new Date("1970/01/01 " + a.updatedAt) : 0;
        const tb = b.updatedAt ? new Date("1970/01/01 " + b.updatedAt) : 0;
        return tb - ta;
      });

      setUsers(userList);
    });

    return () => unsubscribe();
  }, [user.uid]);

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
              <Avatar>{user.originalUser[0]?.toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography fontWeight="bold">{user.originalUser}</Typography>}
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
