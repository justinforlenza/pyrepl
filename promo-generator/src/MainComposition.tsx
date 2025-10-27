import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SCENES, VIDEO_CONFIG } from './config';
import { HookScene } from './scenes/HookScene';
import { BrowserBasedScene } from './scenes/BrowserBasedScene';
import { SharingScene } from './scenes/SharingScene';
import { MultipleReplsScene } from './scenes/MultipleReplsScene';
import { CTAScene } from './scenes/CTAScene';

export const MainComposition: React.FC = () => {
  let currentFrame = 0;

  const sceneComponents = {
    hook: HookScene,
    'browser-based': BrowserBasedScene,
    sharing: SharingScene,
    'multiple-repls': MultipleReplsScene,
    cta: CTAScene,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#f8fafc' }}>
      {SCENES.map((scene, index) => {
        const SceneComponent = sceneComponents[scene.name as keyof typeof sceneComponents];
        const durationInFrames = scene.durationInSeconds * VIDEO_CONFIG.fps;
        const from = currentFrame;
        currentFrame += durationInFrames;

        return (
          <Sequence
            key={scene.name}
            from={from}
            durationInFrames={durationInFrames}
          >
            <SceneComponent config={scene} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
