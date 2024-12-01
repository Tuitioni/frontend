"use client"; // Mark as a Client Component

import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";

const YoutubePlayer: React.FC = () => {
  // The video ID of the YouTube video you want to display
  const videoId = "dQw4w9WgXcQ"; // Example: Rick Astley - Never Gonna Give You Up

  // YouTube Player options
  const playerOptions: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1, // Auto-play the video when it loads
      controls: 1, // Show player controls
    },
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center bg-bluishGrey p-5 mx-4 rounded-lg mt-3">
      <div className="w-full md:w-2/4">
        <div className="relative pb-[56.25%]">
          {" "}
          {/* Aspect Ratio for YouTube */}
          <YouTube
            videoId={videoId}
            opts={{
              ...playerOptions,
              width: "100%",
              height: "100%",
            }}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>

      {/* Side Info Section */}
      <div className="mt-8 md:mt-0 md:ml-8 text-center md:text-left md:w-2/4">
        <h2 className="text-2xl font-semibold mb-4">
          Join Our YouTube Channel!
        </h2>
        <p className="text-lg">
          We frequently post tips and tricks on study hacks, productivity, and
          more to help you succeed in your learning journey!
        </p>
        <a
          href="https://www.youtube.com/channel/UCXXXXXX" // Replace with your actual YouTube channel URL
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Visit Channel
        </a>
      </div>
    </div>
  );
};

export default YoutubePlayer;
