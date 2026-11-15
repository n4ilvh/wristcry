
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

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const playMusic = () => {
    if (soundRef.current) {
      shouldPlayRef.current = true;
      soundRef.current.play();
    }
  };

  const pauseMusic = () => {
    shouldPlayRef.current = false;
    soundRef.current?.pause();
  };

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const previousTrack = () => {
    setTrackIndex((prev) =>
      (prev - 1 + tracks.length) % tracks.length
    );
  };

  const handleMute = () => {
    const random = Math.random();
    setMuteClicks((prev) => prev + 1);

    if (random < 0.40) {
      soundRef.current?.mute(true);
      setIsMuted(true);
      setStatus("AUDIO MUTED SUCCESSFULLY");
    } else if (random < 0.65) {
      soundRef.current?.mute(false);
      setIsMuted(false);
      setStatus("AUDIO RESTORED");
    } else if (random < 0.85) {
      setStatus("ERROR 404: SILENCE NOT FOUND");
    } else {
      const randomVolume = Math.random();
      setVolume(randomVolume);

      soundRef.current?.mute(false);
      setIsMuted(false);

      setStatus("VOLUME CONTROL COMPROMISED");
    }
  };

  return (
    <div className="w-full bg-[#ff0000] p-2 font-serif">

      {/* Main player container */}
      <div className="border-[5px] border-[#ff00ff] bg-[#ffff00] p-2 md:p-3">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b-[3px] border-[#ff00ff] pb-2 mb-2">

          <h2 className="text-2xl md:text-3xl font-bold italic text-[#ff0000] underline">
            ★ WRIST FM ★
          </h2>

          <p className="text-xs font-bold text-[#0000cc]">
            THE OFFICIAL CARPAL TUNNEL RADIO STATION
          </p>

        </div>

        {/* Track information + controls in same row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">

          {/* Track information */}
          <div className="flex-1 min-w-0">

            <p className="text-xs font-bold text-[#0000cc] underline">
              NOW PLAYING:
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-black truncate">
              {currentTrack.title}
            </h3>

            <p className="text-sm italic text-[#0000cc]">
              by {currentTrack.artist}
            </p>

            <p className="text-xs text-[#ff0000] font-bold mt-1">
              TRACK {trackIndex + 1} OF {tracks.length}
            </p>

          </div>

          {/* Controls + volume */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">

            {/* Media controls */}
            <div className="flex flex-wrap gap-1 justify-start sm:justify-end">

              <button
                onClick={previousTrack}
                className="bg-[#ff0000] border-2 border-black px-2 py-2 text-sm text-[#ffff00] font-bold hover:bg-[#cc0000] active:translate-y-1"
              >
                |◀ PREV
              </button>

              <button
                onClick={isPlaying ? pauseMusic : playMusic}
                className="bg-[#ff0000] border-2 border-black px-3 py-2 text-sm text-[#ffff00] font-bold hover:bg-[#cc0000] active:translate-y-1"
              >
                {isPlaying ? "Ⅱ PAUSE" : "▶ PLAY"}
              </button>

              <button
                onClick={nextTrack}
                className="bg-[#ff0000] border-2 border-black px-2 py-2 text-sm text-[#ffff00] font-bold hover:bg-[#cc0000] active:translate-y-1"
              >
                NEXT ▶|
              </button>

              <button
                onClick={handleMute}
                className="bg-[#0000cc] border-2 border-black px-3 py-2 text-sm text-white font-bold hover:bg-[#000099] active:translate-y-1"
              >
                {isMuted ? "UNMUTE??" : "MUTE??"}
              </button>

            </div>

            {/* Volume */}
            <div>

              <div className="flex justify-between text-xs font-bold text-[#0000cc]">
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
                className="w-full h-3 accent-[#ff0000] cursor-pointer"
              />

            </div>

          </div>

        </div>

        {/* Status bar */}
        <div className="bg-[#ff0000] border-2 border-black px-2 py-1 mt-2 flex flex-wrap justify-between items-center gap-1">

          <p className="text-[#ffff00] text-xs font-bold">
            STATUS: {status}
          </p>

          <p className="text-[#ffff00] text-xs font-bold">
            MUTE ATTEMPTS: {muteClicks}
          </p>

        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-[#ffff00] text-[10px] font-bold mt-1">
        WRIST FM™ © 2006-2026 | ALL WRISTS RESERVED
      </div>

    </div>
  );
}

export default MusicPlayer;
