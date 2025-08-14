import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import rimage from '../images/rimage.svg';

const ReddyLogin = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPass, setFocusedPass] = useState(false);

  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setStep(2);
  };

  const handleLogin = async () => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/chat');
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      if (step === 1 && email) {
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

        {/* Email Step */}
        {step === 1 && (
          <>
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
                shrink: focusedEmail || !!email,
                sx: {
                  color: 'transparent',
                  '&.Mui-focused': { color: "red" },
                },
              }}
              InputProps={{
                notched: focusedEmail || !!email,
                sx: textFieldStyle(focusedEmail),
              }}
              sx={{ mt: 2, width: 300 }}
            />
            {error && <Typography variant="body2" color="error">{error}</Typography>}
            {email && (
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
