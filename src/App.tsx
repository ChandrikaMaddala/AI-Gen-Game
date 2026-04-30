/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MusicPlayer } from "./components/MusicPlayer";
import { SnakeGame } from "./components/SnakeGame";
import { motion } from "motion/react";
import { Music, Gamepad2, Github } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-4 selection:bg-neon-magenta selection:text-white">
      {/* CRT INFRASTRUCTURE */}
      <div className="crt-overlay" />
      <div className="scanline" />

      <header className="relative z-10 w-full max-w-6xl flex justify-between items-center mb-8 border-b-2 border-neon-magenta pb-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col"
        >
          <h1 className="text-3xl font-black tracking-tighter text-neon-cyan glitch-hover">
            //NEON_RHYTHM_CORE_v2.0.4
          </h1>
          <p className="text-[10px] text-neon-magenta uppercase tracking-[0.3em] font-bold">
            SIGNAL: ENCRYPTED // LINK: ESTABLISHED
          </p>
        </motion.div>

        <div className="text-right font-bold text-[10px] text-neon-cyan/50 hidden md:block">
          <p>LOC_ID: AIS-LAB-0x09</p>
          <p>MEM_SECTOR: RED_ZONE</p>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Game Area */}
        <motion.section 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="brutalist-card border-neon-magenta/50"
        >
          <div className="flex items-center justify-between mb-4 bg-neon-magenta text-black px-2 py-1 font-black text-xs uppercase italic">
            <span>NEURAL_SNAKE_INTERFACE_BOOTING...</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-black animate-ping" />
            </div>
          </div>
          <SnakeGame />
        </motion.section>

        {/* Sidebar / Player */}
        <motion.section 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col gap-8"
        >
          <MusicPlayer />
          
          <div className="brutalist-card bg-black/40 text-neon-cyan border-neon-cyan/30">
            <h4 className="text-xs font-black mb-4 uppercase flex items-center gap-2 border-b border-neon-cyan/20 pb-2">
              <span className="text-neon-magenta">#</span> SYSTEM_DIAGNOSTICS
            </h4>
            <div className="space-y-1 text-[10px] uppercase font-bold leading-none">
              <p className="text-neon-magenta">[FATAL] NOISE_FLOOR_EXCEEDED</p>
              <p>[OK] RHYTHM_SYNC: 120BPM</p>
              <p>[OK] PACKET_LOSS: 0.02%</p>
              <p className="animate-pulse bg-neon-cyan/20 px-1 inline-block">STATUS: RUNNING_KERNEL</p>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="relative z-10 mt-12 w-full max-w-6xl flex justify-between items-center text-[10px] font-bold text-neon-magenta/60 uppercase">
        <p className="glitch-hover">© 2026 MACHINE_RHYTHM_LABS</p>
        <div className="flex gap-4">
          <span className="text-neon-cyan">ENCRYPTION: AES-256-GLITCH</span>
          <span className="animate-pulse">_READY_FOR_COMMAND_</span>
        </div>
      </footer>
    </div>
  );
}
