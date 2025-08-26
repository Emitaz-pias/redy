import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleAttachFile = () => {
    console.log("Attach file button clicked");
  };
  
  const handleOpenEmoji = () => {
    console.log("Emoji button clicked");
  };

  const handleVoiceNote = () => {
    console.log("Voice note button clicked");
  };

  return (
    <Box display="flex" alignItems="center" p={1} borderTop="1px solid #ccc">
      <IconButton sx={{color:'#d32f2f'}} onClick={handleOpenEmoji}>
        <EmojiEmotionsIcon />
      </IconButton>
      <IconButton sx={{color:'#d32f2f'}} onClick={handleAttachFile}>
        <AttachFileIcon />
      </IconButton>

      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
       sx={{
    mx: 1,
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#d32f2f",
      },
      "&:hover fieldset": {
        borderColor: "#d32f2f",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#d32f2f",
    },
  }}
      />
      <IconButton sx={{color:'#d32f2f'}} onClick={handleVoiceNote}>
        <MicIcon />
      </IconButton>
      <IconButton sx={{color:'#d32f2f'}} onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;