import { useEffect, useRef, useState } from "react";
import "../styles/AmbientSound.css";

const FADE_SECONDS = 4;
const TARGET_VOLUME = 0.16;

function createAmbientSound(context) {
  const master = context.createGain();
  master.gain.value = 0;
  master.connect(context.destination);

  // Layered low-frequency tones create a quiet, space-like drone.
  const layers = [
    { frequency: 48, type: "sine", volume: 0.34, detune: -4 },
    { frequency: 73.4, type: "sine", volume: 0.2, detune: 3 },
    { frequency: 110, type: "triangle", volume: 0.08, detune: -7 },
  ];

  const oscillators = layers.map(({ frequency, type, volume, detune }) => {
    const oscillator = context.createOscillator();
    const layerGain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;
    layerGain.gain.value = volume;

    oscillator.connect(layerGain);
    layerGain.connect(master);
    oscillator.start();

    return oscillator;
  });

  // Soft filtered noise adds a distant, airy texture without a loud hiss.
  const bufferSize = context.sampleRate * 3;
  const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const channel = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    channel[i] = (Math.random() * 2 - 1) * 0.22;
  }

  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const noiseGain = context.createGain();

  noise.buffer = noiseBuffer;
  noise.loop = true;
  filter.type = "lowpass";
  filter.frequency.value = 420;
  filter.Q.value = 0.45;
  noiseGain.gain.value = 0.12;

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start();

  // A very slow LFO gently moves the atmospheric filter.
  const movement = context.createOscillator();
  const movementGain = context.createGain();
  movement.frequency.value = 0.055;
  movementGain.gain.value = 115;
  movement.connect(movementGain);
  movementGain.connect(filter.frequency);
  movement.start();

  return { master, oscillators, noise, movement };
}

function AmbientSoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const closeAudio = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.context.close().catch(() => {});
      audioRef.current = null;
      isPlayingRef.current = false;
    };

    window.addEventListener("pagehide", closeAudio);
    return () => {
      window.removeEventListener("pagehide", closeAudio);
      closeAudio();
    };
  }, []);

  const toggleSound = async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioRef.current) {
      const context = new AudioContextClass();
      audioRef.current = {
        context,
        ...createAmbientSound(context),
      };
    }

    const audio = audioRef.current;
    try {
      if (audio.context.state === "suspended") {
        await audio.context.resume();
      }

      const now = audio.context.currentTime;
      const nextPlaying = !isPlayingRef.current;

      audio.master.gain.cancelScheduledValues(now);
      audio.master.gain.setValueAtTime(audio.master.gain.value, now);
      audio.master.gain.linearRampToValueAtTime(
        nextPlaying ? TARGET_VOLUME : 0,
        now + FADE_SECONDS
      );

      isPlayingRef.current = nextPlaying;
      setIsPlaying(nextPlaying);
    } catch (error) {
      console.error("Unable to start Starrex ambient audio:", error);
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  };

  return (
    <button
      className={`ambient-sound-toggle ${isPlaying ? "is-playing" : ""}`}
      type="button"
      onClick={toggleSound}
      aria-label={isPlaying ? "Mute ambient sound" : "Enable ambient sound"}
      aria-pressed={isPlaying}
      title={isPlaying ? "Mute Ambient Sound" : "Enable Ambient Sound"}
    >
      {isPlaying ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          <path d="m16 9 5 6" />
          <path d="m21 9-5 6" />
        </svg>
      )}
      <span className="ambient-sound-tooltip">
        {isPlaying ? "Mute Ambient Sound" : "Enable Ambient Sound"}
      </span>
    </button>
  );
}

export default AmbientSoundToggle;
