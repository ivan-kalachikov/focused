<template>
  <div class="oscilloscope" role="img" :aria-label="t('ui.waveformLabel')">
    <canvas ref="canvas" class="oscilloscope__canvas"></canvas>
    <div class="oscilloscope__labels">
      <span class="oscilloscope__label oscilloscope__label--atc">ATC</span>
      <span class="oscilloscope__label oscilloscope__label--mus">MUS</span>
    </div>
    <span class="oscilloscope__db">{{ dbDisplay }}</span>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'Oscilloscope',
  props: {
    atcAnalyser: { type: Object, default: null },
    musicAnalyser: { type: Object, default: null },
    isPlaying: { type: Boolean, default: false },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      animFrameId: null,
      dbDisplay: '-∞dB',
      resizeObserver: null,
    };
  },
  mounted() {
    this.setupCanvas();
    this.startDrawLoop();
  },
  beforeUnmount() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  },
  methods: {
    setupCanvas() {
      const canvas = this.$refs.canvas;
      this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
      this.resizeObserver.observe(canvas.parentElement);
      this.resizeCanvas();
    },

    resizeCanvas() {
      const canvas = this.$refs.canvas;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
    },

    startDrawLoop() {
      const draw = () => {
        if (!document.hidden) {
          this.drawFrame();
        }
        this.animFrameId = requestAnimationFrame(draw);
      };
      draw();
    },

    drawFrame() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Draw grid
      this.drawGrid(ctx, w, h);

      // Draw divider
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Get waveform data
      const atcData = this.atcAnalyser ? this.atcAnalyser.getWaveform() : null;
      const musicData = this.musicAnalyser ? this.musicAnalyser.getWaveform() : null;
      const t = performance.now();

      // Draw ATC waveform (top half)
      this.drawWaveform(ctx, atcData, 0, h / 2, w, t, 1.0);

      // Draw Music waveform (bottom half, slightly dimmer)
      this.drawWaveform(ctx, musicData, h / 2, h / 2, w, t, 0.5);

      // Update dB readout from ATC
      this.updateDb(atcData);
    },

    drawGrid(ctx, w, h) {
      // Major gridlines every 25%
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const x = (w / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let i = 1; i < 4; i++) {
        const y = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    },

    drawWaveform(ctx, data, yOffset, halfH, w, time, opacity) {
      const len = data ? data.length : 256;

      // Generate data: real if available, idle sine wave if not
      const getY = (i) => {
        if (data && this.isPlaying) {
          return data[i];
        }
        // Idle sine wave
        return 128 + Math.sin((i / len) * Math.PI * 4 + time * 0.001) * 3;
      };

      const centerY = yOffset + halfH / 2;

      // Build path once
      const buildPath = () => {
        ctx.beginPath();
        for (let i = 0; i < len; i++) {
          const x = (i / len) * w;
          const v = getY(i) / 128.0;
          const y = centerY + ((v - 1) * halfH * 0.4);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      };

      // Triple draw for phosphor glow
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Layer 1: wide glow
      ctx.globalAlpha = 0.08 * opacity;
      ctx.strokeStyle = '#00FF41';
      ctx.lineWidth = 12;
      ctx.filter = 'blur(6px)';
      buildPath();
      ctx.stroke();

      // Layer 2: narrow glow
      ctx.globalAlpha = 0.3 * opacity;
      ctx.lineWidth = 4;
      ctx.filter = 'blur(2px)';
      buildPath();
      ctx.stroke();

      // Layer 3: core line
      ctx.globalAlpha = 1.0 * opacity;
      ctx.lineWidth = 1.5;
      ctx.filter = 'none';
      buildPath();
      ctx.stroke();

      ctx.restore();
    },

    updateDb(data) {
      if (!data || !this.isPlaying) {
        this.dbDisplay = '-∞dB';
        return;
      }
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      const db = rms > 0 ? Math.round(20 * Math.log10(rms)) : -Infinity;
      this.dbDisplay = isFinite(db) ? `${db}dB` : '-∞dB';
    },
  },
};
</script>

<style>
.oscilloscope {
  grid-area: visualizer;
  position: relative;
  min-height: 200px;
  overflow: hidden;
}

.oscilloscope__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.oscilloscope__labels {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  pointer-events: none;
}

.oscilloscope__label {
  font-size: 11px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-dim);
  padding: 8px;
}

.oscilloscope__label--atc {
  flex: 1;
}

.oscilloscope__label--mus {
  flex: 1;
}

.oscilloscope__db {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  pointer-events: none;
}

/* Responsive */
@media (max-width: 1023px) {
  .oscilloscope { min-height: 160px; }
}
@media (max-width: 767px) {
  .oscilloscope { min-height: 120px; }
}
@media (max-width: 479px) {
  .oscilloscope { min-height: 100px; }
}
</style>
