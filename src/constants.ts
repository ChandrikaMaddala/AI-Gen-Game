import { Track } from "./types";

export const DUMMY_TRACKS: Track[] = [
  {
    id: "1",
    title: "Cyber Pulse",
    artist: "Synth-AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=300&h=300&auto=format&fit=crop",
    duration: 372
  },
  {
    id: "2",
    title: "Neon Drift",
    artist: "Glitch Master",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    coverUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&h=300&auto=format&fit=crop",
    duration: 425
  },
  {
    id: "3",
    title: "Quantum Echo",
    artist: "Vapor-GPT",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    coverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=300&auto=format&fit=crop",
    duration: 310
  }
];

export const GRID_SIZE = 20;
export const CANVAS_SIZE = 400;
export const INITIAL_SPEED = 150;
