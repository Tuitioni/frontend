"use client";

import React from "react";
import ReactPlayer from "react-player/youtube";

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return <ReactPlayer url={url} controls={true} suppressHydrationWarning />;
};

export default VideoPlayer;
