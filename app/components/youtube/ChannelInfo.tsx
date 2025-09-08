import React from "react";

import { CHANNEL_CONFIG } from "@/app/constants/data";

export const ChannelInfo: React.FC = () => {
  return (
    <div className="w-full md:w-1/2 space-y-4 px-4">
      <h2 className="text-2xl font-semibold text-center md:text-left">
        {CHANNEL_CONFIG.title}
      </h2>
      <p className="text-lg text-gray-700 text-center md:text-left">
        {CHANNEL_CONFIG.description}
      </p>
      <div className="text-center md:text-left">
        <a
          href={CHANNEL_CONFIG.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition duration-300 hover:shadow-lg"
        >
          Visit Channel
        </a>
      </div>
    </div>
  );
};
