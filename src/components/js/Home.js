import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Home = () => {
    const { loginSpotify, getReturnParamsFromSpotifyAuth, fetchProfile, fetchTopItems, logout } = useAuth();

    const [count, setCount] = useState(0);


   useEffect(() => {
       console.log("Hello!");
   }, []);

   useEffect(() => {
       console.log(count)
   }, [count]);


     

  const popupHash = () => {
    const res = getReturnParamsFromSpotifyAuth(window.location.hash);
    const { access_token } = res;
    window.alert(access_token);
  };

  return (
    <div>
      <button onClick={logout}>logout</button>
    </div>
  );
};

export default Home;
