import { useState } from 'react'
import { motion } from "motion/react";
import { IoVolumeMuteSharp, IoVolumeHigh, IoPause, IoPlay } from "react-icons/io5";
import MusicPlayer from "./components/MusicPlayer";

import './App.css'

function ClickButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.8 }}
    >
      CLICK ME
    </motion.button>
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="background">

      {/* Header */}
      <header className="header">
        <h1 className="text-5xl font-black italic">
          WRISTCRY
        </h1>
      
      </header>

      <div className='music-player'>
          <MusicPlayer/>
      </div>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center mt-20 gap-6">

        <h2 className="text-6xl font-black text-center">
          YOUR WRISTS ARE IN DANGER.
        </h2>

        <p className="text-xl font-bold">
          CLICK TO SAVE LIVES.
        </p>

        <button className="bg-red-600 text-white text-4xl font-black p-10 border-8 border-black shadow-[10px_10px_0px_black] ">
          CLICK ME
        </button>

      </main>
    </div>
  )
}

export default App


