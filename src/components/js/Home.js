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
      <button onClick={popupHash}>Alert Access Token</button>
      <button onClick={() => {
        setCount(count + 1);
      }}>Add Number</button>
      <button onClick={fetchTopItems}>Fetch Top Items</button>
      <button onClick={logout}>logout</button>
      <h1>{count}</h1>
    </div>
  );
};

export default Home;
