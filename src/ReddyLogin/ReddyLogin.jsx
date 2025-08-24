import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';  // Make sure your auth import path is correct
import rimage from '../images/rimage.svg';

const ReddyLogin = () => {
  const [focused, setFocused] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Changed from 'code' to 'email' and 'password' states for Firebase Auth:
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPass, setFocusedPass] = useState(false);

  const handleLogin = async () => {
  setError("");
  try {
    let loginEmail = email;

    // jodi user sudhu username type kore (emtiazpias383), tahole @gmail.com auto add
    if (!loginEmail.includes("@")) {
      loginEmail = loginEmail + "@gmail.com";
    }

    await signInWithEmailAndPassword(auth, loginEmail, password);
    navigate("/chat");
  } catch (err) {
    setError("Invalid username or password.");
  }
};


  const handleEnter = (e) => {
    if (e.key === 'Enter' && email && password) {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#1E1E1E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          component="img"
          src={rimage}
          alt="Reddy Logo"
          sx={{ width: 100, height: 100 }}
        />

        <Typography variant="h5" fontWeight={600}>
          Login to Reddy
        </Typography>
        <Typography variant="body2" color="gray">
          Welcome to the Web Application
        </Typography>

        {/* Email Input (styled exactly like your previous TextField) */}
        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleEnter}
          onFocus={() => setFocusedEmail(true)}
          onBlur={(e) => {
            if (!e.target.value) setFocusedEmail(false);
          }}
          InputLabelProps={{
            shrink: focusedEmail,
            sx: {
              color: 'transparent',
              '&.Mui-focused': {
                color: "red",
              },
            },
          }}
          InputProps={{
            notched: focusedEmail,
            sx: {
              backgroundColor: "#1E1E1E",
              borderRadius: "10px",
              color: "white",
              input: { color: "white" },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: "gray",
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: "gray",
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: "#f00",
              },
            },
          }}
          sx={{ mt: 2, width: 300 }}
        />

        {/* Password Input (styled like your previous TextField) */}
        <TextField
          fullWidth
          variant="outlined"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleEnter}
          onFocus={() => setFocusedPass(true)}
          onBlur={(e) => {
            if (!e.target.value) setFocusedPass(false);
          }}
          InputLabelProps={{
            shrink: focusedPass,
            sx: {
              color: 'transparent',
              '&.Mui-focused': {
                color: "red",
              },
            },
          }}
          InputProps={{
            notched: focusedPass,
            sx: {
              backgroundColor: "#1E1E1E",
              borderRadius: "10px",
              color: "white",
              input: { color: "white" },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: "gray",
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: "gray",
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: "#f00",
              },
            },
          }}
          sx={{ width: 300 }}
        />

        {error && (
          <Typography variant="body2" color="error" mt={1}>
            {error}
          </Typography>
        )}

        {(email && password) && (
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              backgroundColor: "#f00",
              width: 300,
              height: 50,
              fontWeight: 'bold',
              fontSize: 16,
              mt: 1,
              '&:hover': {
                backgroundColor: "#d50000",
              }
            }}
          >
            NEXT
          </Button>
        )}

        <Typography variant="body2" mt={4}>
          Need Help?{' '}
          <Box component="span" sx={{ color: "#f44336", cursor: "pointer" }}>
            Reddy FAQ
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default ReddyLogin;
