
import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";

const tracks = [
  {
    title: "Wrist Cry",
    artist: "Bladee",
    src: "/audio/track1.mp3",
  },
  {
    title: "Shawty Thro It Backk",
    artist: "xaviersobased",
    src: "/audio/track2.mp3",
  },
];

function MusicPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const soundRef = useRef(null);
  const shouldPlayRef = useRef(false);

  const currentTrack = tracks[trackIndex];

  // Create a new audio instance when the track changes
  useEffect(() => {
    const sound = new Howl({
      src: [currentTrack.src],
      volume: volume,
      html5: true,

      onend: () => {
        setTrackIndex((prev) => (prev + 1) % tracks.length);
      },
    });

    soundRef.current = sound;

    // Automatically play the next track if music was already playing
    if (shouldPlayRef.current) {
      sound.play();
    }

    return () => {
      sound.unload();
    };
  }, [trackIndex]);

  // Update volume when the slider changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  // Play music
  const playMusic = () => {
    if (soundRef.current) {
      shouldPlayRef.current = true;
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  // Pause music
  const pauseMusic = () => {
    if (soundRef.current) {
      shouldPlayRef.current = false;
      soundRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Skip to the next track
  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  // Go to the previous track
  const previousTrack = () => {
    setTrackIndex((prev) =>
      (prev - 1 + tracks.length) % tracks.length
    );
  };

  return (
    <div className="bg-black text-lime-400 border-4 border-lime-400 p-5 w-full max-w-md">

      <div className="border border-lime-400 p-3 mb-4">
        <p className="text-xs text-gray-400">
          NOW PLAYING:
        </p>

        <h3 className="text-xl font-bold">
          {currentTrack.title}
        </h3>

        <p className="text-sm">
          {currentTrack.artist}
        </p>
      </div>

      {/* Media buttons */}
      <div className="flex justify-center items-center gap-4">

        <button
          onClick={previousTrack}
          className="border border-lime-400 px-4 py-2 hover:bg-lime-400 hover:text-black"
        >
          |◀
        </button>

        <button
          onClick={isPlaying ? pauseMusic : playMusic}
          className="bg-lime-400 text-black font-black px-6 py-3 hover:scale-110"
        >
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>

        <button
          onClick={nextTrack}
          className="border border-lime-400 px-4 py-2 hover:bg-lime-400 hover:text-black"
        >
          ▶|
        </button>

      </div>

      {/* Volume slider */}
      <div className="mt-5">
        <label className="text-xs">
          VOLUME: {Math.round(volume * 100)}%
        </label>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-lime-400"
        />
      </div>

    </div>
  );
}

export default MusicPlayer;
