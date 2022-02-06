import React from "react";

const Track = ({ currentTrack }) => {
  return (
    <div>
      <h1>{currentTrack.name}</h1>
      {currentTrack.album.artists.map((artist) => {
        return <h2>{artist.name}</h2>;
      })}
      <img src={currentTrack.album.images[1].url} alt="album art"></img>
    </div>
  );
};

export default Track;
