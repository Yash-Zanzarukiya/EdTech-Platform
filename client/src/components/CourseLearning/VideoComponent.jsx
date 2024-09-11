import React from 'react';

export default function VideoComponent({ videoURL }) {
    return videoURL?.length === 11 ? (
        <iframe
            src={`https://www.youtube.com/embed/${videoURL}?autoplay=1&controls=0&modestbranding=1&showinfo=0&rel=0`}
            className="w-full aspect-video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
        ></iframe>
    ) : (
        <video
            className="w-full aspect-video"
            src={videoURL}
            autoPlay
            controls
        />
    );
}
