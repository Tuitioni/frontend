"use client";

import React from "react";
import { VideoSection } from "./youtube/VideoSection";
import { ChannelInfo } from "./youtube/ChannelInfo";
import { YOUTUBE_CONFIG } from "@/app/constants/data";

export default function YoutubePlayer() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center bg-bluishGrey p-6 rounded-lg mt-4 gap-8">
        <VideoSection
          videoId={YOUTUBE_CONFIG.videoId}
          playerOptions={YOUTUBE_CONFIG.playerOptions}
        />
        <ChannelInfo />
      </div>
    </div>
  );
}
