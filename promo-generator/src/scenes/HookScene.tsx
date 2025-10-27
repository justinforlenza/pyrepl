import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneConfig } from '../config';

interface Props {
  config: SceneConfig;
}

export const HookScene: React.FC<Props> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: {
      damping: 100,
    },
  });

  const titleScale = interpolate(titleSpring, [0, 1], [0.5, 1]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const subtitleDelay = 15;
  const subtitleOpacity = interpolate(
    frame,
    [subtitleDelay, subtitleDelay + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0ea5e9',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
    >
      <div
        style={{
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        <h1
          style={{
            fontSize: 120,
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            textAlign: 'center',
          }}
        >
          {config.title}
        </h1>
      </div>
      <p
        style={{
          fontSize: 48,
          color: 'white',
          opacity: subtitleOpacity,
          marginTop: 40,
          textAlign: 'center',
        }}
      >
        {config.subtitle}
      </p>
    </AbsoluteFill>
  );
};
