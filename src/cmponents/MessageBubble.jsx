import { Box, Paper, Typography } from "@mui/material";

const timeOf = (ts) => {
  try {
    const d = ts?.toDate ? ts.toDate() : (typeof ts?.seconds === "number" ? new Date(ts.seconds * 1000) : null);
    return d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  } catch {
    return "";
  }
};

const MessageBubble = ({ msg, self }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: self ? "flex-end" : "flex-start",
        px: 1,
        mb: 0.8,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          maxWidth: "75%",
          px: 2,
          py: 1.2,
          borderRadius: 2,
          bgcolor: self ? "#1976d2" : "#f1f1f1",
          color: self ? "#fff" : "#000",
          borderTopLeftRadius: self ? 16 : 4,
          borderTopRightRadius: self ? 4 : 16,
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {msg.text}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            opacity: 0.7,
            display: "block",
            mt: 0.5,
            textAlign: "right",
            fontSize: "0.7rem",
          }}
        >
          {timeOf(msg.createdAt)}
        </Typography>
      </Paper>
    </Box>
  );
};

export default MessageBubble;
