// import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Badge, Box } from "@mui/material";
// import { useChat } from "../context/ChatContext";

// const staticUsers = [
//   { id: "authenticationBot", lastMessage: "Hello!", updatedAt: "12:24 PM" },
//   { id: "CRM Bot", lastMessage: "Welcome!", updatedAt: "10 Dec" },
// ];

// const StaticUserChatList = ({ onSelectChat, activeChat }) => {
//   const { user } = useChat();
//   const users = [...staticUsers];
//   if (user) users.unshift({ id: user.uid, lastMessage: "You", updatedAt: "" });

//   return (
//     <>
//       <Typography variant="h6" sx={{ px: 2, py: 1.5, fontWeight: 700 }}>All Chats</Typography>
//       <List sx={{ p: 0 }}>
//         {users.map((u) => {
//           const isActive = activeChat === u.id;
//           return (
//             <ListItem key={u.id} onClick={() => onSelectChat(u.id)} sx={{
//               cursor: "pointer",
//               borderBottom: "1px solid #f0f0f0",
//               bgcolor: isActive ? "action.selected" : "transparent",
//               "&:hover": { backgroundColor: "action.hover" }
//             }}>
//               <ListItemAvatar>
//                 <Badge color="success" variant={u.id === "authenticationBot" || u.id === "CRM Bot" ? "dot" : "standard"}>
//                   <Avatar>{u.id[0]?.toUpperCase()}</Avatar>
//                 </Badge>
//               </ListItemAvatar>
//               <ListItemText
//                 primary={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Typography fontWeight={700}>{u.id}</Typography></Box>}
//                 secondary={<Typography noWrap sx={{ color: "text.secondary" }}>{u.lastMessage}</Typography>}
//               />
//               <Typography variant="caption" sx={{ color: "text.secondary", ml: 1 }}>{u.updatedAt}</Typography>
//             </ListItem>
//           );
//         })}
//       </List>
//     </>
//   );
// };

// export default StaticUserChatList;
