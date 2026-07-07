import {loadFont} from '@remotion/google-fonts/Inter';

export const {fontFamily} = loadFont('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export type Format = 'landscape' | 'square' | 'vertical';

export const COLORS = {
  bg: '#000000',
  text: '#FFFFFF',
  textDim: '#8F8F8F',
  stroke: '#232323',
  frame: '#0A0A0A',
  grid: '#1C1C1C',
  bar: '#EDEDED',
  areaFill: 'rgba(255, 255, 255, 0.14)',
};

export const layout = (format: Format) => {
  const isVertical = format === 'vertical';
  const isSquare = format === 'square';
  return {
    padding: isVertical ? 80 : 120,
    titleSize: isVertical ? 92 : isSquare ? 100 : 132,
    subtitleSize: isVertical ? 52 : isSquare ? 54 : 62,
    bodySize: isVertical ? 42 : 46,
    smallSize: isVertical ? 26 : 28,
    emailWidth: isVertical ? 880 : isSquare ? 840 : 980,
  };
};
