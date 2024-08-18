import React from 'react';

function VideoComponent({ videoURL }) {
    return <video className="w-full aspect-video" src={videoURL} controls />;
}

export default VideoComponent;
