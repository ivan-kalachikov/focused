// Shared AudioContext singleton (browser limits to ~6 contexts)
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// WeakMap to avoid re-creating MediaElementSource for same <audio>
const sourceMap = new WeakMap();

export function useAudioAnalyser(options = {}) {
  const {
    fftSize = 2048,
    smoothingTimeConstant = 0.8,
  } = options;

  let analyser = null;
  let source = null;
  const waveform = new Uint8Array(fftSize / 2);
  const frequency = new Uint8Array(fftSize / 2);

  function connect(audioElement) {
    if (!audioElement) return;

    const ctx = getAudioContext();

    // Reuse existing MediaElementSource if already created for this element
    if (sourceMap.has(audioElement)) {
      source = sourceMap.get(audioElement);
    } else {
      source = ctx.createMediaElementSource(audioElement);
      sourceMap.set(audioElement, source);
    }

    analyser = ctx.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = smoothingTimeConstant;

    source.connect(analyser);
    analyser.connect(ctx.destination);
  }

  function disconnect() {
    if (analyser) {
      try { analyser.disconnect(); } catch (e) { /* already disconnected */ }
      analyser = null;
    }
  }

  function getWaveform() {
    if (analyser) {
      analyser.getByteTimeDomainData(waveform);
    } else {
      waveform.fill(128); // silence
    }
    return waveform;
  }

  function getFrequency() {
    if (analyser) {
      analyser.getByteFrequencyData(frequency);
    } else {
      frequency.fill(0);
    }
    return frequency;
  }

  function resume() {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  return {
    connect,
    disconnect,
    resume,
    getWaveform,
    getFrequency,
  };
}
