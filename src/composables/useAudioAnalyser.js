/**
 * useAudioAnalyser — Web Audio API frequency analyser for audio-reactive visuals.
 *
 * Wraps the Web Audio API to provide real-time frequency data from <audio> elements.
 * Designed for use with Options API components (no Vue imports).
 *
 * Usage:
 *   const audio = useAudioAnalyser();
 *   audio.connect(audioElement);        // in mounted()
 *   const amp = audio.getAmplitude();   // in rAF loop, returns 0–1
 *   audio.disconnect();                 // in beforeUnmount()
 */

// ---------------------------------------------------------------------------
// Shared AudioContext singleton — browsers limit to ~6 AudioContexts total,
// so every analyser instance must share the same context.
// ---------------------------------------------------------------------------
let sharedContext = null;

function getAudioContext() {
  if (!sharedContext) {
    try {
      sharedContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('useAudioAnalyser: Web Audio API unavailable', e);
      return null;
    }
  }
  return sharedContext;
}

// ---------------------------------------------------------------------------
// MediaElementSource cache — calling createMediaElementSource() twice on the
// same <audio> element throws an InvalidStateError. A WeakMap lets us reuse
// the source node without preventing garbage-collection of detached elements.
// ---------------------------------------------------------------------------
const sourceCache = new WeakMap();

/**
 * Factory function that returns an audio analyser instance.
 *
 * @returns {{ analyser: AnalyserNode|null, frequencyData: Uint8Array|null, connect: Function, disconnect: Function, getAmplitude: Function }}
 */
export function useAudioAnalyser() {
  let analyser = null;
  let frequencyData = null;

  /**
   * Connect to an <audio> (or <video>) element and start analysing.
   *
   * - Lazily creates / resumes the shared AudioContext (handles autoplay policy).
   * - Reuses a cached MediaElementSourceNode if one already exists for the element.
   * - Wires the graph: source → analyser → destination so audio still plays
   *   through speakers.
   *
   * @param {HTMLMediaElement} audioElement — the <audio> element to analyse
   */
  function connect(audioElement) {
    if (!audioElement) return;

    // Clean up any previous connection before rewiring
    disconnect();

    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Get or create MediaElementSource for this element (cached to avoid double-bind error)
    let source = sourceCache.get(audioElement);
    if (!source) {
      source = ctx.createMediaElementSource(audioElement);
      sourceCache.set(audioElement, source);
    }

    // Create AnalyserNode — fftSize 256 gives 128 frequency bins, enough for
    // smooth visual reactivity without excessive CPU cost.
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    // Disconnect source from any previous outputs before rewiring
    source.disconnect();

    // Wire the audio graph: source → analyser → destination
    // Routing through the analyser keeps audio audible in speakers.
    source.connect(analyser);
    analyser.connect(ctx.destination);

    // Pre-allocate the typed array for getByteFrequencyData()
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
  }

  /**
   * Disconnect the analyser from the audio graph.
   *
   * - Does NOT close the shared AudioContext (other instances may use it).
   * - Does NOT disconnect source→analyser (the cached source is reused; a
   *   future connect() call on the same element would fail otherwise).
   */
  function disconnect() {
    if (analyser) {
      try {
        analyser.disconnect();
      } catch (_) {
        // Already disconnected — safe to ignore
      }
      analyser = null;
      frequencyData = null;
    }
  }

  /**
   * Sample current frequency data and return the average amplitude (0–1).
   *
   * Call this once per animation frame inside a requestAnimationFrame loop.
   *
   * @returns {number} Normalised amplitude where 0 = silence, 1 = max volume
   */
  function getAmplitude() {
    if (!analyser || !frequencyData) return 0;

    analyser.getByteFrequencyData(frequencyData);

    // Sum all frequency bins and normalise: each bin is 0–255, so dividing
    // the average by 255 maps the result to 0–1.
    let sum = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      sum += frequencyData[i];
    }

    return sum / (frequencyData.length * 255);
  }

  return {
    /** @type {AnalyserNode|null} Direct access to the AnalyserNode (read-only intent) */
    get analyser() { return analyser; },
    /** @type {Uint8Array|null} Raw frequency bin data (updated by getAmplitude) */
    get frequencyData() { return frequencyData; },
    connect,
    disconnect,
    getAmplitude,
  };
}
