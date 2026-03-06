<template>
  <canvas ref="canvas" class="particles" role="img" aria-label="Audio visualization"></canvas>
</template>

<script>
export default {
  name: 'ParticleCanvas',
  props: {
    musicAmplitude: {
      type: Number,
      default: 0,
    },
    airportAmplitude: {
      type: Number,
      default: 0,
    },
    sphereRect: {
      type: Object,
      default: null,
    },
    isPlaying: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ctx: null,
      canvasWidth: 0,
      canvasHeight: 0,
      rafId: null,
      resizeObserver: null,
      reducedMotion: false,
      isMobile: false,
      musicParticles: [],
      airportParticles: [],
      lastTime: 0,
    };
  },
  computed: {
    musicCount() {
      if (this.reducedMotion) return 10;
      if (!this.isPlaying) return 20;
      return this.isMobile ? 25 : 50;
    },
    airportCount() {
      if (this.reducedMotion) return 10;
      if (!this.isPlaying) return 20;
      return this.isMobile ? 20 : 40;
    },
    orbitCenterX() {
      if (!this.sphereRect) return this.canvasWidth / 2;
      return this.sphereRect.x + this.sphereRect.width / 2;
    },
    orbitCenterY() {
      if (!this.sphereRect) return this.canvasHeight / 2;
      return this.sphereRect.y + this.sphereRect.height / 2;
    },
    sphereRadius() {
      if (!this.sphereRect) return 80;
      return this.sphereRect.width / 2;
    },
  },
  mounted() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.matchMedia('(max-width: 767px)').matches;

    this._mobileQuery = window.matchMedia('(max-width: 767px)');
    this._mobileHandler = (e) => {
      this.isMobile = e.matches;
      this.updateVisibleCounts();
    };
    this._mobileQuery.addEventListener('change', this._mobileHandler);

    this.initCanvas();
    this.createParticlePool();
    this.setupResizeObserver();

    if (this.reducedMotion) {
      this.renderStatic();
    } else {
      this.lastTime = performance.now();
      this.startLoop();
    }
  },
  beforeUnmount() {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this._mobileQuery && this._mobileHandler) {
      this._mobileQuery.removeEventListener('change', this._mobileHandler);
    }
  },
  watch: {
    isPlaying() {
      this.updateVisibleCounts();
    },
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      if (width === 0 || height === 0) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      this.canvasWidth = width;
      this.canvasHeight = height;

      this.ctx = canvas.getContext('2d');
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    createParticlePool() {
      // Always allocate desktop max so viewport changes don't overflow the pool
      const maxMusic = 60;
      const maxAirport = 50;

      this.musicParticles = [];
      for (let i = 0; i < maxMusic; i++) {
        this.musicParticles.push(this.createMusicParticle(i < this.musicCount));
      }

      this.airportParticles = [];
      for (let i = 0; i < maxAirport; i++) {
        this.airportParticles.push(this.createAirportParticle(i < this.airportCount));
      }
    },

    createMusicParticle(visible) {
      const r = this.sphereRadius;
      return {
        visible: visible,
        angle: Math.random() * Math.PI * 2,
        baseOrbitRadius: r + 20 + Math.random() * 60,
        orbitRadius: 0,
        size: 2 + Math.random() * 3,
        baseOpacity: 0.4 + Math.random() * 0.6,
        angularSpeed: 0.2 + Math.random() * 0.6,
        // Elliptical orbit: slight eccentricity
        eccentricity: 0.85 + Math.random() * 0.15,
        brightnessOffset: Math.random() * Math.PI * 2,
      };
    },

    createAirportParticle(visible) {
      const r = this.sphereRadius;
      return {
        visible: visible,
        angle: Math.random() * Math.PI * 2,
        baseOrbitRadius: r + 90 + Math.random() * 70,
        orbitRadius: 0,
        size: 1.5 + Math.random() * 2.5,
        baseOpacity: 0.3 + Math.random() * 0.7,
        angularSpeed: 0.15 + Math.random() * 0.5,
        eccentricity: 0.8 + Math.random() * 0.2,
        brightnessOffset: Math.random() * Math.PI * 2,
        // Jitter values for airport particles
        jitterX: 0,
        jitterY: 0,
        burstSpeed: 0,
      };
    },

    updateVisibleCounts() {
      const mc = this.musicCount;
      for (let i = 0; i < this.musicParticles.length; i++) {
        this.musicParticles[i].visible = i < mc;
      }
      const ac = this.airportCount;
      for (let i = 0; i < this.airportParticles.length; i++) {
        this.airportParticles[i].visible = i < ac;
      }
    },

    setupResizeObserver() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      this.resizeObserver = new ResizeObserver(() => {
        this.initCanvas();
        if (this.reducedMotion) {
          this.renderStatic();
        }
      });

      this.resizeObserver.observe(parent);
    },

    startLoop() {
      const loop = (time) => {
        if (!document.hidden) {
          this.renderFrame(time);
        }
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    },

    renderStatic() {
      const ctx = this.ctx;
      if (!ctx) return;

      const width = this.canvasWidth;
      const height = this.canvasHeight;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const cx = this.orbitCenterX;
      const cy = this.orbitCenterY;

      // Draw 10 music particles statically
      for (let i = 0; i < this.musicParticles.length; i++) {
        const p = this.musicParticles[i];
        if (!p.visible) continue;
        const x = cx + Math.cos(p.angle) * p.baseOrbitRadius;
        const y = cy + Math.sin(p.angle) * p.baseOrbitRadius * p.eccentricity;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 204, 102, ${p.baseOpacity * 0.6})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#FFCC66';
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      // Draw 10 airport particles statically
      for (let i = 0; i < this.airportParticles.length; i++) {
        const p = this.airportParticles[i];
        if (!p.visible) continue;
        const x = cx + Math.cos(p.angle) * p.baseOrbitRadius;
        const y = cy + Math.sin(p.angle) * p.baseOrbitRadius * p.eccentricity;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(68, 255, 187, ${p.baseOpacity * 0.5})`;
        ctx.fill();
      }
    },

    renderFrame(time) {
      const ctx = this.ctx;
      if (!ctx) return;

      const width = this.canvasWidth;
      const height = this.canvasHeight;
      if (width === 0 || height === 0) return;

      const dt = Math.min((time - this.lastTime) / 1000, 0.1); // seconds, capped at 100ms
      this.lastTime = time;

      // Trail effect: overlay semi-transparent background instead of clearRect
      ctx.fillStyle = 'rgba(8, 8, 18, 0.08)';
      ctx.fillRect(0, 0, width, height);

      const cx = this.orbitCenterX;
      const cy = this.orbitCenterY;

      // Read audio amplitudes from props (Main.vue samples once per frame)
      const musicAmp = this.isPlaying ? this.musicAmplitude : 0;
      const airportAmp = this.isPlaying ? this.airportAmplitude : 0;

      const speedMultiplier = this.isPlaying ? 1 : 0.1;

      // --- Music particles (inner orbit) ---
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#FFCC66';

      for (let i = 0; i < this.musicParticles.length; i++) {
        const p = this.musicParticles[i];
        if (!p.visible) continue;

        // Update angle
        p.angle += p.angularSpeed * dt * speedMultiplier;

        // Audio modulation: amplitude modulates orbit radius +/-15px
        const radiusMod = this.isPlaying ? musicAmp * 15 : 0;
        p.orbitRadius = p.baseOrbitRadius + radiusMod * Math.sin(p.angle * 2);

        // Position (elliptical orbit)
        const x = cx + Math.cos(p.angle) * p.orbitRadius;
        const y = cy + Math.sin(p.angle) * p.orbitRadius * p.eccentricity;

        // Frequency-modulated brightness
        const brightnessMod = this.isPlaying
          ? Math.sin(time * 0.003 + p.brightnessOffset) * musicAmp * 0.3
          : 0;
        const opacity = Math.max(0.4, Math.min(1.0, p.baseOpacity + brightnessMod));

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 204, 102, ${opacity})`;
        ctx.fill();
      }

      // Reset shadow for airport particles
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      // --- Airport particles (outer orbit) ---
      for (let i = 0; i < this.airportParticles.length; i++) {
        const p = this.airportParticles[i];
        if (!p.visible) continue;

        // Jittery movement: airport particles have random jitter
        const jitterStrength = 0.5 + airportAmp * 2;
        p.jitterX += (Math.random() - 0.5) * jitterStrength;
        p.jitterY += (Math.random() - 0.5) * jitterStrength;
        // Dampen jitter to prevent drift
        p.jitterX *= 0.92;
        p.jitterY *= 0.92;

        // Burst acceleration on voice activity (airport amplitude > threshold)
        if (this.isPlaying && airportAmp > 0.15) {
          p.burstSpeed = p.angularSpeed * (1 + airportAmp * 3);
        } else {
          p.burstSpeed *= 0.95; // decay
          if (p.burstSpeed < p.angularSpeed) {
            p.burstSpeed = p.angularSpeed;
          }
        }

        const effectiveSpeed = this.isPlaying ? p.burstSpeed || p.angularSpeed : p.angularSpeed;
        p.angle += effectiveSpeed * dt * speedMultiplier;

        // Audio modulation: amplitude modulates speed (already done above)
        p.orbitRadius = p.baseOrbitRadius;

        // Position (elliptical orbit + jitter)
        const x = cx + Math.cos(p.angle) * p.orbitRadius + p.jitterX;
        const y = cy + Math.sin(p.angle) * p.orbitRadius * p.eccentricity + p.jitterY;

        // Frequency-modulated brightness
        const brightnessMod = this.isPlaying
          ? Math.sin(time * 0.004 + p.brightnessOffset) * airportAmp * 0.4
          : 0;
        const opacity = Math.max(0.3, Math.min(1.0, p.baseOpacity + brightnessMod));

        // Frequency bands modulate visible count — hide some particles when amplitude is low
        if (this.isPlaying && airportAmp < 0.05 && i > this.airportCount * 0.6) {
          continue;
        }

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(68, 255, 187, ${opacity})`;
        ctx.fill();
      }
    },
  },
};
</script>

<style>
.particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
</style>
