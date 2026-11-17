import { useEffect, useRef, useState } from "react";
import "../styles/AmbientSound.css";

const FADE_SECONDS = 4;
const TARGET_VOLUME = 0.2;

function createAmbientSound(context) {
  const master = context.createGain();
  master.gain.value = 0;
  master.connect(context.destination);

  // A soft, warm sub-bass foundation — kept subtle so it never sounds like static.
  const layers = [
    { frequency: 65.41, type: "sine", volume: 0.13, detune: -3 },
    { frequency: 98, type: "sine", volume: 0.08, detune: 2 },
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

  // Warm, musical pad tones add the dreamy lo-fi harmony.
  const padNotes = [
    { frequency: 130.81, volume: 0.035, rate: 0.075, depth: 0.012 },
    { frequency: 164.81, volume: 0.026, rate: 0.061, depth: 0.009 },
    { frequency: 196, volume: 0.03, rate: 0.052, depth: 0.011 },
    { frequency: 246.94, volume: 0.018, rate: 0.043, depth: 0.007 },
    { frequency: 293.66, volume: 0.012, rate: 0.037, depth: 0.005 },
  ];

  const padOscillators = [];
  const movementOscillators = [];

  padNotes.forEach(({ frequency, volume, rate, depth }) => {
    const oscillator = context.createOscillator();
    const noteGain = context.createGain();
    const drift = context.createOscillator();
    const driftGain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    noteGain.gain.value = volume;

    // Each note gently swells and recedes at its own pace.
    drift.type = "sine";
    drift.frequency.value = rate;
    driftGain.gain.value = depth;
    drift.connect(driftGain);
    driftGain.connect(noteGain.gain);

    oscillator.connect(noteGain);
    noteGain.connect(master);
    oscillator.start();
    drift.start();

    padOscillators.push(oscillator);
    movementOscillators.push(drift);
  });

  // Very quiet, filtered air gives the mix a sense of distant space.
  const bufferSize = context.sampleRate * 3;
  const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const channel = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    channel[i] = (Math.random() * 2 - 1) * 0.1;
  }

  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const noiseGain = context.createGain();

  noise.buffer = noiseBuffer;
  noise.loop = true;
  filter.type = "lowpass";
  filter.frequency.value = 650;
  filter.Q.value = 0.35;
  noiseGain.gain.value = 0.035;

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start();

  // Slow filter drift creates gentle movement rather than a static drone.
  const filterMovement = context.createOscillator();
  const filterMovementGain = context.createGain();
  filterMovement.frequency.value = 0.035;
  filterMovementGain.gain.value = 220;
  filterMovement.connect(filterMovementGain);
  filterMovementGain.connect(filter.frequency);
  filterMovement.start();

  return {
    master,
    oscillators,
    padOscillators,
    movementOscillators,
    noise,
    filterMovement,
  };
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

      if (typeof audio.master.gain.cancelAndHoldAtTime === "function") {
        audio.master.gain.cancelAndHoldAtTime(now);
      } else {
        audio.master.gain.cancelScheduledValues(now);
        audio.master.gain.setValueAtTime(audio.master.gain.value, now);
      }
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
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        {isPlaying ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <path d="m16 9 5 6m0-6-5 6" />
        )}
      </svg>
      <span className="ambient-sound-tooltip">
        {isPlaying ? "Mute Ambient Sound" : "Enable Ambient Sound"}
      </span>
    </button>
  );
}

export default AmbientSoundToggle;
