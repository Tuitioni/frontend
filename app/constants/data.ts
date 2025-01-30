import { YouTubeProps } from "react-youtube";

export const EDUCATION_LEVELS = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Junior College", value: "jc" },
  { label: "University", value: "university" },
];

export const YOUTUBE_CONFIG = {
  videoId: "dQw4w9WgXcQ",
  playerOptions: {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1,
      rel: 0, // Don't show related videos
    },
  } as YouTubeProps["opts"],
};

export const CHANNEL_CONFIG = {
  channelUrl: "https://www.youtube.com/channel/UCXXXXXX", // Replace with your channel URL
  title: "Join Our YouTube Channel!",
  description:
    "We frequently post tips and tricks on study hacks, productivity, and more to help you succeed in your learning journey!",
};
