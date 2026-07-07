import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';

const GRID = 80;
const DOTS = 16;
const DRIFT_X = 0.18; // px per frame
const DRIFT_Y = 0.12;

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // pattern wraps (periodic, invisible jump) — dots drift continuously (no wrap)
  const px = (frame * DRIFT_X) % GRID;
  const py = (frame * DRIFT_Y) % GRID;
  const dx = frame * DRIFT_X;
  const dy = frame * DRIFT_Y;

  const cols = Math.ceil(width / GRID);
  const rows = Math.ceil(height / GRID);

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        <defs>
          <pattern
            id="bgGrid"
            width={GRID}
            height={GRID}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${px} ${py})`}
          >
            <path d={`M ${GRID} 0 L 0 0 0 ${GRID}`} fill="none" stroke="#151515" strokeWidth={1.5} />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#bgGrid)" />
        <g transform={`translate(${dx} ${dy})`}>
          {Array.from({length: DOTS}).map((_, i) => {
            const col = Math.floor(random(`col-${i}`) * (cols + 3)) - 3;
            const row = Math.floor(random(`row-${i}`) * (rows + 3)) - 3;
            const phase = random(`phase-${i}`) * Math.PI * 2;
            const speed = 0.03 + random(`speed-${i}`) * 0.03;
            const pulse = Math.max(0, Math.sin(frame * speed + phase));
            return (
              <circle
                key={i}
                cx={col * GRID}
                cy={row * GRID}
                r={3}
                fill="#5A5A5A"
                opacity={pulse * 0.7}
              />
            );
          })}
        </g>
      </svg>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.9) 80%)',
        }}
      />
    </AbsoluteFill>
  );
};
