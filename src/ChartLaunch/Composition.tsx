import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {z} from 'zod';
import {COLORS, fontFamily} from './theme';
import {Background} from './Background';
import {Demo, Hook, Outro, Problem, Punchline} from './beats';

export const chartLaunchSchema = z.object({
  format: z.enum(['landscape', 'square', 'vertical']),
});

export const FPS = 30;

// Beat map — total 750 frames = 25s @ 30fps
export const BEATS = {
  hook: {from: 0, dur: 90}, //        0-3s
  problem: {from: 90, dur: 150}, //   3-8s
  demo: {from: 240, dur: 300}, //     8-18s
  punchline: {from: 540, dur: 150}, // 18-23s
  outro: {from: 690, dur: 60}, //     23-25s
} as const;

export const DURATION = BEATS.outro.from + BEATS.outro.dur; // 750

export const ChartLaunch: React.FC<z.infer<typeof chartLaunchSchema>> = ({format}) => {
  return (
    <AbsoluteFill style={{background: COLORS.bg, fontFamily}}>
      <Background />
      <Sequence from={BEATS.hook.from} durationInFrames={BEATS.hook.dur} name="1 — Hook">
        <Hook format={format} dur={BEATS.hook.dur} />
      </Sequence>
      <Sequence from={BEATS.problem.from} durationInFrames={BEATS.problem.dur} name="2 — Problem">
        <Problem format={format} dur={BEATS.problem.dur} />
      </Sequence>
      <Sequence from={BEATS.demo.from} durationInFrames={BEATS.demo.dur} name="3 — Demo">
        <Demo format={format} dur={BEATS.demo.dur} />
      </Sequence>
      <Sequence from={BEATS.punchline.from} durationInFrames={BEATS.punchline.dur} name="4 — Punchline">
        <Punchline format={format} dur={BEATS.punchline.dur} />
      </Sequence>
      <Sequence from={BEATS.outro.from} durationInFrames={BEATS.outro.dur} name="5 — Outro">
        <Outro format={format} dur={BEATS.outro.dur} />
      </Sequence>
    </AbsoluteFill>
  );
};
