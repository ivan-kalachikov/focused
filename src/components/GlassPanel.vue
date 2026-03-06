<template>
  <div
    class="panel"
    :class="[tiltClass]"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GlassPanel',
  props: {
    tilt: {
      type: String,
      default: 'none',
    },
    accentColor: {
      type: String,
      default: '--accent-neutral',
    },
  },
  computed: {
    tiltClass() {
      if (this.tilt === 'left') return 'panel--left';
      if (this.tilt === 'right') return 'panel--right';
      return '';
    },
  },
  methods: {
    onMouseMove(e) {
      if (window.innerWidth < 768) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const baseY = this.tilt === 'left' ? 2 : this.tilt === 'right' ? -2 : 0;
      e.currentTarget.style.transform = `perspective(800px) rotateY(${baseY + x * 3}deg) rotateX(${-y * 2}deg)`;
    },
    onMouseLeave(e) {
      if (window.innerWidth < 768) return;
      e.currentTarget.style.transition = 'transform 0.4s ease-out';
      if (this.tilt === 'left') {
        e.currentTarget.style.transform = 'perspective(800px) rotateY(2deg)';
      } else if (this.tilt === 'right') {
        e.currentTarget.style.transform = 'perspective(800px) rotateY(-2deg)';
      } else {
        e.currentTarget.style.transform = '';
      }
    },
  },
};
</script>

<style scoped>
.panel {
  background: var(--surface);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 24px;
  width: 320px;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, transform 0.4s ease-out;
  z-index: 2;
}

.panel:hover,
.panel:focus-within {
  background: var(--surface-active);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-color: var(--glass-border-active);
}

.panel--left {
  transform: perspective(800px) rotateY(2deg);
}
.panel--right {
  transform: perspective(800px) rotateY(-2deg);
}

@media (max-width: 1023px) {
  .panel { max-width: 280px; }
  .panel--left { transform: perspective(800px) rotateY(1deg); }
  .panel--right { transform: perspective(800px) rotateY(-1deg); }
}
@media (max-width: 767px) {
  .panel {
    width: 100%;
    max-width: none;
    max-height: none;
    transform: none !important;
    border-radius: 0;
    padding: 16px;
  }
}
</style>
