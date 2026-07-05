'use client';

import React from 'react';

import { YOUTUBE_CONFIG } from '@/constants/data';

import { SectionWrapper } from './SectionWrapper';
import { ChannelInfo } from './youtube/ChannelInfo';
import { VideoSection } from './youtube/VideoSection';

export default function YoutubePlayer() {
  return (
    <SectionWrapper>
      <div className="flex flex-col md:flex-row justify-between items-center bg-muted p-6 rounded-2xl border border-border gap-8">
        <VideoSection
          videoId={YOUTUBE_CONFIG.videoId}
          playerOptions={YOUTUBE_CONFIG.playerOptions}
        />
        <ChannelInfo />
      </div>
    </SectionWrapper>
  );
}
