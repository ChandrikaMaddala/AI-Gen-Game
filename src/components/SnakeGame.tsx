import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Point, Direction, GameState } from "../types";
import { GRID_SIZE, CANVAS_SIZE, INITIAL_SPEED } from "../constants";
import { Trophy, RotateCcw, Play } from "lucide-react";

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 5, y: 5 },
    direction: "UP",
    score: 0,
    isGameOver: false,
    highScore: parseInt(localStorage.getItem("snakeHighScore") || "0")
  });
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
      };
      const isOnSnake = snake.some(s => s.x === newFood.x && s.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      food: generateFood([{ x: 10, y: 10 }]),
      direction: "UP",
      score: 0,
      isGameOver: false
    }));
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || isPaused) return prev;

      const head = prev.snake[0];
      const newHead = { ...head };

      switch (prev.direction) {
        case "UP": newHead.y -= 1; break;
        case "DOWN": newHead.y += 1; break;
        case "LEFT": newHead.x -= 1; break;
        case "RIGHT": newHead.x += 1; break;
      }

      // Check collisions
      const hitWall = newHead.x < 0 || newHead.x >= CANVAS_SIZE / GRID_SIZE || 
                      newHead.y < 0 || newHead.y >= CANVAS_SIZE / GRID_SIZE;
      const hitSelf = prev.snake.some(s => s.x === newHead.x && s.y === newHead.y);

      if (hitWall || hitSelf) {
        if (prev.score > prev.highScore) {
          localStorage.setItem("snakeHighScore", prev.score.toString());
        }
        return { ...prev, isGameOver: true, highScore: Math.max(prev.score, prev.highScore) };
      }

      const newSnake = [newHead, ...prev.snake];
      let newScore = prev.score;
      let newFood = prev.food;

      // Check food
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newScore += 10;
        newFood = generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return { ...prev, snake: newSnake, score: newScore, food: newFood };
    });
  }, [isPaused, generateFood]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setGameState(prev => {
        const key = e.key;
        let newDir = prev.direction;
        if (key === "ArrowUp" && prev.direction !== "DOWN") newDir = "UP";
        if (key === "ArrowDown" && prev.direction !== "UP") newDir = "DOWN";
        if (key === "ArrowLeft" && prev.direction !== "RIGHT") newDir = "LEFT";
        if (key === "ArrowRight" && prev.direction !== "LEFT") newDir = "RIGHT";
        return { ...prev, direction: newDir };
      });
      if (e.key === " " && !gameState.isGameOver) {
        setIsPaused(p => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState.isGameOver]);

  // Game Loop
  useEffect(() => {
    const loop = (time: number) => {
      const delta = time - lastUpdateRef.current;
      const speed = Math.max(80, INITIAL_SPEED - Math.floor(gameState.score / 50) * 10);
      
      if (delta > speed) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake, gameState.score]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with machine noise pattern
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Grid (Sharper)
    ctx.strokeStyle = "rgba(0, 243, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
    }

    // Food (Glitched block)
    ctx.fillStyle = "#ff00ff";
    ctx.fillRect(
      gameState.food.x * GRID_SIZE + 2,
      gameState.food.y * GRID_SIZE + 2,
      GRID_SIZE - 4,
      GRID_SIZE - 4
    );

    // Snake (Sharp blocks)
    gameState.snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? "#00f3ff" : "rgba(0, 243, 255, 0.6)";
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
      
      if (i === 0) {
        // Red visual sensors
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + 4, 3, 3);
        ctx.fillRect(segment.x * GRID_SIZE + 13, segment.y * GRID_SIZE + 4, 3, 3);
      }
    });
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full font-black italic">
        <div className="flex flex-col">
          <span className="text-[10px] text-neon-magenta">HIGH_SCORE_RECORD</span>
          <span className="text-xl text-neon-cyan">{gameState.highScore}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-neon-magenta">SCORE_BUFFER</span>
          <span className="text-3xl text-neon-cyan glitch-hover leading-none">{gameState.score}</span>
        </div>
      </div>

      <div className="relative border-4 border-neon-cyan/20">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black"
        />

        <AnimatePresence>
          {isPaused && !gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsPaused(false)}
            >
              <div className="text-center p-4 border-2 border-neon-cyan bg-black">
                <Play size={48} className="text-neon-cyan mx-auto mb-2 animate-pulse" fill="currentColor" />
                <p className="text-neon-cyan font-black text-xs uppercase tracking-tighter">__INITIALIZE_NEURAL_LINK__</p>
                <p className="text-neon-magenta text-[8px] mt-2 tracking-widest">[ SPACE_TO_ACTIVATE ]</p>
              </div>
            </motion.div>
          )}

          {gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-neon-magenta/90"
            >
              <div className="text-center p-8 bg-black border-4 border-white transform -rotate-1 shadow-2xl">
                <h2 className="text-4xl font-black text-white mb-1 uppercase tracking-tighter italic">CRITICAL_FAIL</h2>
                <p className="text-neon-cyan mb-8 font-black text-xs">MEMORY_CORRUPTION_DETECTED // PTR: {gameState.score}</p>
                <button 
                  onClick={resetGame}
                  className="brutalist-button w-full flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  REBOOT_SYSTEM
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-between text-[8px] font-black text-neon-cyan/40 px-2 uppercase">
        <span>X: {gameState.snake[0].x} Y: {gameState.snake[0].y}</span>
        <span>SNAKE_LEN: {gameState.snake.length}</span>
        <span>DIFFICULTY: {Math.min(10, Math.floor(gameState.score / 50) + 1)}</span>
      </div>
    </div>
  );
};
