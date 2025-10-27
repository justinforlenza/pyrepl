export const VIDEO_CONFIG = {
  fps: 30,
  width: 1920,
  height: 1080,
  durationInSeconds: 30,
}

export interface SceneConfig {
  name: string
  durationInSeconds: number
  title?: string
  subtitle?: string
  emoji?: string
  footageFile?: string
  voiceover?: string
}

export const SCENES: SceneConfig[] = [
  {
    name: 'hook',
    durationInSeconds: 5,
    title: 'PyREPL',
    subtitle: 'Python. Anywhere. No setup.',
    // voiceover: 'Python. Anywhere. No setup.',
  },
  {
    name: 'browser-based',
    durationInSeconds: 7,
    title: 'Runs in Your Browser',
    emoji: '🌐',
    footageFile: 'run-code.mp4',
    // voiceover: 'Write and run Python code directly in your browser—powered by WebAssembly.',
  },
  {
    name: 'sharing',
    durationInSeconds: 7,
    title: 'Share Instantly',
    emoji: '🔗',
    footageFile: 'share-code.mp4',
    // voiceover: 'Share your code with a single click. No login, no friction.',
  },
  {
    name: 'multiple-repls',
    durationInSeconds: 5,
    title: 'Multiple REPLs',
    emoji: '📁',
    footageFile: 'manage-repls.mp4',
    // voiceover: 'Manage multiple sessions—keep your projects organized.',
  },
  {
    name: 'cta',
    durationInSeconds: 6,
    title: '100% Free',
    subtitle: 'No Installation • No Login • Always Free',
    // voiceover: 'And it\'s completely free.',
  },
]

export const AUDIO_CONFIG = {
  backgroundMusic: 'background.mp3', // Add your music file to public/audio/
  musicVolume: 0.3,
  voiceoverVolume: 1.0,
}

export const COLORS = {
  primary: '#0ea5e9', // blue-500
  background: '#f8fafc', // slate-50
  text: '#1e293b', // slate-800
  accent: '#10b981', // green-500
}
