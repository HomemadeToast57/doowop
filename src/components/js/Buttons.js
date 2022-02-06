import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const Buttons = ({ currentTrack, nextTrack, playPause }) => {
  const { saveTrackToLibrary } = useAuth();

  
  const handleSave = async () => {
    await saveTrackToLibrary(currentTrack.id);
    nextTrack();
  };

  return (
    <div>
      <button class="buttons" onClick={() => nextTrack()}>Next Track</button>
      <button class ="buttons" onClick={() => handleSave()}>Save Track</button>
    </div>
  );
};

export default Buttons;
