<template>
  <canvas ref="canvas" class="starfield" aria-hidden="true"></canvas>
</template>

<script>
export default {
  name: 'Starfield',
  props: {
    musicAmplitude: {
      type: Number,
      default: 0,
    },
    airportAmplitude: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      stars: [],
      mouseX: 0,
      mouseY: 0,
      rafId: null,
      resizeObserver: null,
      reducedMotion: false,
      canvasWidth: 0,
      canvasHeight: 0,
    };
  },
  mounted() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initCanvas();
    this.generateStars();
    this.setupResizeObserver();

    if (!this.reducedMotion) {
      window.addEventListener('mousemove', this.onMouseMove);
      this.startLoop();
    } else {
      this.renderFrame(performance.now());
    }
  },
  beforeUnmount() {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    window.removeEventListener('mousemove', this.onMouseMove);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      const parent = canvas.parentElement;
      const dpr = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      this.canvasWidth = width;
      this.canvasHeight = height;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
    },
    generateStars() {
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 100 : 200;
      const stars = [];

      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random(),
          y: Math.random(),
          size: 0.5 + Math.random() * 1.5,
          baseBrightness: 0.2 + Math.random() * 0.6,
          depth: 1 + Math.random() * 2,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }

      this.stars = stars;
    },
    setupResizeObserver() {
      const canvas = this.$refs.canvas;
      const parent = canvas.parentElement;

      this.resizeObserver = new ResizeObserver(() => {
        this.initCanvas();
        if (this.reducedMotion) {
          this.renderFrame(performance.now());
        }
      });

      this.resizeObserver.observe(parent);
    },
    onMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
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
    renderFrame(time) {
      const canvas = this.$refs.canvas;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const width = this.canvasWidth;
      const height = this.canvasHeight;

      ctx.clearRect(0, 0, width, height);

      const isMobile = window.innerWidth < 768;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];

        // Calculate parallax offset
        let offsetX, offsetY;
        if (isMobile) {
          const drift = Math.sin(time * 0.0001) * 20;
          offsetX = drift * star.depth * 0.02;
          offsetY = drift * star.depth * 0.015;
        } else {
          offsetX = (this.mouseX - centerX) * star.depth * 0.02;
          offsetY = (this.mouseY - centerY) * star.depth * 0.015;
        }

        // Calculate screen position with wrapping
        let sx = star.x * width + offsetX;
        let sy = star.y * height + offsetY;

        // Wrap stars that drift off-screen
        sx = ((sx % width) + width) % width;
        sy = ((sy % height) + height) % height;

        // Audio-modulated brightness
        let brightness = star.baseBrightness + this.musicAmplitude * 0.2;

        // Airport amplitude modulates twinkle
        const twinkleSpeed = 0.003 + this.airportAmplitude * 0.01;
        const twinkle = Math.sin(time * twinkleSpeed + star.twinkleOffset) * 0.15;
        brightness += twinkle;

        // Clamp brightness to valid range
        brightness = Math.max(0, Math.min(1, brightness));

        // Draw star
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.fill();
      }
    },
  },
};
</script>

<style>
.starfield {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
