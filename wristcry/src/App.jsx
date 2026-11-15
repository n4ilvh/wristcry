import { motion } from "motion/react";
import { IoVolumeHigh, IoPause, IoPlay } from "react-icons/io5";
import MusicPlayer from "./components/MusicPlayer";
import { useState, useEffect, useRef } from 'react'
import { IoVolumeMuteSharp, IoGlobeOutline, IoWarning } from "react-icons/io5";

import './App.css'

export default function App() {
  const [count, setCount] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Button swapping state
  const [clicksUntilSwap, setClicksUntilSwap] = useState(Math.floor(Math.random() * 3) + 3)
  const [isSwapped, setIsSwapped] = useState(false)

  // Reset Modal state
  const [showModal, setShowModal] = useState(false)
  const [modalLang, setModalLang] = useState('zh')

  // Carpal Tunnel Crash Warning Popup state
  const [showCrashWarning, setShowCrashWarning] = useState(false)
  const globalClickCountRef = useRef(0)
  const audioRef = useRef(null)

  // Fake "Lives Saved" massive counter
  const [livesSaved, setLivesSaved] = useState(4892019482)

  // Leaderboard state with requested names
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: "osamason", score: 1000000 },
    { id: 2, name: "nettspend", score: 854200 },
    { id: 3, name: "2slimey", score: 712950 },
    { id: 4, name: "fakemink", score: 630110 },
    { id: 5, name: "ecco2k", score: 500025 },
    { id: 6, name: "che", score: 410000 },
    { id: 7, name: "homixide poopoo", score: 320000 },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setLivesSaved(prev => prev + Math.floor(Math.random() * 45) + 5)
      setLeaderboard(prev =>
        prev.map(player => {
          if (Math.random() > 0.4) {
            return { ...player, score: player.score + Math.floor(Math.random() * 1500) + 100 }
          }
          return player
        }).sort((a, b) => b.score - a.score)
      )
    }, 1200)

    return () => clearInterval(timer)
  }, [])

  // Global document-wide click tracker for the 6-click crash warning
  const handleGlobalClick = (e) => {
    globalClickCountRef.current += 1

    if (globalClickCountRef.current % 6 === 0) {
      setShowCrashWarning(true)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(err => console.log("Audio play blocked:", err))
      }
    }
  }

  const handleClick = () => {
    const nextCount = count + 1
    setCount(nextCount)

    if (isSwapped) {
      setIsSwapped(false)
    } else {
      const remaining = clicksUntilSwap - 1
      if (remaining <= 0) {
        setIsSwapped(true)
        setClicksUntilSwap(Math.floor(Math.random() * 3) + 3)
      } else {
        setClicksUntilSwap(remaining)
        setIsSwapped(false)
      }
    }

    const randomX = (Math.random() - 0.5) * 80
    const randomY = (Math.random() - 0.5) * 30
    setPosition({ x: randomX, y: randomY })
  }

  const getSillyCountDisplay = (c) => {
    if (c === 0) return "0";
    if (c % 5 === 0) {
      return `ln(e^${c}) [base-e override]`;
    }
    return c;
  };

  const clickBtn = (
    <button
      key="click-btn"
      onClick={handleClick}
      className="bg-yellow-300 text-white text-lg md:text-xl font-black font-comic py-3 px-6 cursor-pointer hover:bg-yellow-400 active:translate-y-0.5 transition-none"
    >
      CLICK ME
    </button>
  )

  const resetBtn = (
    <button
      key="reset-btn"
      onClick={() => {
        setIsSwapped(false)
        setShowModal(true)
      }}
      className="bg-yellow-300 text-red-600 text-lg md:text-xl font-black font-comic py-3 px-6 cursor-pointer hover:bg-yellow-400 active:translate-y-0.5 transition-none"
    >
      RESET
    </button>
  )

  return (
    <div 
      onClick={handleGlobalClick}
      className="background flex flex-col justify-between min-h-screen pb-32 relative overflow-hidden font-comic"
    >

      {/* Hidden Audio element for the crash sound effect */}
      <audio ref={audioRef} src="https://www.youtube.com/watch?v=1EyDeoYWHMo" preload="auto" />

      {/* Header with Logo */}
      <header className="header flex justify-between items-center w-full p-4 z-25 font-comic">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Wristcry Logo" 
            className="w-12 h-12 object-cover shadow-[2px_2px_0px_black]" 
          />
          <h1 className="text-5xl font-black italic">
            WRISTCRY
          </h1>
        </div>
      </header>

      <div className='music-player'>
          <MusicPlayer/>
      </div>

      {/* Left-side Leaderboard Tab (No borders on box) */}
      <aside className="hidden lg:flex flex-col absolute left-4 top-28 w-60 bg-white text-black p-3 z-30 font-comic">
        <h3 className="text-lg font-black italic pb-2 mb-2 text-center uppercase tracking-wider bg-yellow-300">
          🏆 Leaderboard
        </h3>
        <ul className="flex flex-col gap-2 font-bold text-xs">
          {leaderboard.map((user, index) => (
            <li key={user.id} className="flex justify-between items-center border-b border-dashed border-gray-400 pb-1">
              <span className="truncate max-w-[110px]">
                {index + 1}. {user.name}
              </span>
              <span className="font-mono text-red-600">
                {user.score.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content with generous spacing and bottom padding to clear banner */}
      <main className="flex flex-col items-center justify-center my-auto gap-6 px-4 text-center z-10 lg:ml-64 pb-12">

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-black text-center max-w-3xl text-yellow-300 font-comic">
          YOUR WRISTS ARE IN DANGER.
        </h2>

        {/* Info Paragraph: Raw red background, no white box */}
        <p className="text-sm md:text-base font-bold max-w-xl text-white font-comic leading-relaxed">
          3-15% of software developers affected by carpal tunnel – outperforming the annual mortality rate of people crushed to death while aggressively shaking a vending machine for a stuck bag of chips by roughly 1.4 billion percent.
        </p>

        {/* Subtitle */}
        <p className="text-base md:text-lg font-bold tracking-wider text-yellow-300 font-comic max-w-xl">
          CLICK TO RAISE AWARENESS
        </p>

        {/* Separated Total Count Display Window (No borders) */}
        <div className="flex flex-col items-center bg-white text-black px-6 py-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-500 font-comic">your total count:</span>
          <span className="text-2xl md:text-3xl font-black font-mono text-black font-comic">
            {getSillyCountDisplay(count)}
          </span>
        </div>

        {/* Action Area */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
          className="flex items-center gap-4 transition-transform duration-75 my-1"
        >
          {isSwapped ? [resetBtn, clickBtn] : [clickBtn, resetBtn]}
        </div>

        {/* Global Metric Counter (No borders) */}
        <div className="flex flex-col items-center bg-white text-black px-6 py-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-500">Global Metric</span>
          <span className="text-lg md:text-xl font-black font-mono text-red-600">
            lives saved: {livesSaved.toLocaleString()}
          </span>
        </div>

      </main>

      {/* Carpal Tunnel Crash Warning Popup (No borders) */}
      {showCrashWarning && (
        <div className="fixed inset-0 bg-red-600/90 flex items-center justify-center z-50 p-4 font-comic">
          <div className="bg-white text-black p-8 md:p-10 max-w-2xl w-full flex flex-col gap-6 relative">
            
            <div className="flex items-center gap-3 text-red-600">
              <IoWarning className="text-5xl shrink-0" />
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-comic">
                WARNING: MAKE YOUR WRISTS TAKE A BREAK!
              </h3>
            </div>

            <p className="text-base md:text-lg font-bold leading-relaxed p-4 bg-neutral-100 font-comic">
              Time for a break: Short, frequent pauses from clicking are proven to be much better for preventing muscle fatigue and repetitive strain injuries (RSIs) than taking one or two long breaks. This is a carpal tunnel awareness website, and you are actively violating wrist safety protocols.
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCrashWarning(false);
              }}
              className="bg-black hover:bg-neutral-800 text-white font-black font-comic py-4 px-8 text-2xl uppercase tracking-wider cursor-pointer active:translate-y-1"
            >
              I UNDERSTAND, SAVE MY WRISTS
            </button>
          </div>
        </div>
      )}

      {/* Annoying Reset Modal Popup (No borders) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 font-comic" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white text-black p-6 md:p-8 max-w-md w-full flex flex-col gap-6 relative">
            
            {/* Language Switch Button with Logo */}
            <button 
              onClick={() => setModalLang(prev => prev === 'zh' ? 'en' : 'zh')}
              className="absolute top-3 right-3 flex items-center gap-1 bg-neutral-200 px-2 py-1 text-xs font-bold hover:bg-neutral-300 cursor-pointer font-comic"
            >
              <IoGlobeOutline className="text-base" />
              <span>{modalLang === 'zh' ? '语言: 中文' : 'Lang: English'}</span>
            </button>

            <h3 className="text-2xl md:text-3xl font-black mt-4 font-comic">
              {modalLang === 'zh' ? '你确定要重置吗？' : 'Are you sure you want to reset?'}
            </h3>

            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={() => {
                  setCount(0)
                  setShowModal(false)
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-black font-comic px-6 py-3 text-xl cursor-pointer"
              >
                {modalLang === 'zh' ? '是' : 'Yes'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-neutral-300 hover:bg-neutral-400 text-black font-black font-comic px-6 py-3 text-xl cursor-pointer"
              >
                {modalLang === 'zh' ? '否' : 'No'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Pinned Bottom Link Banner */}
      <a
        href="https://login.web-safe.link/wTfRPX_redeem_gift.js"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 left-0 w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 px-2 font-black font-comic text-lg md:text-xl tracking-wider block transition-all z-50 truncate"
      >
        ORDER NOW! → <span className="font-mono text-sm underline opacity-90">https://login.web-safe.link/wTfRPX_redeem_gift.js</span>
      </a>
    </div>
  )
}