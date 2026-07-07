import React from 'react';
import {interpolate, spring, Easing} from 'remotion';
import {COLORS} from './theme';

export const DATA = [42, 65, 51, 78, 66, 92];
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

// SVG chart canvas — no <text> in here: SVG text rendering proved
// non-deterministic across Remotion's parallel render tabs.
// Month labels are an HTML flex row in beats.tsx.
const W = 640;
const H = 290;
const BASE = 280; // baseline y
const MAX_H = 250; // max bar/line height above baseline
const SLOT = W / DATA.length;

const yFor = (v: number) => BASE - (v / 100) * MAX_H;

const Grid: React.FC = () => (
  <g>
    {[BASE, BASE - MAX_H / 3, BASE - (MAX_H * 2) / 3, BASE - MAX_H].map((y) => (
      <line key={y} x1={0} y1={y} x2={W} y2={y} stroke={COLORS.grid} strokeWidth={1.5} />
    ))}
  </g>
);

// ---- Bar chart: bars grow with staggered springs ----
export const BarChart: React.FC<{frame: number; fps: number; delay: number}> = ({
  frame,
  fps,
  delay,
}) => (
  <g>
    {DATA.map((v, i) => {
      const s = spring({
        frame: frame - delay - i * 5,
        fps,
        config: {damping: 15, stiffness: 110},
      });
      const h = (v / 100) * MAX_H * s;
      const barW = 54;
      return (
        <rect
          key={i}
          x={i * SLOT + (SLOT - barW) / 2}
          y={BASE - h}
          width={barW}
          height={h}
          rx={6}
          fill={i === DATA.length - 1 ? COLORS.text : COLORS.bar}
          opacity={i === DATA.length - 1 ? 1 : 0.55}
        />
      );
    })}
  </g>
);

const linePoints = DATA.map((v, i) => `${i * SLOT + SLOT / 2},${yFor(v)}`).join(' L ');
const linePath = `M ${linePoints}`;
const areaPath = `${linePath} L ${(DATA.length - 1) * SLOT + SLOT / 2},${BASE} L ${SLOT / 2},${BASE} Z`;

// ---- Line chart: path draws itself left to right ----
export const LineChart: React.FC<{frame: number; delay: number; drawDur: number}> = ({
  frame,
  delay,
  drawDur,
}) => {
  const progress = interpolate(frame, [delay, delay + drawDur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <g>
      <path
        d={linePath}
        fill="none"
        stroke={COLORS.text}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      {DATA.map((v, i) => {
        const pointAt = i / (DATA.length - 1);
        const visible = progress >= pointAt;
        return (
          <circle
            key={i}
            cx={i * SLOT + SLOT / 2}
            cy={yFor(v)}
            r={7}
            fill={COLORS.bg}
            stroke={COLORS.text}
            strokeWidth={4}
            opacity={visible ? 1 : 0}
          />
        );
      })}
    </g>
  );
};

// ---- Area chart: fill reveals left to right via clip ----
export const AreaChart: React.FC<{frame: number; delay: number; drawDur: number}> = ({
  frame,
  delay,
  drawDur,
}) => {
  const progress = interpolate(frame, [delay, delay + drawDur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <g>
      <defs>
        <clipPath id="areaClip">
          <rect x={0} y={0} width={progress * W} height={H} />
        </clipPath>
      </defs>
      <g clipPath="url(#areaClip)">
        <path d={areaPath} fill={COLORS.areaFill} />
        <path
          d={linePath}
          fill="none"
          stroke={COLORS.text}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
};

export const ChartCanvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display: 'block'}}>
    <Grid />
    {children}
  </svg>
);
