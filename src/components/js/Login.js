import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const { loginSpotify } = useAuth();

  return (
    <div>
      <button class="login" onClick={loginSpotify}>Login With Spotify</button>
    </div>
  );
};

export default Login;
