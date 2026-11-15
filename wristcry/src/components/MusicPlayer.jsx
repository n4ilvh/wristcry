
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
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState("AUDIO SYSTEM READY");
  const [muteClicks, setMuteClicks] = useState(0);

  const soundRef = useRef(null);
  const shouldPlayRef = useRef(false);

  const currentTrack = tracks[trackIndex];

  // Create audio instance when track changes
  useEffect(() => {
    const sound = new Howl({
      src: [currentTrack.src],
      volume: volume,
      html5: true,

      onplay: () => {
        setIsPlaying(true);
        setStatus("NOW PLAYING");
      },

      onpause: () => {
        setIsPlaying(false);
        setStatus("PLAYBACK PAUSED");
      },

      onend: () => {
        setTrackIndex((prev) => (prev + 1) % tracks.length);
      },

      onloaderror: () => {
        setStatus("ERROR: TRACK NOT FOUND");
      },

      onplayerror: () => {
        setStatus("ERROR: CANNOT PLAY TRACK");
      },
    });

    soundRef.current = sound;

    if (shouldPlayRef.current) {
      sound.play();
    }

    return () => {
      sound.unload();
    };
  }, [trackIndex]);

  // Update volume
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  // Play
  const playMusic = () => {
    if (soundRef.current) {
      shouldPlayRef.current = true;
      soundRef.current.play();
    }
  };

  // Pause
  const pauseMusic = () => {
    shouldPlayRef.current = false;

    if (soundRef.current) {
      soundRef.current.pause();
    }
  };

  // Next track
  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  // Previous track
  const previousTrack = () => {
    setTrackIndex((prev) =>
      (prev - 1 + tracks.length) % tracks.length
    );
  };

  // Randomly malfunctioning mute button
  const handleMute = () => {
    const random = Math.random();
    setMuteClicks((prev) => prev + 1);

    if (random < 0.40) {
      // 40%: Successfully mute
      soundRef.current?.mute(true);
      setIsMuted(true);
      setStatus("AUDIO MUTED SUCCESSFULLY");
    } 
    
    else if (random < 0.65) {
      // 25%: Successfully unmute
      soundRef.current?.mute(false);
      setIsMuted(false);
      setStatus("AUDIO RESTORED");
    } 
    
    else if (random < 0.85) {
      // 20%: Refuse to work
      setStatus("ERROR 404: SILENCE NOT FOUND");
    } 
    
    else {
      // 15%: Randomly change volume
      const randomVolume = Math.random();
      setVolume(randomVolume);

      soundRef.current?.mute(false);
      setIsMuted(false);

      setStatus("VOLUME CONTROL COMPROMISED");
    }
  };

  return (
    <div className="w-full bg-[#ff0000] p-2 font-serif">

      {/* Main music panel */}
      <div className="border-[5px] border-[#ff00ff] bg-[#ffff00] p-3">

        {/* Header */}
        <div className="border-b-[4px] border-[#ff00ff] pb-2 mb-3">
          <h2 className="text-4xl font-bold italic text-[#ff0000] underline">
            ★ WRIST FM ★
          </h2>

          <p className="text-sm font-bold text-[#0000cc]">
            THE OFFICIAL CARPAL TUNNEL RADIO STATION
          </p>
        </div>

        {/* Current track */}
        <div className="mb-4">
          <p className="text-sm font-bold text-[#0000cc] underline">
            NOW PLAYING:
          </p>

          <h3 className="text-3xl font-bold text-black">
            {currentTrack.title}
          </h3>

          <p className="text-lg italic text-[#0000cc]">
            by {currentTrack.artist}
          </p>

          <p className="text-xs text-[#ff0000] font-bold mt-2">
            TRACK {trackIndex + 1} OF {tracks.length}
          </p>
        </div>

        {/* Media controls */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">

          <button
            onClick={previousTrack}
            className="bg-[#ff0000] border-2 border-black px-3 py-2 text-[#ffff00] font-bold hover:bg-[#cc0000] active:translate-y-1"
          >
            |◀ PREV
          </button>

          <button
            onClick={isPlaying ? pauseMusic : playMusic}
            className="bg-[#ff0000] border-2 border-black px-5 py-2 text-[#ffff00] font-bold hover:bg-[#cc0000] active:translate-y-1"
          >
            {isPlaying ? "Ⅱ PAUSE" : "▶ PLAY"}
          </button>

          <button
            onClick={nextTrack}
            className="bg-[#ff0000] border-2 border-black px-3 py-2 text-[#ffff00] font-bold hover:bg-[#cc0000] active:translate-y-1"
          >
            NEXT ▶|
          </button>

          <button
            onClick={handleMute}
            className="bg-[#0000cc] border-2 border-black px-3 py-2 text-white font-bold hover:bg-[#000099] active:translate-y-1"
          >
            {isMuted ? "UNMUTE??" : "MUTE??"}
          </button>

        </div>

        {/* Volume */}
        <div className="border-t-[3px] border-[#ff00ff] pt-3">

          <div className="flex justify-between text-sm font-bold text-[#0000cc]">
            <label>VOLUME CONTROL:</label>
            <span>{Math.round(volume * 100)}%</span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-[#ff0000] cursor-pointer"
          />

        </div>

        {/* Status */}
        <div className="bg-[#ff0000] border-2 border-black p-2 mt-3">
          <p className="text-[#ffff00] text-xs font-bold text-center">
            STATUS: {status}
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-[#0000cc] text-center font-bold mt-3">
          WARNING: EXCESSIVE LISTENING MAY CAUSE WRIST DAMAGE.
        </p>

      </div>

      {/* Footer */}
      <div className="text-center text-[#ffff00] text-xs font-bold mt-2">
        WRIST FM™ © 2006-2026 | ALL WRISTS RESERVED
        <br />
        MUTE ATTEMPTS: {muteClicks}
      </div>

    </div>
  );
}

export default MusicPlayer;
