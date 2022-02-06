import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import Login from "./Login";
import Feed from "./Feed";
import "../css/style.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
