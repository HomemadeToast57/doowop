import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/js/Login";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [userProfileObj, setUserProfileObj] = useState({});
  const [seed, setSeed] = useState({});
  const [recommendations, setRecommendations] = useState({});
  const [changedHistory, setChangedHistory] = useState(false);
  const [boolArr, setBoolArr] = useState([]);

  const [tracksNotInHistory, setTracksNotInHistory] = useState({});
  const [tracksWithPreview, setTracksWithPreview] = useState({});

  const [currentTracks, setCurrentTracks] = useState({});
  const [finalTracks, setFinalTracks] = useState({});
  const [finalFinalTracks, setFinalFinalTracks] = useState([]);

  const numTopItems = 30;
  const maxArtists = 3;
  const maxTracks = 1;
  const maxGenres = 1;

  var client_id = "d8844014abe44653b437f74767a81bec";
  var redirect_uri = "https://doowop.netlify.app/";

  var scope =
    "user-read-private user-read-email user-top-read user-library-read user-library-modify";

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
          url:
            "https://api.spotify.com/v1/recommendations/?seed_artists=" +
            artists +
            "&seed_tracks=" +
            tracks +
            "&seed_genres=" +
            genres +
            "&limit=" +
            100,
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }).then(async (res) => {
          await setRecommendations(res.data);
          return;
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (Object.keys(seed).length > 0) {
      return getRecommendations(seed);
    }
  }, [seed]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const checkLibrary = (trackStrings) => {
      let arrayOfBool = [];
      try {
        trackStrings.forEach((trackString) => {
          // console.log("trackString", trackString);
          //use spotify api to check user's saved tracks
          axios({
            method: "get",
            url:
              "https://api.spotify.com/v1/me/tracks/contains?ids=" +
              trackString,
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          })
            .then(async (res) => {
              console.log("RECOMMENDING");
              console.log(res.data);
              arrayOfBool = [...arrayOfBool, ...res.data];
              console.log(arrayOfBool);
              await setBoolArr(arrayOfBool);
              return;
            })
            .catch((err) => {
              console.log(err);
            });
        });
      } catch (error) {
        console.log(error);
      }
    };

    const makeList = (tracks) => {
      console.log("IN MAKE LIST", tracks);
      console.log("TRACK ENTRIES", Object.entries(tracks));

      tracks = Object.entries(tracks);
      console.log(tracks);
      let numIndices = Math.ceil(tracks.length / 50);
      //   console.log(numIndices);
      let fiftyTracksArray = [];

      for (let i = 0; i < numIndices; i++) {
        let fiftyTracks = [];
        for (let j = 0; j < 50 && j < tracks.length; j++) {
          console.log("TRACKS TO ARRAY", tracks);
          fiftyTracks.push(tracks[i * 50 + j]);
        }
        console.log(fiftyTracks);
        fiftyTracksArray.push(fiftyTracks);
      }

      fiftyTracksArray.forEach((fifty) => {
        let setOfFiftyString = "";
        fifty.forEach((track) => {
          if (track) {
            setOfFiftyString += track[0] + ",";
          }
        });
        fiftyTracksArray[fiftyTracksArray.indexOf(fifty)] = setOfFiftyString;
      });

      console.log("FIFTY TRACKS ARRAY", fiftyTracksArray);

      return checkLibrary(fiftyTracksArray);
    };

    // 2) remove songs user has seen from recommendations

    const removeOldTracks = async (tracks) => {
      //check every track against tracks in localStorage history string by converting to JSON and avoiding duplicates
      let history = getHistoryJSON();
      let newTracks = {};

      console.log("HISTORRY", history);
      if (history) {
        //make sure id is not in the history
        for (var track in tracks) {
          if (!(track in history)) {
            newTracks[track] = tracks[track];
          }
        }
        console.log("REMOVED OLD TRACKS", newTracks);

        await setFinalTracks(newTracks);
        return makeList(newTracks);
      }
      await setFinalTracks(tracks);
      return makeList(tracks);
    };

    // 1) get songs user has seen

    const removeSongsWithoutPreview = (tracks) => {
      console.log("REMOVE PREVIEW INITIAL", tracks);
      // console.log("removeSongsWithoutPreview", Object.keys(tracks).length);
      let songsWithPreview = {};

      //if song has preview url, add to new object
      tracks.forEach((track) => {
        if (track.preview_url) {
          songsWithPreview[track.id] = track;
        }
      });
      console.log(songsWithPreview);

      return removeOldTracks(songsWithPreview);
    };

    const getHistoryJSON = () => {
      return JSON.parse(localStorage.getItem("history"));
    };

    if (Object.keys(recommendations).length > 0) {
      removeSongsWithoutPreview(recommendations.tracks);
    }
  }, [recommendations]);

  useEffect(() => {
    console.log("HEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHEHHHEHEHEH");
    const removeLikedSongs = () => {
      console.log("IN REMOVE LIKED SONGS");
      let tracksObjToArray = Object.entries(finalTracks);
      console.log("TRACKS OBJ TO ARRAY", tracksObjToArray);
      console.log("removeLikedSongs", boolArr, finalTracks.length);
      //if a track is true, in arrayOfBool, remove it from tracksObj
      boolArr.forEach((bool) => {
        console.log(bool, "BOOL");
        if (bool) {
          console.log("TRACKSSSS", tracksObjToArray);
          tracksObjToArray.splice(tracksObjToArray.indexOf(bool), 1);
          console.log("removed");
        }
      });

      console.log(finalTracks, boolArr);
      console.log("????", tracksObjToArray);
      return tracksObjToArray;
    };
    return () => setFinalFinalTracks(removeLikedSongs(boolArr, finalTracks));
  }, [finalTracks, boolArr]);

  useEffect(() => {
    if (finalFinalTracks.length > 0) {
      console.log("SUCCESS", finalFinalTracks);
    }
  }, [finalFinalTracks]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");
    setUserProfileObj({});
    setRecommendations({});
    setSeed({});
    navigate("/login");
  };

  const saveTrackToLibrary = (trackID) => {
    const accessToken = localStorage.getItem("accessToken");
    axios({
      method: "put",
      url: "https://api.spotify.com/v1/me/tracks?ids=" + trackID,
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const value = {
    loginSpotify,
    getReturnParamsFromSpotifyAuth,
    logout,
    finalFinalTracks,
    saveTrackToLibrary,
  };
  return (
    <AuthContext.Provider value={value}>
      {localStorage.getItem("accessToken") ? (finalFinalTracks.length > 0 ? (<div>{children}</div>) : <h1>Loading...</h1>) : <Login />}
    </AuthContext.Provider>
  );
}
