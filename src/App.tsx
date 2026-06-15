/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GridSize, MazeData, MazeTheme } from './types';
import { generateTextMask, generateImageMask, generateMaze } from './utils/mazeEngine';
import { MAZE_THEMES } from './utils/themes';
import { MaskInput } from './components/MaskInput';
import { MazeRenderer } from './components/MazeRenderer';
import { Compass, Hash, Landmark, Trophy, Info, FileQuestion, Hammer, Puzzle } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState<MazeTheme>(MAZE_THEMES[0]); // Classic Blueprint default
  const [mazeData, setMazeData] = useState<MazeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [gridSizeLabel, setGridSizeLabel] = useState<string>('medium');

  // Trigger default initial maze on mount (shows "IITGN" pre-loaded)
  useEffect(() => {
    handleGenerateText('IITGN', 'medium');
  }, []);

  // Map GridSize label to raw dimensions [rows, cols]
  const getGridDimensions = (size: GridSize): [number, number] => {
    if (size === 'small') return [50, 100];
    if (size === 'large') return [110, 220];
    return [80, 160]; // medium
  };

  const handleGenerateText = (text: string, size: GridSize) => {
    setIsGenerating(true);
    setErrorLocal(null);
    setGridSizeLabel(size);

    setTimeout(() => {
      try {
        const [rows, cols] = getGridDimensions(size);
        const mask = generateTextMask(text, rows, cols);
        const maze = generateMaze(mask);
        setMazeData(maze);
      } catch (err: any) {
        console.error(err);
        setErrorLocal(err?.message || 'Error occurred during text mask generation.');
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  const handleGenerateImage = (img: HTMLImageElement, size: GridSize) => {
    setIsGenerating(true);
    setErrorLocal(null);
    setGridSizeLabel(size);

    setTimeout(() => {
      try {
        const [rows, cols] = getGridDimensions(size);
        const mask = generateImageMask(img, rows, cols);
        const maze = generateMaze(mask);
        setMazeData(maze);
      } catch (err: any) {
        console.error(err);
        setErrorLocal(err?.message || 'Error occurred during image silhouette extraction.');
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  return (
    <div className={`min-h-screen font-sans antialiased text-zinc-900 bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300`}>
      
      {/* Header Banner */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Styled Logo Icon */}
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Compass size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight tracking-tight text-zinc-900 dark:text-white">
                Maze Generator
              </h1>
              <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                Text & Image Labyrinth carver
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
              Fully Client-Side Process
            </span>
          </div>
        </div>
      </header>

      {/* Main body viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Intro text */}
        <div className="space-y-2">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Convert any word or silhouette into a perfect <span className="text-emerald-600 dark:text-emerald-500">maze</span>
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Create high-fidelity labyrinth designs based on words, customized text, or black & white logos. This app maps letter shapes, joins isolated components at their upper or lower vertical tips, and carves exactly one perfect solution path through the active grid space.
          </p>
        </div>

        {/* Workspace Layout Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Panel */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 p-6 shadow-sm">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
              Labyrinth Blueprint Controls
            </h3>
            <MaskInput
              onGenerateText={handleGenerateText}
              onGenerateImage={handleGenerateImage}
              selectedTheme={selectedTheme}
              onChangeTheme={setSelectedTheme}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Column: Renderer viewport and Telemetries */}
          <div className="lg:col-span-8 space-y-6">
            
            {mazeData && (
              /* Telemetry Statistics layout */
              <div className="grid grid-cols-3 gap-4">
                <div id="stat-grid" className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
                  <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg text-zinc-500">
                    <Grid01 size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400">Grid Resolution</span>
                    <strong className="block text-sm font-bold text-zinc-800 dark:text-white">{mazeData.stats.grid}</strong>
                  </div>
                </div>

                <div id="stat-cells" className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600">
                    <Hash size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400">Active Passages</span>
                    <strong className="block text-sm font-bold text-zinc-800 dark:text-white">{mazeData.stats.cells.toLocaleString()}</strong>
                  </div>
                </div>

                <div id="stat-solution" className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
                  <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg text-cyan-600">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400">Answer Length</span>
                    <strong className="block text-sm font-bold text-zinc-800 dark:text-white">{mazeData.stats.solutionLength} steps</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Renderer viewport card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 p-6 shadow-sm min-h-[400px] flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center space-y-3 py-12">
                  <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Computing path layouts and carving passages...
                  </p>
                </div>
              ) : errorLocal ? (
                <div className="text-center space-y-3 py-12">
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-550 dark:text-rose-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto border border-rose-100">
                    <Info size={22} />
                  </div>
                  <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-200">Generation Failed</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    {errorLocal}
                  </p>
                </div>
              ) : mazeData ? (
                <div className="w-full">
                  <MazeRenderer 
                    mazeData={mazeData} 
                    theme={selectedTheme} 
                    gridSizeLabel={gridSizeLabel}
                  />
                </div>
              ) : (
                <p className="text-xs text-zinc-400">Initialize a custom blueprint on the left to review the canvas.</p>
              )}
            </div>

          </div>

        </div>

        {/* Detailed algorithmic step breakdown - Elegant blueprint blocks */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800/80">
          <h3 className="font-display text-xl font-bold text-zinc-950 dark:text-white mb-6 tracking-tight flex items-center gap-2">
            <Landmark size={20} className="text-emerald-600" />
            Under the Hood: Algorithmic Architecture
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block py-1 px-2 text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 rounded font-mono mb-3">
                  STAGE 01
                </span>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <FileQuestion size={16} className="text-zinc-500" />
                  Shape Masking
                </h4>
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Custom word tags are loaded into offscreen layers scaled up by 10x to minimize aliasing. Standard image transparency values or luminance thresholds filter out dark silhouette contours into coordinates.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block py-1 px-2 text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 rounded font-mono mb-3">
                  STAGE 02
                </span>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Hammer size={16} className="text-zinc-500" />
                  Tip Bridge Connection
                </h4>
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Separate letters inside the mask are labeled using 4-way connected flood-fills. These isolated components get joined at their extreme top/bottom limits (the tips) via search corridors, ensuring a single connected grid.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block py-1 px-2 text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 rounded font-mono mb-3">
                  STAGE 03
                </span>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Puzzle size={16} className="text-zinc-500" />
                  DFS Wall Carving
                </h4>
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  A Randomized Depth-First Search (DFS) stack backtracker crawls through the unified mask layout. It recursively removes wall partitions between adjacent spaces, guaranteeing zero isolated regions and no loops.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block py-1 px-2 text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 rounded font-mono mb-3">
                  STAGE 04
                </span>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Trophy size={16} className="text-zinc-500" />
                  BFS Path Resolution
                </h4>
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Finally, a Breadth-First Search (BFS) is executed starting at the northwest corner of the top third block heading toward the southeast terminal, resolving the absolute shortest solution corridor instantly.
                </p>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Footer information credit */}
      <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p className="mb-2">
          © 2026 Maze Generator Blueprint Carver. Created entirely with React, TypeScript, HTML5 Canvas, and Tailwind CSS.
        </p>
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-450 dark:text-zinc-500">
          Perfect Maze Generation  ·  Highly Printable Layouts  ·  Interactive Gameplay
        </p>
      </footer>

    </div>
  );
}

// Simple Helper grid icon representation since Lucide Grid doesn't come standard by that name
function Grid01({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}
