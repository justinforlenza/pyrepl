import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneConfig } from '../config';

interface Props {
  config: SceneConfig;
}

export const CTAScene: React.FC<Props> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: {
      damping: 100,
    },
  });

  const titleScale = interpolate(titleSpring, [0, 1], [0.8, 1]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const checkmarkDelay = 30;
  const checkmark1Opacity = interpolate(
    frame,
    [checkmarkDelay, checkmarkDelay + 10],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  const checkmark2Opacity = interpolate(
    frame,
    [checkmarkDelay + 10, checkmarkDelay + 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  const checkmark3Opacity = interpolate(
    frame,
    [checkmarkDelay + 20, checkmarkDelay + 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const urlDelay = 60;
  const urlOpacity = interpolate(
    frame,
    [urlDelay, urlDelay + 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        <h1
          style={{
            fontSize: 100,
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            marginBottom: 60,
          }}
        >
          {config.title}
        </h1>

        <div style={{ fontSize: 40, color: 'white', lineHeight: 1.8 }}>
          <div style={{ opacity: checkmark1Opacity }}>
            ✓ No Installation
          </div>
          <div style={{ opacity: checkmark2Opacity }}>
            ✓ No Login
          </div>
          <div style={{ opacity: checkmark3Opacity }}>
            ✓ Always Free
          </div>
        </div>

        <div
          style={{
            fontSize: 48,
            color: 'white',
            marginTop: 80,
            opacity: urlOpacity,
            fontWeight: 'bold',
          }}
        >
          [Your URL Here]
        </div>
      </div>
    </AbsoluteFill>
  );
};
