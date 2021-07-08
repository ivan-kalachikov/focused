const safePlay = (el) => {
  if (el.readyState > 2) {
    el.play().catch(() => {});
    return;
  }
  const cb = () => {
    el.removeEventListener('canplay', cb);
    el.play().catch(() => {});
  };
  el.addEventListener('canplay', cb);
};

const safePause = (el) => {
  if (el.readyState > 2) {
    el.pause();
    return;
  }
  const cb = () => {
    el.removeEventListener('playing', cb);
    el.pause();
  };
  el.addEventListener('playing', cb);
};

const safeLoad = (el) => {
  if (el.readyState > 2) {
    el.load();
    return;
  }
  const cb = () => {
    el.removeEventListener('canplay', cb);
    el.load();
  };
  el.addEventListener('canplay', cb);
};

export {
  safePlay, safePause, safeLoad,
};
