import axios from "axios";
import { Obj } from "prelude-ls";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [userProfileObj, setUserProfileObj] = useState({});
  const [seed, setSeed] = useState({});
  const [recommendations, setRecommendations] = useState({});

  const numTopItems = 30;
  const maxArtists = 3;
  const maxTracks = 1;
  const maxGenres = 1;

  var client_id = "d8844014abe44653b437f74767a81bec";
  var redirect_uri = "http://localhost:3000/";

  var scope = "user-read-private user-read-email user-top-read";

  var url = "https://accounts.spotify.com/authorize";
  url += "?response_type=token";
  url += "&client_id=" + encodeURIComponent(client_id);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(redirect_uri);

  useEffect(() => {
    const hash = getReturnParamsFromSpotifyAuth(
      window.location.hash
    ).access_token;
    if (hash) {
      localStorage.setItem("accessToken", hash);
      navigate("/");
    }
  }, [navigate]);

  const getReturnParamsFromSpotifyAuth = (hash) => {
    var stringAfterHashtag = hash.substring(1);
    var params = stringAfterHashtag.split("&");

    const paramsSplit = params.reduce((acc, param) => {
      const [key, value] = param.split("=");
      acc[key] = value;
      return acc;
    }, {});

    return paramsSplit;
  };

  //load spotify profile in URL
  const loginSpotify = () => {
    try {
      window.location = url;
      console.log(window.location.hash);
      console.log("Print HERE");
    } catch (error) {
      console.log(error);
    }
  };

  //automatically fetch profile
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchProfile = async () => {
      console.log(localStorage.getItem("accessToken"));
      try {
        await axios({
          method: "get",
          url: "https://api.spotify.com/v1/me",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }).then(async (res) => {
          console.log(res);
          localStorage.setItem("userProfile", res);
          await setUserProfileObj(res);
          return res.data;
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (accessToken) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchTopItems = async () => {
      // https://api.spotify.com/v1/me/top/artists
      // https://api.spotify.com/v1/me/top/tracks
      // https://api.spotify.com/v1/me/top/genres
      try {
        const artistsRes = await axios({
          method: "get",
          url: "https://api.spotify.com/v1/me/top/artists",
          limit: numTopItems,
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }).then(async (res) => {
          console.log("LENGTH", res.data.items[0].genres.length);
          return res.data;
        });

        console.log("ARTISTS", artistsRes);

        const tracksRes = await axios({
          method: "get",
          url: "https://api.spotify.com/v1/me/top/tracks",
          limit: numTopItems,
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }).then(async (res) => {
          return res.data;
        });

        console.log("TRACKS", tracksRes);

        return parseTopItems(artistsRes, tracksRes);
      } catch (error) {
        console.log(error);
      }
    };

    if (Object.keys(userProfileObj).length > 0) {
    return fetchTopItems();
    } else {
       return console.log("No profile");
    }
  }, [userProfileObj]);

  const parseTopItems = async (artists, tracks) => {
    let numGenres = 0;
    let numArtists = 0;
    let numTracks = 0;

    let artistsArr = [];
    let tracksArr = [];
    let genresArr = [];

    console.log("passed in", artists, tracks);

    // parse top tracks, artists, genres

    //get 5 random artists
    artists.items.forEach((artist) => {
      if (numArtists < maxArtists) {
        //check if artist is already in array
        if (!artistsArr.includes(artist.id)) {
          artistsArr.push(artist.id);
          numArtists++;
        }
      }
    });

    //get 5 random tracks
    tracks.items.forEach((track) => {
      if (numTracks < maxTracks) {
        //check if track is already in array
        if (!tracksArr.includes(track.id)) {
          tracksArr.push(track.id);
          numTracks++;
        }
      }
    });

    //get ONLY  top genres from artists and add to genres array (no duplicates)
    artists.items.forEach((artist) => {
      artist.genres.forEach((genre) => {
        if (numGenres < maxGenres) {
          //check if genre is already in array
          if (!genresArr.includes(genre)) {
            genresArr.push(genre);
            numGenres++;
          }
        }
      });
    });

    //convert each seed array to a string (comma separated) and set seed State to the object with the seed strings
    return await setSeed({
      artists: artistsArr.join(","),
      tracks: tracksArr.join(","),
      genres: genresArr.join(","),
    });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const getRecommendations = async (seed) => {
      const { artists, tracks, genres } = seed;
      console.log("SEED", seed);
      try {
        await axios({
          method: "get",
          url: "https://api.spotify.com/v1/recommendations/?seed_artists=" + artists + "&seed_tracks=" + tracks + "&seed_genres=" + genres,
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        //   limit: 20,
        //   seed_artists: artists,
        //   seed_genres: genres,
        //   seed_tracks: tracks,
        }).then(async (res) => {
          console.log(res.data);
          await setRecommendations(res.data);
          return;
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (Object.keys(seed).length > 0) {
      getRecommendations(seed);
    }
  }, [seed]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");
    setUserProfileObj({});
    setRecommendations({});
    setSeed({});
    navigate("/login");
  };

  const value = {
    loginSpotify,
    getReturnParamsFromSpotifyAuth,
    logout,
    recommendations,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
