import React from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, useCurrentFrame, staticFile } from 'remotion';
import type { SceneConfig } from '../config';

interface Props {
  config: SceneConfig;
}

export const BrowserBasedScene: React.FC<Props> = ({ config }) => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const textTranslateY = interpolate(frame, [0, 15], [50, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#f8fafc' }}>
      {/* Background video footage (if it exists) */}
      {config.footageFile && (
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(`footage/${config.footageFile}`)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </AbsoluteFill>
      )}

      {/* Text overlay */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: 80,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            padding: '40px 60px',
            borderRadius: 16,
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            {config.emoji}
          </div>
          <h2
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {config.title}
          </h2>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
