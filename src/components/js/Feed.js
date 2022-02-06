import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Track from "./Track";
import Buttons from "./Buttons";

const Feed = () => {
  const [trackIndex, setTrackIndex] = useState(0);
  const { logout, finalFinalTracks } = useAuth();

  const [currentTrack, setCurrentTrack] = useState(
    finalFinalTracks[trackIndex][1]
  );

  const nextTrack = () => {
    if (trackIndex < finalFinalTracks.length - 1) {
      setTrackIndex(trackIndex + 1);
      setCurrentTrack(finalFinalTracks[trackIndex][1]);
    }
  };

  const playPause = () => {
    document.getElementById("audio").play();
  };

  return (
    <div>
      <button class="logout" onClick={logout}>Logout</button>
      <Track currentTrack={currentTrack} />
      <Buttons
        currentTrack={currentTrack}
        playPause={playPause}
        nextTrack={nextTrack}
      />
      <audio 
        controls
        volume="0.5"
        id="audio"
        src={currentTrack.preview_url}
        autoPlay
      ></audio>
    </div>
  );
};

export default Feed;
