
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
  {
    title: "she's an addict",
    artist: "yuke",
    src: "/audio/track3.mp3",
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
const crashSoundRef = useRef(null);

const MAX_MUTE_USES = 3;
const CRASH_CHANCE = 0.30;

const currentTrack = tracks[trackIndex];

// Initialize crash sound
useEffect(() => {
  const crash = new Howl({
    src: ["/audio/soundeffect.mp3"],
    volume: 0.8,
    html5: true,
  });

  crashSoundRef.current = crash;

  return () => {
    crash.unload();
  };
}, []);

// Initialize music whenever track changes
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
  soundRef.current?.volume(volume);
}, [volume]);

// Random crash mechanic
const maybeCrash = () => {
  if (Math.random() < CRASH_CHANCE) {
    crashSoundRef.current?.play();

    setStatus("FATAL ERROR: YOUR WRISTS HAVE BETRAYED YOU");

    if (Math.random() < 0.5) {
      shouldPlayRef.current = false;
      soundRef.current?.pause();
      setStatus("SYSTEM FAILURE: MUSIC PRIVILEGES REVOKED");
    }
  }
};

// Player controls
const playMusic = () => {
  if (soundRef.current) {
    shouldPlayRef.current = true;
    soundRef.current.play();
  }
};

const pauseMusic = () => {
  shouldPlayRef.current = false;
  soundRef.current?.pause();
  setStatus("PLAYBACK PAUSED");
  maybeCrash();
};

const nextTrack = () => {
  setTrackIndex((prev) => (prev + 1) % tracks.length);
  setStatus("SKIP REQUESTED. UNDER INVESTIGATION.");
  maybeCrash();
};

const previousTrack = () => {
  setTrackIndex((prev) =>
    (prev - 1 + tracks.length) % tracks.length
  );
  setStatus("TIME TRAVEL IS NOT SUPPORTED.");
  maybeCrash();
};

const handleMute = () => {
  if (muteClicks >= MAX_MUTE_USES) return;

  setMuteClicks((prev) => prev + 1);

  const random = Math.random();

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

  maybeCrash();
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
                disabled={muteClicks >= MAX_MUTE_USES}
                className={`border-2 border-black px-3 py-2 text-sm font-bold active:translate-y-1 ${
                    muteClicks >= MAX_MUTE_USES
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-[#0000cc] text-white hover:bg-[#000099]"
                }`}
                >
                {muteClicks >= MAX_MUTE_USES
                    ? "MUTE DISABLED"
                    : isMuted
                    ? "UNMUTE??"
                    : "MUTE??"}
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

    </div>
  );
}

export default MusicPlayer;
