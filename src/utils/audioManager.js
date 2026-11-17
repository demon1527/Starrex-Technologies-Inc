const MUSIC_PATH = "/audio/liminal-ambient-18-percent.mp3";
const PLANET_WHOOSH_PATH = "/audio/planet-arrival-whoosh.mp3";
const PAGE_SWISH_PATH = "/audio/page-transition-swish.mp3";
const FADE_DURATION = 4000;

let music = null;
let enabled = false;
let fadeTimer = null;
const activeEffects = new Set();

function getMusic() {
  if (!music) {
    music = new Audio(MUSIC_PATH);
    music.loop = true;
    music.preload = "auto";
    music.volume = 0;
  }
  return music;
}

function clearFade() {
  if (fadeTimer) {
    window.clearInterval(fadeTimer);
    fadeTimer = null;
  }
}

function fadeMusic(target, onComplete) {
  const track = getMusic();
  clearFade();

  const startVolume = track.volume;
  const startTime = performance.now();

  fadeTimer = window.setInterval(() => {
    const progress = Math.min((performance.now() - startTime) / FADE_DURATION, 1);
    track.volume = startVolume + (target - startVolume) * progress;

    if (progress >= 1) {
      clearFade();
      if (onComplete) onComplete();
    }
  }, 40);
}

async function enable() {
  const track = getMusic();
  enabled = true;

  try {
    await track.play();
    fadeMusic(1);
    return true;
  } catch (error) {
    enabled = false;
    console.error("Unable to play Starrex ambient music:", error);
    return false;
  }
}

function disable() {
  enabled = false;
  fadeMusic(0, () => {
    getMusic().pause();
  });

  activeEffects.forEach((effect) => {
    effect.pause();
    effect.currentTime = 0;
  });
  activeEffects.clear();
}

function playEffect(path, volume) {
  if (!enabled) return;

  const effect = new Audio(path);
  effect.preload = "auto";
  effect.volume = volume;
  activeEffects.add(effect);

  const cleanup = () => activeEffects.delete(effect);
  effect.addEventListener("ended", cleanup, { once: true });
  effect.addEventListener("error", cleanup, { once: true });
  effect.play().catch((error) => {
    cleanup();
    console.error("Unable to play Starrex sound effect:", error);
  });
}

function playPlanetArrival() {
  playEffect(PLANET_WHOOSH_PATH, 0.62);
}

function playPageTransition() {
  playEffect(PAGE_SWISH_PATH, 0.38);
}

function stopAll() {
  enabled = false;
  clearFade();

  if (music) {
    music.pause();
    music.currentTime = 0;
    music.volume = 0;
  }

  activeEffects.forEach((effect) => {
    effect.pause();
    effect.currentTime = 0;
  });
  activeEffects.clear();
}

const audioManager = {
  enable,
  disable,
  stopAll,
  playPlanetArrival,
  playPageTransition,
  isEnabled: () => enabled,
};

export default audioManager;
