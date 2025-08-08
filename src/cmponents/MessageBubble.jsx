import { Box, Typography } from "@mui/material";

const MessageBubble = ({ msg, self }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: self ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Box
        sx={{
          background: self ? "#1976d2" : "#eee",
          color: self ? "#fff" : "#000",
          px: 2,
          py: 1,
          borderRadius: 2,
          maxWidth: "70%",
        }}
      >
        <Typography variant="body2">{msg.text}</Typography>
        <Typography variant="caption" sx={{ float: "right" }}>
          {new Date(msg.createdAt?.toDate()).toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
