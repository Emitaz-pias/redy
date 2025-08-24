// App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReddyLogin from './ReddyLogin/ReddyLogin.jsx';
import AdminChat from './pages/AdminChat/AdminChat.jsx'; 
import { ChatProvider } from "../src/ChatContext/ChatContext.jsx";
import ChatPage from '../src/ChatPage/Chatpage.jsx'
import AdminDashboard from './pages/AdminChat/AdminDashboard.jsx';

const App = () => {
  
  return (
    <ChatProvider>
    <Routes>
      <Route path="/" element={<ReddyLogin />} />
     <Route path="/chat" element={<ChatPage/>} />
    <Route path="/admin" element={<AdminChat />} />
    <Route path="/admin/chat" element={<AdminDashboard />} />
    </Routes>
    </ChatProvider>
  );
};

export default App;
