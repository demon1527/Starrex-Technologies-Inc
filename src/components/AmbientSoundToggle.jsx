import { useEffect, useState } from "react";
import "../styles/AmbientSound.css";
import audioManager from "../utils/audioManager";

function AmbientSoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const stopAudio = () => {
      audioManager.stopAll();
      setIsPlaying(false);
    };

    window.addEventListener("pagehide", stopAudio);
    return () => {
      window.removeEventListener("pagehide", stopAudio);
      stopAudio();
    };
  }, []);

  const toggleSound = async () => {
    if (isPlaying) {
      audioManager.disable();
      setIsPlaying(false);
      return;
    }

    const started = await audioManager.enable();
    setIsPlaying(started);
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
