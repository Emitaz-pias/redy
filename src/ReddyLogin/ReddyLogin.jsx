import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import rimage from '../images/rimage.svg';

const ReddyLogin = () => {
  const navigate = useNavigate();

  // Define a fixed domain for constructing the email from the username
  let emailDomain = "@yourapp.com";
  if (window.location.hostname === "redycl.netlify.app") {
    emailDomain = "@reddycl.com";
  }

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [focusedUsername, setFocusedUsername] = useState(false);
  const [focusedPass, setFocusedPass] = useState(false);

  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }
    setStep(2);
  };

  const handleLogin = async () => {
    setError('');
    try {
      let email;
      // Check if the username already contains an "@"
      if (username.includes('@')) {
        // Use the username as is if it's already an email
        email = username;
      } else {
        // Append the domain if it's just a username
        email = `${username}${emailDomain}`;
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/chat');
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      if (step === 1 && username) {
        handleNext();
      } else if (step === 2 && password) {
        handleLogin();
      }
    }
  };

  const textFieldStyle = (focused) => ({
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
  });

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
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        {/* Logo */}
        <Box component="img" src={rimage} alt="Reddy Logo" sx={{ width: 100, height: 100 }} />

        <Typography variant="h5" fontWeight={600}>
          Login to Reddy
        </Typography>
        <Typography variant="body2" color="gray">
          Welcome to the Web Application
        </Typography>

        {/* Username Step */}
        {step === 1 && (
          <>
            <TextField
              fullWidth
              variant="outlined"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleEnter}
              onFocus={() => setFocusedUsername(true)}
              onBlur={(e) => {
                if (!e.target.value) setFocusedUsername(false);
              }}
              InputLabelProps={{
                shrink: focusedUsername || !!username,
                sx: {
                  color: 'transparent',
                  '&.Mui-focused': { color: "red" },
                },
              }}
              InputProps={{
                notched: focusedUsername || !!username,
                sx: textFieldStyle(focusedUsername),
              }}
              sx={{ mt: 2, width: 300 }}
            />
            {error && <Typography variant="body2" color="error">{error}</Typography>}
            {username && (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  backgroundColor: "#f00",
                  width: 300,
                  height: 50,
                  fontWeight: 'bold',
                  fontSize: 16,
                  mt: 1,
                  '&:hover': { backgroundColor: "#d50000" }
                }}
              >
                NEXT
              </Button>
            )}
          </>
        )}

        {/* Password Step */}
        {step === 2 && (
          <>
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
                shrink: focusedPass || !!password,
                sx: {
                  color: 'transparent',
                  '&.Mui-focused': { color: "red" },
                },
              }}
              InputProps={{
                notched: focusedPass || !!password,
                sx: textFieldStyle(focusedPass),
              }}
              sx={{ width: 300 }}
            />
            {error && <Typography variant="body2" color="error">{error}</Typography>}
            {password && (
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
                  '&:hover': { backgroundColor: "#d50000" }
                }}
              >
                LOGIN
              </Button>
            )}
          </>
        )}

        {/* Footer */}
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
