import { useState, useEffect, useRef } from "react";
import AI from './AI.gif';
import TalkingRobot from './TalkingRobot';

import variablesImg from '../../assets/variables_toybox.png';

const topicDetails = [
  {
    name: 'Variables',
    title: 'Variables: The Magical Toy Box! 📦',
    kidFriendlyExample: 'Imagine a glowing magical toy box with a name tag on it. The name tag is the "Variable Name", and the toy inside is the "Data"! You can put a toy car in, and later swap it for a teddy bear!',
    instructions: '1. Think of a name for your box (like "myToy").\n2. Put a value inside it using the "=" sign (like myToy = "Teddy").\n3. Use it whenever you need your toy!',
    imgUrl: variablesImg,
  },
  {
    name: 'Operators',
    title: 'Operators: The Math Wands! 🪄',
    kidFriendlyExample: 'Operators are like magic wands! A plus (+) wand puts two piles of candies together to make an even bigger pile! A minus (-) wand eats some candies away.',
    instructions: '1. Use + to add things together.\n2. Use - to take things away.\n3. It works just like counting on your fingers!',
    imgUrl: null, // Will add later
  },
  {
    name: 'Functions',
    title: 'Functions: The Recipe Machine! 🍰',
    kidFriendlyExample: 'A function is like a magic cooking machine. You give it ingredients (like flour and sugar), press a button (call the function), and it bakes a cake for you every single time!',
    instructions: '1. Build your machine and give it a name.\n2. Tell it what ingredients to take.\n3. Tell it what to make and return to you!',
    imgUrl: null,
  },
  {
    name: 'Loops',
    title: 'Loops: The Merry-Go-Round! 🎠',
    kidFriendlyExample: 'A loop is like a merry-go-round at the park! It keeps spinning round and round, doing the same fun thing over and over, until you tell it to stop.',
    instructions: '1. Tell the loop where to start.\n2. Tell it when to stop spinning.\n3. Put the fun action you want to repeat inside it!',
    imgUrl: null,
  },
  {
    name: 'Arrays',
    title: 'Arrays: The Toy Train! 🚂',
    kidFriendlyExample: 'An array is like a long toy train with many cars! Each car holds a different toy, and they are numbered so you can always find your favorite one quickly.',
    instructions: '1. Make a train using square brackets [ ].\n2. Put your items inside, separated by commas.\n3. Remember, the first car is always number 0!',
    imgUrl: null,
  },
  {
    name: 'Objects',
    title: 'Objects: The Super Backpack! 🎒',
    kidFriendlyExample: 'An object is like a super smart backpack! It has different labeled pockets: one for your "notebook", one for your "lunch", so everything is perfectly organized.',
    instructions: '1. Use curly braces { } to make a backpack.\n2. Give every item a label (like lunch: "apple").\n3. Look inside the pocket by using a dot (backpack.lunch)!',
    imgUrl: null,
  }
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [speechText, setSpeechText] = useState("Hi! How may I help you? 👋");
  
  // Progression state
  const [unlockedCount, setUnlockedCount] = useState(1);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  const hasGreetingSpoken = useRef(false);
  const speechTimeoutRef = useRef(null);
  const utteranceRef = useRef(null);

  // Helper for TTS playback
  const speakText = (text, customOnEnd = null) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      console.log("Attempting to speak:", text);
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      
      const triggerSpeak = () => {
        utteranceRef.current = new SpeechSynthesisUtterance(text);
        utteranceRef.current.rate = 1.0;
        utteranceRef.current.pitch = 1.05; 
        
        let voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
           console.warn("Voices not loaded yet, using default browser voice.");
        } else {
           const englishVoice = voices.find(v => v.lang.toLowerCase().includes('en')) || voices[0];
           if (englishVoice) utteranceRef.current.voice = englishVoice;
        }
        
        utteranceRef.current.onstart = () => setIsTalking(true);
        utteranceRef.current.onend = () => { setIsTalking(false); utteranceRef.current = null; if (customOnEnd) customOnEnd(); };
        utteranceRef.current.onerror = (e) => { console.error("SpeechSynthesis error:", e); setIsTalking(false); utteranceRef.current = null; };
        
        window.speechSynthesis.speak(utteranceRef.current);
      };

      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        window.speechSynthesis.cancel();
        speechTimeoutRef.current = setTimeout(triggerSpeak, 200);
      } else {
        triggerSpeak();
      }
    } else {
      console.error("SpeechSynthesis is not supported in this browser.");
    }
  };

  useEffect(() => {
    const triggerGreeting = () => {
      if (hasGreetingSpoken.current || started) return;
      hasGreetingSpoken.current = true;
      speakText("Hi! How may I help you?");
    };

    triggerGreeting();

    const handleInteraction = (e) => {
      // Unlock speech synthesis context synchronously in Chrome
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
      }

      // If user clicked the "Start Learning" button, skip the greeting and let handleStart take over
      if (e.target && e.target.closest('.start-btn')) {
        hasGreetingSpoken.current = true;
        cleanup();
        return;
      }
      
      triggerGreeting();
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      cleanup();
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [started]);

  const handleStart = () => {
    if (started) return;
    
    // Unlock Speech Synthesis context synchronously in Chrome
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
    }

    setStarted(true);
    hasGreetingSpoken.current = true;
    setSpeechText(`Welcome! Let's start with the first topic: ${topicDetails[0].name}. 🚀`);
    speakText(`Welcome to JavaScript learning. Let's start with the first topic: ${topicDetails[0].name}.`);
  };

  const handleSelectTopic = (index) => {
    if (index >= unlockedCount) return; // Locked
    setActiveTopicIndex(index);
    setSpeechText(`Let's study ${topicDetails[index].name}! ⚡`);
    speakText(`Let's study ${topicDetails[index].name}!`);
  };

  const completeTopic = () => {
    const nextIndex = activeTopicIndex + 1;
    if (nextIndex < topicDetails.length) {
      if (unlockedCount <= nextIndex) {
        setUnlockedCount(nextIndex + 1);
      }
      setActiveTopicIndex(nextIndex);
      setSpeechText(`Great job! Let's move to ${topicDetails[nextIndex].name}. 🎉`);
      speakText(`Great job! Let's move to ${topicDetails[nextIndex].name}.`);
    } else {
      setSpeechText(`Congratulations! You've completed all topics! 🏆`);
      speakText(`Congratulations! You have completed all topics!`);
    }
  };

  return (
    <div className="root-container" style={{ minHeight: '100vh', padding: '32px 24px', background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%)', fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        @keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
        .interactive-card {
          display: flex;
          gap: 32px;
          align-items: stretch;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.06);
          border-radius: 32px;
          padding: 40px;
          width: 100%;
          animation: popIn 0.6s cubic-bezier(0.1, 0.8, 0.2, 1);
        }

        .sidebar {
          flex: 0 0 280px;
          background: #ffffff;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
          animation: slideInLeft 0.5s ease-out;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .topic-item {
          padding: 16px 20px;
          margin-bottom: 12px;
          border-radius: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .topic-item.locked {
          background: #f8fafc;
          color: #94a3b8;
          border-color: #f1f5f9;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .topic-item.unlocked {
          background: #ffffff;
          color: #2563eb;
          border-color: #e0f2fe;
          cursor: pointer;
        }

        .topic-item.unlocked:hover {
          background: #eff6ff;
          border-color: #bfdbfe;
          transform: translateY(-2px);
        }

        .topic-item.active {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2);
        }

        .btn {
          padding: 14px 32px;
          border-radius: 999px;
          border: none;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #fff;
        }
        .start-btn { background: #2563eb; box-shadow: 0 10px 24px rgba(37, 99, 235, 0.2); }
        .start-btn:hover { background: #1d4ed8; transform: translateY(-2px); }
        .complete-btn { background: #16a34a; box-shadow: 0 10px 24px rgba(22, 163, 74, 0.2); width: 100%; }
        .complete-btn:hover { background: #15803d; transform: translateY(-2px); }
        
        @media (max-width: 850px) {
          .interactive-card { flex-direction: column; padding: 24px; }
          .sidebar { flex: auto; width: 100%; }
        }
      `}</style>

      <div style={{ maxWidth: '', margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 30px', fontSize: '2.5rem', fontWeight: '800', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          <span>🤖</span> AI Learning Buddy
        </h1>

        <div className="interactive-card">
          {/* Sidebar - only shows when started */}
          {started && (
            <div className="sidebar">
              <h2 style={{ margin: '0 0 20px', color: '#1e3a8a', fontSize: '1.4rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Syllabus Path</h2>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {topicDetails.map((topic, index) => {
                  const isLocked = index >= unlockedCount;
                  const isActive = index === activeTopicIndex;
                  let itemClass = isLocked ? 'locked' : 'unlocked';
                  if (isActive) itemClass += ' active';

                  return (
                    <div 
                      key={topic.name} 
                      className={`topic-item ${itemClass}`}
                      onClick={() => handleSelectTopic(index)}
                    >
                      <span>{isLocked ? '🔒' : (isActive ? '⚡' : '🔓')}</span>
                      {topic.name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="main-content">
            <div
              className="speech-bubble"
              style={{
                position: 'relative',
                background: '#ffffff',
                border: '2px solid #bfdbfe',
                borderRadius: '24px',
                padding: '16px 24px',
                width: '100%',
                maxWidth: '600px',
                boxShadow: '0 12px 30px rgba(59, 130, 246, 0.08)',
                fontSize: '1.1rem',
                color: '#1e293b',
                fontWeight: '600',
                textAlign: 'center',
                minHeight: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {speechText}
              <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '18px', height: '18px', background: '#ffffff', borderRight: '2px solid #bfdbfe', borderBottom: '2px solid #bfdbfe' }} />
            </div>

            <div style={{ width: '100%', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
              {!started ? (
                <img src={AI} alt="Waving AI Assistant" style={{ height: '100%', maxHeight: '250px', borderRadius: '28px', boxShadow: '0 16px 36px rgba(59, 130, 246, 0.12)' }} />
              ) : (
                <TalkingRobot isTalking={isTalking} />
              )}
            </div>

            {!started ? (
              <button className="btn start-btn" onClick={handleStart}>
                Start Learning 🚀
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '600px', background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', animation: 'popIn 0.5s ease-out' }}>
                <h3 style={{ color: '#1e3a8a', fontSize: '1.6rem', margin: 0, borderBottom: '2px dashed #bfdbfe', paddingBottom: '10px', width: '100%', textAlign: 'center' }}>
                  {topicDetails[activeTopicIndex].title}
                </h3>
                
                {topicDetails[activeTopicIndex].imgUrl && (
                  <img src={topicDetails[activeTopicIndex].imgUrl} alt="Topic Explanation" style={{ width: '100%', maxWidth: '300px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                )}

                <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '16px', borderLeft: '4px solid #f59e0b', width: '100%' }}>
                  <p style={{ margin: 0, color: '#b45309', fontSize: '1.1rem', lineHeight: '1.5' }}>
                    <strong>💡 Concept: </strong>{topicDetails[activeTopicIndex].kidFriendlyExample}
                  </p>
                </div>

                <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '16px', borderLeft: '4px solid #22c55e', width: '100%' }}>
                  <p style={{ margin: '0 0 8px', color: '#166534', fontWeight: 'bold' }}>Follow these steps:</p>
                  <pre style={{ margin: 0, color: '#15803d', fontSize: '1.05rem', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {topicDetails[activeTopicIndex].instructions}
                  </pre>
                </div>

                {activeTopicIndex < topicDetails.length && (
                  <button className="btn complete-btn" onClick={completeTopic} style={{ marginTop: '10px' }}>
                    Clear Topic & Unlock Next ✅
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
