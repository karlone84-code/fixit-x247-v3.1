
/**
 * Kernel Sound System x247 v3.1
 */

const SOUND_MAP = {
  sos: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3', // Alert 🚨
  payment: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3', // Cha-ching 💶
  message: 'https://assets.mixkit.co/active_storage/sfx/2352/2352-preview.mp3' // Pop 🤖
};

let audioContext: AudioContext | null = null;
const buffers: Record<string, AudioBuffer> = {};

export const initSoundSystem = async () => {
  if (audioContext) return;
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();

    for (const [key, url] of Object.entries(SOUND_MAP)) {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      buffers[key] = await audioContext.decodeAudioData(arrayBuffer);
    }
    console.log('[X247 SOUND] Kernel Audio Ready.');
  } catch (err) {
    console.warn('[X247 SOUND] Audio Init Failed:', err);
  }
};

export const playNotificationSound = (type: keyof typeof SOUND_MAP = 'message') => {
  if (!audioContext || !buffers[type]) {
    initSoundSystem();
    return;
  }
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffers[type];
  source.connect(audioContext.destination);
  
  // Variação tonal para SOS ser mais agudo
  if (type === 'sos') {
    source.playbackRate.value = 1.2;
  } else {
    source.playbackRate.value = 0.95 + Math.random() * 0.1;
  }
  
  source.start(0);
};
