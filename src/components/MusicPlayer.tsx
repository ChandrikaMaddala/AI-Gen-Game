import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Track } from "../types";
import { DUMMY_TRACKS } from "../constants";

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("SIGNAL_INTERRUPT", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="brutalist-card w-full max-w-md flex flex-col gap-6">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      <div className="flex gap-4 items-start">
        <motion.div 
          key={currentTrack.id}
          initial={{ x: -5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative w-28 h-28 border-2 border-neon-magenta overflow-hidden"
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 border-[8px] border-black/20 pointer-events-none" />
          {isPlaying && (
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-cyan animate-pulse" />
          )}
        </motion.div>
        
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              <h3 className="text-xl font-extrabold truncate text-neon-magenta glitch-hover">
                {currentTrack.title.toUpperCase()}
              </h3>
              <p className="text-neon-cyan text-xs font-bold truncate tracking-widest bg-neon-cyan/10 px-1 inline-block">
                SOURCE: {currentTrack.artist.toUpperCase()}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-4 flex items-center gap-2 text-[8px] font-black text-neon-cyan/40">
            <div className="w-1.5 h-1.5 bg-neon-cyan animate-ping" />
            BITRATE: 320KBPS // LOSSLESS_AUDIO_LINK
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full bg-black border border-neon-cyan/30 relative overflow-hidden">
          <motion.div 
            className="h-full bg-neon-magenta/50"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.1 }}
          />
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10" />
        </div>
        <div className="flex justify-between text-[9px] font-black text-neon-cyan tracking-tighter">
          <span>{formatTime(audioRef.current?.currentTime || 0)}s</span>
          <span>{formatTime(audioRef.current?.duration || currentTrack.duration)}s</span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-zinc-900/50 p-2 border border-white/5">
        <button 
          onClick={handlePrev}
          className="p-2 border border-transparent hover:border-neon-cyan text-neon-cyan transition-all"
        >
          <SkipBack size={20} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="brutalist-button flex items-center justify-center min-w-24"
        >
          {isPlaying ? "STOP" : "RUN"}
        </button>
        
        <button 
          onClick={handleNext}
          className="p-2 border border-transparent hover:border-neon-cyan text-neon-cyan transition-all"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="pt-2 border-t border-neon-cyan/20 flex justify-center gap-1.5">
        {DUMMY_TRACKS.map((track, idx) => (
          <button
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }}
            className={`h-1 transition-all ${
              idx === currentTrackIndex ? "w-12 bg-neon-magenta" : "w-4 bg-zinc-800 hover:bg-zinc-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
