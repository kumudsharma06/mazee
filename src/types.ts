/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GridSize = 'small' | 'medium' | 'large';

export interface MazeStats {
  cells: number;
  solutionLength: number;
  grid: string;
}

export type MazeThemeId = 'blueprint' | 'slate' | 'forest' | 'cyberpunk' | 'mono';

export interface MazeTheme {
  id: MazeThemeId;
  name: string;
  bg: string;          // Page/app background
  cardBg: string;      // Card background
  wallColor: string;   // Color of lines/walls
  corridorColor: string; // Color inside the maze path
  outsideColor: string;  // Color outside the letters/mask
  entryColor: string;    // Start node color
  exitColor: string;     // End node color
  solutionColor: string; // Solver line color
  textColor: string;     // Text labels/headings
}

export type Point = [number, number];

export interface MazeData {
  rows: number;
  cols: number;
  mask: boolean[][];
  wallsH: boolean[][]; // [rows-1][cols]
  wallsV: boolean[][]; // [rows][cols-1]
  entry: Point;
  exit: Point;
  solution: Point[];
  stats: MazeStats;
}
