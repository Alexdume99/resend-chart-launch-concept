import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, Format, layout} from './theme';
import {AreaChart, BarChart, ChartCanvas, LineChart, MONTHS} from './charts';

// ---------- shared helpers ----------

const Enter: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({delay = 0, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 120}});
  return (
    <div style={{opacity: s, transform: `translateY(${(1 - s) * 44}px)`, ...style}}>
      {children}
    </div>
  );
};

// Wraps every beat: continuous punch-in (1.0 -> 1.03) + fade out over the last 12 frames
const BeatShell: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [dur - 12, dur - 2], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = 1 + (frame / dur) * 0.03;
  return <AbsoluteFill style={{opacity, transform: `scale(${scale})`}}>{children}</AbsoluteFill>;
};

const Center: React.FC<{children: React.ReactNode; padding: number}> = ({children, padding}) => (
  <AbsoluteFill
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      padding,
      textAlign: 'center',
    }}
  >
    {children}
  </AbsoluteFill>
);

// ---------- Beat 1 — Hook (0-3s) ----------

export const Hook: React.FC<{format: Format; dur: number}> = ({format, dur}) => {
  const l = layout(format);
  return (
    <BeatShell dur={dur}>
      <Center padding={l.padding}>
        <Enter delay={5}>
          <div style={{fontSize: l.titleSize, fontWeight: 700, color: COLORS.text, lineHeight: 1.05}}>
            Charts.
          </div>
        </Enter>
        <Enter delay={26}>
          <div style={{fontSize: l.titleSize, fontWeight: 700, color: COLORS.textDim, lineHeight: 1.05}}>
            In your emails.
          </div>
        </Enter>
      </Center>
    </BeatShell>
  );
};

// ---------- Beat 2 — Problem (3-8s) ----------

export const Problem: React.FC<{format: Format; dur: number}> = ({format, dur}) => {
  const l = layout(format);
  return (
    <BeatShell dur={dur}>
      <Center padding={l.padding}>
        <Enter delay={6}>
          <div style={{fontSize: l.subtitleSize, fontWeight: 600, color: COLORS.textDim, lineHeight: 1.3}}>
            Metrics live in dashboards.
          </div>
        </Enter>
        <Enter delay={42}>
          <div style={{fontSize: l.subtitleSize, fontWeight: 600, color: COLORS.text, lineHeight: 1.3, marginTop: 12}}>
            Your users live in their inbox.
          </div>
        </Enter>
      </Center>
    </BeatShell>
  );
};

// ---------- Beat 3 — Demo (8-18s) ----------
// Phases (local frames, dur = 300):
//   0-30    email frame springs in
//   45-140  bar chart
//   150-165 crossfade to line
//   165-230 line draws
//   235-250 crossfade to area
//   250-290 area fills

const phaseOpacity = (
  frame: number,
  fadeInStart: number,
  fadeOutStart: number | null
): number => {
  const fadeIn = interpolate(frame, [fadeInStart, fadeInStart + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (fadeOutStart === null) return fadeIn;
  const fadeOut = interpolate(frame, [fadeOutStart, fadeOutStart + 15], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return Math.min(fadeIn, fadeOut);
};

const CHART_LABELS: [string, number, number | null][] = [
  ['Bar chart', 40, 150],
  ['Line chart', 150, 235],
  ['Area chart', 235, null],
];

export const Demo: React.FC<{format: Format; dur: number}> = ({format, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const l = layout(format);

  const enter = spring({frame, fps, config: {damping: 17, stiffness: 90}});

  return (
    <BeatShell dur={dur}>
      <Center padding={l.padding}>
        <div
          style={{
            width: l.emailWidth,
            opacity: enter,
            transform: `translateY(${(1 - enter) * 80}px) scale(${0.94 + enter * 0.06})`,
            background: COLORS.frame,
            border: `1.5px solid ${COLORS.stroke}`,
            borderRadius: 20,
            overflow: 'hidden',
            textAlign: 'left',
            fontFamily: 'inherit',
          }}
        >
          {/* email header */}
          <div style={{padding: '28px 36px', borderBottom: `1.5px solid ${COLORS.stroke}`, display: 'flex', gap: 18, alignItems: 'center'}}>
            <div style={{width: 52, height: 52, borderRadius: '50%', background: '#1E1E1E', border: `1.5px solid ${COLORS.stroke}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.text, fontWeight: 700, fontSize: 22}}>
              A
            </div>
            <div>
              <div style={{color: COLORS.text, fontSize: l.smallSize, fontWeight: 600, lineHeight: 1.35}}>
                Acme Analytics &lt;reports@acme.com&gt;
              </div>
              <div style={{color: COLORS.textDim, fontSize: l.smallSize - 4, marginTop: 4, lineHeight: 1.35}}>
                Your June report is here
              </div>
            </div>
          </div>
          {/* email body */}
          <div style={{padding: '32px 36px 28px'}}>
            <div style={{color: COLORS.text, fontSize: l.smallSize + 6, fontWeight: 700, lineHeight: 1.3}}>
              Monthly performance
            </div>
            <div style={{color: COLORS.textDim, fontSize: l.smallSize - 2, marginTop: 6, marginBottom: 24, lineHeight: 1.3}}>
              Revenue is up 38% — here is the breakdown.
            </div>
            {/* chart stack: bar -> line -> area */}
            <div style={{position: 'relative'}}>
              <div style={{opacity: phaseOpacity(frame, 40, 150)}}>
                <ChartCanvas>
                  <BarChart frame={frame} fps={fps} delay={50} />
                </ChartCanvas>
              </div>
              <div style={{position: 'absolute', inset: 0, opacity: phaseOpacity(frame, 150, 235)}}>
                <ChartCanvas>
                  <LineChart frame={frame} delay={165} drawDur={60} />
                </ChartCanvas>
              </div>
              <div style={{position: 'absolute', inset: 0, opacity: phaseOpacity(frame, 235, null)}}>
                <ChartCanvas>
                  <AreaChart frame={frame} delay={250} drawDur={40} />
                </ChartCanvas>
              </div>
            </div>
            {/* month labels: HTML on purpose — SVG <text> jitters across render tabs */}
            <div style={{display: 'flex', marginTop: 8, opacity: phaseOpacity(frame, 40, null)}}>
              {MONTHS.map((m) => (
                <span
                  key={m}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    color: COLORS.textDim,
                    fontSize: l.smallSize,
                    fontWeight: 500,
                    lineHeight: 1,
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
            {/* chart type chip */}
            <div style={{marginTop: 20, height: 40, position: 'relative'}}>
              {CHART_LABELS.map(([label, from, to]) => (
                <div
                  key={label}
                  style={{
                    position: 'absolute',
                    opacity: phaseOpacity(frame, from, to),
                    color: COLORS.textDim,
                    border: `1.5px solid ${COLORS.stroke}`,
                    borderRadius: 999,
                    padding: '6px 18px',
                    fontSize: l.smallSize - 6,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {`<${label.split(' ')[0]} />`} · {label}
                </div>
              ))}
            </div>
          </div>
          {/* email footer */}
          <div style={{padding: '18px 36px', borderTop: `1.5px solid ${COLORS.stroke}`, color: COLORS.textDim, fontSize: l.smallSize - 8, lineHeight: 1.3}}>
            Sent with Resend
          </div>
        </div>
      </Center>
    </BeatShell>
  );
};

// ---------- Beat 4 — Punchline (18-23s) ----------

export const Punchline: React.FC<{format: Format; dur: number}> = ({format, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const l = layout(format);
  const underline = spring({frame: frame - 34, fps, config: {damping: 18, stiffness: 100}});
  return (
    <BeatShell dur={dur}>
      <Center padding={l.padding}>
        <Enter delay={6}>
          <div style={{fontSize: l.titleSize * 0.72, fontWeight: 700, color: COLORS.text, lineHeight: 1.2}}>
            Ship reports people{' '}
            <span style={{position: 'relative', whiteSpace: 'nowrap'}}>
              actually read.
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: -10,
                  height: 8,
                  borderRadius: 4,
                  background: COLORS.text,
                  width: `${underline * 100}%`,
                }}
              />
            </span>
          </div>
        </Enter>
      </Center>
    </BeatShell>
  );
};

// ---------- Beat 5 — Outro (23-25s) ----------

export const Outro: React.FC<{format: Format; dur: number}> = ({format, dur}) => {
  const l = layout(format);
  return (
    <BeatShell dur={dur}>
      <Center padding={l.padding}>
        <Enter delay={3}>
          <div style={{fontSize: l.titleSize * 0.85, fontWeight: 700, color: COLORS.text, letterSpacing: '-0.02em'}}>
            Resend
          </div>
        </Enter>
        <Enter delay={14}>
          <div style={{fontSize: l.bodySize * 0.75, fontWeight: 500, color: COLORS.textDim, marginTop: 14, lineHeight: 1.3}}>
            New Chart Component — available now
          </div>
        </Enter>
      </Center>
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          width: '100%',
          textAlign: 'center',
          color: '#5A5A5A',
          fontSize: 22,
          fontWeight: 500,
        }}
      >
        Concept video · Not affiliated with Resend
      </div>
    </BeatShell>
  );
};
