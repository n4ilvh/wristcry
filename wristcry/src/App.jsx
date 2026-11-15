import { motion } from "motion/react";
import MusicPlayer from "./components/MusicPlayer";
import { useState, useEffect, useRef } from 'react'
import { IoGlobeOutline, IoWarning } from "react-icons/io5";
import { Howl } from "howler";


import './App.css'

export default function App() {
  const [count, setCount] = useState(0)
  const [buttonPositions, setButtonPositions] = useState({
    click: null,
    reset: null
  });

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

  // language switching
  const [isChinese, setIsChinese] = useState(false);

  // Random number of clicks before switching to Chinese (10–39)
  const languageTriggerRef = useRef(
    Math.floor(Math.random() * 30) + 10
  );

  // Random number of additional clicks before switching back (10–39)
  const englishTriggerRef = useRef(
    Math.floor(Math.random() * 30) + 10
  );

  // button location state
  const [hasMoved, setHasMoved] = useState(false);

  // Leaderboard state with requested names
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: "osamason", score: 100384 },
    { id: 2, name: "nettspend", score: 78394 },
    { id: 3, name: "2slimey", score: 13928 },
    { id: 4, name: "fakemink", score: 1234 },
    { id: 5, name: "ecco2k", score: 578 },
    { id: 6, name: "che", score: 134 },
    { id: 7, name: "homixide poopoo", score: 67 },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setLivesSaved(prev => prev + Math.floor(Math.random() * 45) + 5)
      setLeaderboard(prev =>
        prev.map((player, index) => {
          if (index < 4) {
            // Higher scores increment by roughly 20
            if (Math.random() > 0.5) {
              return { ...player, score: player.score + 20 }
            }
          } else {
            // Lower scores increment by 5 to 10
            if (Math.random() > 0.4) {
              return { ...player, score: player.score + Math.floor(Math.random() * 6) + 5 }
            }
          }
          return player
        }).sort((a, b) => b.score - a.score)
      )
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const crash = new Howl({
      src: ["/audio/soundeffect.mp3"],
      volume: 1,
      html5: true,
      preload: true,
    });

    audioRef.current = crash;

    return () => {
      crash.unload();
    };
  }, []);

  // Global document-wide click tracker for the 6-click crash warning
  const handleGlobalClick = (e) => {
    // Don't count clicks inside the warning popup
    if (e.target.closest(".crash-warning")) return;

    globalClickCountRef.current += 1;

    // Switch to Chinese
    if (
      !isChinese &&
      globalClickCountRef.current >= languageTriggerRef.current
    ) {
      setIsChinese(true);

      // Set a new random threshold for switching back
      englishTriggerRef.current =
        globalClickCountRef.current +
        Math.floor(Math.random() * 30) + 10;
    }

    // Switch back to English
    else if (
      isChinese &&
      globalClickCountRef.current >= englishTriggerRef.current
    ) {
      setIsChinese(false);

      // Set another random threshold for switching to Chinese
      languageTriggerRef.current =
        globalClickCountRef.current +
        Math.floor(Math.random() * 30) + 10;
    }
  
    if (globalClickCountRef.current % 6 === 0) {
      setShowCrashWarning(true);

        const crash = audioRef.current;

        if (crash) {
          crash.stop();

        // 30% chance to play at 2x speed
        const playLoud = Math.random() < 0.3;

        crash.volume(playLoud ? 2 : 1);
        crash.play();
      }
    };
  }

  const clickBtnRef = useRef(null);
  const resetBtnRef = useRef(null);
  const BANNER_HEIGHT = 80; // bottom "ORDER NOW" banner
  const MARGIN = 10;

  const getRandomPosition = (buttonRef) => {
    const button = buttonRef.current;
    const width = button?.offsetWidth ?? 160;
    const height = button?.offsetHeight ?? 60;

    const vw = document.documentElement.clientWidth; // excludes scrollbar
    const vh = window.innerHeight;

    const maxX = Math.max(MARGIN, vw - width - MARGIN);
    const maxY = Math.max(MARGIN, vh - height - BANNER_HEIGHT);
    const minY = Math.min(150, maxY); // never let minY exceed maxY

    return {
      x: Math.random() * (maxX - MARGIN) + MARGIN,
      y: Math.random() * (maxY - minY) + minY,
    };
  };

  const handleClick = () => {
    const nextCount = count + 1;
    setCount(nextCount);

    if (isSwapped) {
      setIsSwapped(false);
    } else {
      const remaining = clicksUntilSwap - 1;

      if (remaining <= 0) {
        setIsSwapped(true);
        setClicksUntilSwap(Math.floor(Math.random() * 3) + 3);
      } else {
        setClicksUntilSwap(remaining);
      }
    }

    setHasMoved(true);

    setButtonPositions({
      click: getRandomPosition(clickBtnRef),
      reset: getRandomPosition(resetBtnRef)
    });
  };

  const getSillyCountDisplay = (c) => {
    if (c === 0) return "0";
    if (c % 3 === 0) {
      return `ln(e^${c})`;
    }
    if (c % 5 === 0) {
      return `e^(ln(${c}))`;
    }
    return c;
  };

  const clickBtn = (
    <button
      key="click-btn"
      ref={clickBtnRef}
      onClick={handleClick}
      style={buttonPositions.click ? {
        position: "fixed",
        left: buttonPositions.click.x,
        top: buttonPositions.click.y,
        zIndex: 100,
      } : {}}
      className="bg-yellow-300 min-w-[10rem] text-white text-lg md:text-xl font-black font-comic py-3 px-6 cursor-pointer hover:bg-yellow-400 transition-all duration-150"
    >
      {isChinese ? "点击我" : "CLICK ME"}
    </button>
  );
  const resetBtn = (
    <button
      key="reset-btn"
      ref={resetBtnRef}
      onClick={() => {
        setIsSwapped(false);
        setShowModal(true);
      }}
      style={buttonPositions.reset ? {
        position: "fixed",
        left: buttonPositions.reset.x,
        top: buttonPositions.reset.y,
        zIndex: 100,
      } : {}}
      className="bg-yellow-300 text-red-600 text-lg md:text-xl font-black font-comic py-3 px-6 cursor-pointer hover:bg-yellow-400 transition-all duration-150"
    >
      {isChinese ? "重置" : "RESET"}
    </button>
  );

  useEffect(() => {
  const clampToViewport = () => {
    const fix = (pos, ref) => {
      if (!pos || !ref.current) return pos;
      const maxX = document.documentElement.clientWidth - ref.current.offsetWidth - MARGIN;
      const maxY = window.innerHeight - ref.current.offsetHeight - BANNER_HEIGHT;
      return {
        x: Math.max(MARGIN, Math.min(pos.x, maxX)),
        y: Math.max(MARGIN, Math.min(pos.y, maxY)),
      };
    };

    setButtonPositions(prev => ({
      click: fix(prev.click, clickBtnRef),
      reset: fix(prev.reset, resetBtnRef),
    }));
  };

  window.addEventListener("resize", clampToViewport);
  return () => window.removeEventListener("resize", clampToViewport);
}, []);

  return (
    <div 
      onClick={handleGlobalClick}
      className="background flex flex-col justify-between min-h-screen pb-32 relative font-comic"
    >

      {/* Header with massive mouse image and huge yellow title */}
      <header className="header flex justify-between items-center w-full p-4 z-25 font-comic">
        <div className="flex items-center gap-6">
          <img 
            src="/images/mouse.webp" 
            alt="Mouse Icon" 
            className="w-36 h-36 md:w-48 md:h-48 object-contain" 
          />
          <h1 className="text-8xl text-yellow-300 italic">
            {isChinese ? "手腕哭泣" : "WRIST CRY"}
          </h1>
        </div>
      </header>

      {/* Music player with autoPlay prop enabled */}
      <div className='music-player w-full'>
          <MusicPlayer autoPlay={true} />
      </div>

      {/* Content Layout Wrapper (Sidebar + Main) preventing overlap */}
      <div className="flex flex-col lg:flex-row w-full relative px-4 gap-6 my-auto">

        {/* Leaderboard Sidebar */}
        <aside className="w-full lg:w-60 shrink-0 bg-white text-black p-3 z-30 font-comic flex flex-col min-h-[400px]">
          <h3 className="text-lg font-black italic pb-2 mb-2 text-center uppercase tracking-wider bg-yellow-300">
            
            {isChinese ? "🏆 排行榜" : "🏆 Click Leaderboard"}
          </h3>
          <ul className="flex flex-col gap-2 font-bold text-xs flex-grow justify-around">
            {leaderboard.map((user, index) => (
              <li key={user.id} className="flex justify-between items-center border-b border-dashed border-gray-400 pb-1">
                <span className="truncate max-w-[130px]">
                  {index + 1}. {user.name}
                </span>
                <span className="font-mono text-red-600">
                  {user.score.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center flex-grow gap-6 px-4 text-center pb-12">
        
          {/* chinese gif */}
          <img src="../public/images/gif1.gif" className="w-56 h-20 md:w-72"/>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-black text-center text-yellow-300 font-comic">
            {isChinese ? "你的手腕正处于危险之中" : "YOUR WRISTS ARE IN DANGER."}

          </h2>

          {/* Info Paragraph */}
          <p className="text-sm md:text-base font-bold text-white font-comic leading-relaxed">
            {isChinese ? "3% 到 15% 的软件开发人员患有腕管综合征——这一比例比“因用力摇晃自动售货机试图取出卡住的薯片，结果反被机器压死”的年度死亡率，高出了约 14 亿个百分点。" : "3-15% of software developers affected by carpal tunnel – outperforming the annual mortality rate of people crushed to death while aggressively shaking a vending machine for a stuck bag of chips by roughly 1.4 billion percent."}
            
          </p>

          {/* Subtitle */}
          <p className="text-base md:text-lg font-bold tracking-wider text-yellow-300 font-comic max-w-xl">
            {isChinese ? "点击以提升关注度" : "CLICK TO RAISE AWARENESS"}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-4 z-100">
            {isSwapped ? [resetBtn, clickBtn] : [clickBtn, resetBtn]}
          </div>

          {/* Separated Total Count Display Window */}
          <div className="flex flex-col items-center bg-white text-black px-6 py-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-500 font-comic">{isChinese ? "您的总数：" : "your total count:"}</span>
            <span className="text-2xl md:text-3xl font-black font-mono text-black font-comic">
              {getSillyCountDisplay(count)}
            </span>
          </div>

          {/* Global Metric Counter */}
          <div className="flex flex-col items-center bg-white text-black px-6 py-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-500">Global Metric</span>
            <span className="text-lg md:text-xl font-black font-mono text-red-600">
              {isChinese ? "挽救的生命：" : "lives saved:"}
               {livesSaved.toLocaleString()}
            </span>
          </div>

        </main>
      </div>
      
      {/* FDA.webp positioned near the bottom right (bigger, no drop shadow) */}
      <div className="absolute bottom-16 right-4 z-20 pointer-events-none hidden md:block">
        <img 
          src="/images/FDA.webp" 
          alt="FDA Stamp" 
          className="w-56 h-56 md:w-72 md:h-72 object-contain rotate-12 opacity-95 shadow-none animate-[spin_4s_linear_infinite]" 
        />
      </div>

      {/* Carpal Tunnel Crash Warning Popup */}
      {showCrashWarning && (
        <div className="crash-warning fixed inset-0 bg-red-600/90 flex items-center justify-center z-500 p-4 font-sans">
          <div className="bg-white text-black p-8 md:p-10 max-w-2xl w-full flex flex-col gap-6 relative">
            
            {/* Pixelated Top-Left X Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCrashWarning(false);
              }}
              className="absolute top-3 left-3 bg-black text-white px-2 py-1 font-mono font-bold text-xs hover:bg-red-600 cursor-pointer border border-black uppercase tracking-widest"
            >
              [X]
            </button>

            <div className="flex items-center gap-3 text-red-600 mt-4">
              <IoWarning className="text-5xl shrink-0" />
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-red-600 font-sans">
                {isChinese ? "警告：让你的手腕休息一下！" : "WARNING: MAKE YOUR WRISTS TAKE A BREAK!"}
                
              </h3>
            </div>

            {/* Uncropped Image without Drop Shadow */}
            <div className="w-full max-h-64 flex justify-center bg-neutral-100 p-2">
              <img src="/images/image1.png" alt="Carpal Tunnel Warning" className="max-h-56 object-contain" />
            </div>

            <p className="text-sm md:text-base font-bold leading-relaxed p-4 bg-neutral-100 text-red-600 font-sans uppercase">
              {isChinese ? "该休息一下了：事实证明，在点击操作间隙进行频繁且短暂的休息，比偶尔进行一两次长时间的休息，更能有效预防肌肉疲劳和重复性劳损（RSI）。本网站旨在普及腕管综合征相关知识，而您目前的行为正违反了手腕安全防护准则。" : "Time for a break: Short, frequent pauses from clicking are proven to be much better for preventing muscle fatigue and repetitive strain injuries (RSIs) than taking one or two long breaks. This is a carpal tunnel awareness website, and you are actively violating wrist safety protocols."}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCrashWarning(false);
              }}
              className="bg-black hover:bg-neutral-800 text-white font-black font-sans py-4 px-8 text-xl uppercase tracking-wider cursor-pointer active:translate-y-1"
            >
              {isChinese ? "我明白了，救救我的手腕吧" : "I UNDERSTAND, SAVE MY WRISTS"}
            </button>
          </div>
        </div>
      )}

      {/* Annoying Reset Modal Popup */}
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

      {/* Pinned Bottom Link Banner with Fuchsia background, yellow text, no outlines/shadows, and pop animation */}
      <a
        href="https://login.web-safe.link/wTfRPX_redeem_gift.js"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 left-0 w-full bg-fuchsia-600 text-yellow-300 text-center py-4 px-2 font-black font-comic text-lg md:text-xl tracking-wider block z-50 truncate animate-pop outline-none border-none shadow-none ring-0 focus:outline-none"
      >
        {isChinese ? "立即订购！→" : "ORDER NOW! →"}
         <span className="font-mono text-sm underline opacity-90 ml-2">https://update.hf25u.link/VbZq9U_free_money.cmd</span>
      </a>
    </div>
  )

}