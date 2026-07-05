import React from 'react';

import { CHANNEL_CONFIG } from '@/constants/data';

export const ChannelInfo: React.FC = () => {
  return (
    <div className="w-full md:w-1/2 space-y-4 px-4">
      <h2 className="text-2xl font-semibold text-center md:text-left">{CHANNEL_CONFIG.title}</h2>
      <p className="text-lg text-muted-foreground text-center md:text-left">
        {CHANNEL_CONFIG.description}
      </p>
      <div className="text-center md:text-left">
        <a
          href={CHANNEL_CONFIG.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-pill bg-primary px-6 py-2.5 font-semibold text-primary-foreground shadow-soft-sm transition-all hover:-translate-y-0.5 hover:shadow-glow"
        >
          Visit Channel
        </a>
      </div>
    </div>
  );
};
