import React from 'react';
import {Composition} from 'remotion';
import {ChartLaunch, chartLaunchSchema, DURATION, FPS} from './ChartLaunch/Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChartLaunch-Landscape"
        component={ChartLaunch}
        schema={chartLaunchSchema}
        durationInFrames={DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{format: 'landscape' as const}}
      />
      <Composition
        id="ChartLaunch-Square"
        component={ChartLaunch}
        schema={chartLaunchSchema}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1080}
        defaultProps={{format: 'square' as const}}
      />
      <Composition
        id="ChartLaunch-Vertical"
        component={ChartLaunch}
        schema={chartLaunchSchema}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical' as const}}
      />
    </>
  );
};
