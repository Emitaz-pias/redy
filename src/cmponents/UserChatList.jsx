import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const UserChatList = () => {
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "chats"));
      const userList = snapshot.docs.map((doc) => doc.id);
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const handleClick = (uid) => {
    localStorage.setItem("chatWith", uid);
    setActive(uid);
  };

  return (
    <>
      <Typography variant="h6">Users</Typography>
      <List>
        {users.map((uid) => (
          <ListItem
            button
            key={uid}
            selected={uid === active}
            onClick={() => handleClick(uid)}
          >
            <ListItemText primary={uid} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default UserChatList;
