import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";

import type { YouTubeEvent } from "react-youtube";

interface VideoSectionProps {
  videoId: string;
  playerOptions: YouTubeProps["opts"];
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  videoId,
  playerOptions,
}) => {
  return (
    <div className="w-full md:w-1/2">
      <div className="relative pb-[80%] rounded-lg overflow-hidden">
        <YouTube
          videoId={videoId}
          opts={{
            ...playerOptions,
            width: "100%",
            height: "100%",
          }}
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          onReady={(event: YouTubeEvent) => event.target.pauseVideo()}
        />
      </div>
    </div>
  );
};
