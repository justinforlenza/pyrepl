import React from 'react';
import { Composition } from 'remotion';
import { MainComposition } from './MainComposition';
import { VIDEO_CONFIG } from './config';

export const PromoVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={MainComposition}
        durationInFrames={VIDEO_CONFIG.durationInSeconds * VIDEO_CONFIG.fps}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
    </>
  );
};
