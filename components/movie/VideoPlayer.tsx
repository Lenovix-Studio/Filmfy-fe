"use client";

import React, { useEffect, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  movieId: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, movieId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = localStorage.getItem(`video-time-${movieId}`);
    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    }

    const interval = setInterval(() => {
      localStorage.setItem(`video-time-${movieId}`, video.currentTime.toString());
    }, 5000);

    const handleKeydown = (e: KeyboardEvent) => {
      if (!video) return;
      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          video.paused ? video.play() : video.pause();
          break;
        case "f":
          video.requestFullscreen();
          break;
        case "m":
          video.muted = !video.muted;
          break;
        case "arrowleft":
          video.currentTime -= 5;
          break;
        case "arrowright":
          video.currentTime += 5;
          break;
        case "arrowup":
          video.volume = Math.min(1, video.volume + 0.1);
          break;
        case "arrowdown":
          video.volume = Math.max(0, video.volume - 0.1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [movieId]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      controls
      className="w-full h-full object-contain"
    />
  );
};
