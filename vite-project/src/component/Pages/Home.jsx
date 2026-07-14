import { useState, useEffect, useRef } from "react";
import AI from './AI.gif';
import TalkingRobot from './TalkingRobot';

const topics = [
  'Variables',
  'Operators',
  'Functions',
  'Loops',
  'Arrays',
  'Objects',
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [speechText, setSpeechText] = useState("Hi! How may I help you? 👋");
  const hasGreetingSpoken = useRef(false);
  const speechTimeoutRef = useRef(null);
  const utteranceRef = useRef(null);

  // Helper for TTS playback
  const speakText = (text, customOnEnd = null) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      console.log("Attempting to speak:", text);
      
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      
      const triggerSpeak = () => {
        utteranceRef.current = new SpeechSynthesisUtterance(text);
        utteranceRef.current.rate = 1.0;
        utteranceRef.current.pitch = 1.05; // Standard pitch
        
        // Ensure voices are loaded. In Chrome, getVoices() is empty initially.
        let voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
           console.warn("Voices not loaded yet, using default browser voice.");
        } else {
           const englishVoice = voices.find(v => v.lang.toLowerCase().includes('en')) || voices[0];
           if (englishVoice) {
             utteranceRef.current.voice = englishVoice;
           }
        }
        
        utteranceRef.current.onstart = () => {
          console.log("Speech started");
          setIsTalking(true);
        };
        
        utteranceRef.current.onend = () => {
          console.log("Speech ended naturally");
          setIsTalking(false);
          utteranceRef.current = null; // Free reference
          if (customOnEnd) customOnEnd();
        };
        
        utteranceRef.current.onerror = (e) => {
          console.error("SpeechSynthesis error:", e);
          setIsTalking(false);
          utteranceRef.current = null; // Free reference
        };
        
        window.speechSynthesis.speak(utteranceRef.current);
      };

      // If speech synthesis is busy, cancel first and trigger with a 150ms timeout to clear queue
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();
        speechTimeoutRef.current = setTimeout(() => {
          triggerSpeak();
        }, 200); // slightly longer delay just in case
      } else {
        // Speak synchronously to preserve the browser's User Activation token
        triggerSpeak();
      }
    } else {
      console.error("SpeechSynthesis is not supported in this browser.");
    }
  };

  // Trigger greeting on page load
  useEffect(() => {
    const triggerGreeting = () => {
      if (hasGreetingSpoken.current || started) return;
      hasGreetingSpoken.current = true;
      speakText("Hi! How may I help you?");
    };

    // Try immediately on load
    triggerGreeting();

    // Browser security blocks audio autoplay until interaction.
    // Register temporary listeners to execute the greeting as soon as the user interacts.
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
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [started]);

  const handleStart = () => {
    if (started) return;
    
    // Unlock Speech Synthesis context synchronously in Chrome
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
    }

    setStarted(true);
    hasGreetingSpoken.current = true; // Ensure greeting doesn't try to trigger later
    setSpeechText("Welcome to JavaScript learning! Let's explore these important topics. 🚀");
    speakText(
      "Welcome to JavaScript learning. Here are important topics: variables, operators, functions, loops, arrays, and objects."
    );
  };


  return (
    <div className="root-container" style={{ minHeight: '100vh', padding: '32px 24px', background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%)', fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      {/* Styles for premium hover effects and responsive layouts */}
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
        }
        @keyframes popIn {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.2); }
          100% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.45); }
        }
        .speech-bubble {
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .topic-item {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .topic-item:hover {
          transform: translateY(-2px) scale(1.02);
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.1);
        }
        .start-btn {
          transition: all 0.3s ease;
        }
        .start-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.35) !important;
          background: #1d4ed8 !important;
        }
        .start-btn:active:not(:disabled) {
          transform: translateY(1px);
        }
        
        .interactive-card {
          display: flex;
          flex-direction: column;
          gap: 32px;
          align-items: center;
          justify-content: center;
          padding: 40px;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.06);
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
          width: 100%;
          animation: popIn 0.6s cubic-bezier(0.1, 0.8, 0.2, 1);
        }

        /* Large screens: when started, show row layout */
        @media (min-width: 850px) {
          .interactive-card.started {
            flex-direction: row;
            align-items: flex-start;
          }
        }

        /* Responsive styling for small screens */
        @media (max-width: 768px) {
          .root-container {
            padding: 20px 14px !important;
          }
          .main-heading {
            font-size: 1.9rem !important;
            margin-bottom: 20px !important;
            justify-content: center;
          }
          .interactive-card {
            padding: 28px 20px !important;
            border-radius: 24px !important;
            gap: 28px !important;
          }
          .speech-bubble {
            padding: 14px 20px !important;
            font-size: 0.95rem !important;
            min-height: 65px !important;
          }
          .search-input {
            width: 100% !important;
            flex: 1 1 100% !important;
          }
          .start-btn {
            width: 100% !important;
          }
          .topics-container h2 {
            font-size: 1.7rem !important;
            text-align: center !important;
          }
          .topics-container p {
            font-size: 1rem !important;
            text-align: center !important;
            margin-bottom: 20px !important;
          }
          .topics-list {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 className="main-heading" style={{ margin: '0 0 30px', fontSize: '2.5rem', fontWeight: '800', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>🤖</span> AI Learning Buddy
        </h1>

        <div
          className={`interactive-card ${started ? 'started' : ''}`}
        >
          {/* Left Column: Robot, speech bubble, search & trigger buttons */}
          <div
            style={{
              flex: '1 1 350px',
              maxWidth: '450px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              textAlign: 'center',
            }}
          >
            {/* Speach bubble */}
            <div
              className="speech-bubble"
              style={{
                position: 'relative',
                background: '#ffffff',
                border: '2px solid #bfdbfe',
                borderRadius: '24px',
                padding: '16px 24px',
                width: '100%',
                boxShadow: '0 12px 30px rgba(59, 130, 246, 0.08)',
                fontSize: '1rem',
                color: '#1e293b',
                fontWeight: '600',
                lineHeight: '1.5',
                textAlign: 'center',
                minHeight: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {speechText}
              {/* Arrow */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: '18px',
                  height: '18px',
                  background: '#ffffff',
                  borderRight: '2px solid #bfdbfe',
                  borderBottom: '2px solid #bfdbfe',
                }}
              />
            </div>

            {/* Robot Image or SVG component container */}
            <div
              style={{
                width: '100%',
                height: '240px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: started ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.5s ease',
              }}
            >
              {!started ? (
                <img
                  src={AI}
                  alt="Waving AI Assistant"
                  style={{
                    height: '100%',
                    maxHeight: '230px',
                    borderRadius: '28px',
                    boxShadow: '0 16px 36px rgba(59, 130, 246, 0.12)',
                  }}
                />
              ) : (
                <TalkingRobot isTalking={isTalking} />
              )}
            </div>

            {/* Controls */}
            <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
              <input
                className="search-input"
                type="search"
                placeholder="Search a JavaScript topic"
                style={{
                  flex: '1 1 240px',
                  minWidth: '240px',
                  padding: '14px 22px',
                  borderRadius: '999px',
                  border: '2px solid #e2e8f0',
                  background: '#ffffff',
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                className="start-btn"
                onClick={handleStart}
                disabled={started}
                style={{
                  padding: '14px 32px',
                  borderRadius: '999px',
                  border: 'none',
                  background: started ? '#94a3b8' : '#2563eb',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: started ? 'default' : 'pointer',
                  pointerEvents: started ? 'none' : 'auto',
                  boxShadow: started ? 'none' : '0 10px 24px rgba(37, 99, 235, 0.2)',
                }}
              >
                {started ? 'Learning Started' : 'Start Learning'}
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Topics list */}
          <div
            className="topics-container"
            style={{
              flex: '1 1 350px',
              maxWidth: '550px',
              width: '100%',
              opacity: started ? 1 : 0,
              transform: started ? 'translateX(0)' : 'translateX(30px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              pointerEvents: started ? 'auto' : 'none',
              display: started ? 'block' : 'none',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ margin: '0 0 10px', fontSize: '2rem', fontWeight: '800', color: '#1e3a8a' }}>JavaScript Topics</h2>
              <p style={{ margin: '0 0 24px', color: '#475569', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Here are the core topics we will cover. Click a topic to explore or search above.
              </p>
              <ul className="topics-list" style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {topics.map(topic => (
                  <li
                    key={topic}
                    className="topic-item"
                    style={{
                      padding: '18px 20px',
                      borderRadius: '20px',
                      background: '#ffffff',
                      color: '#2563eb',
                      fontWeight: '700',
                      fontSize: '1.05rem',
                      border: '2px solid #e0f2fe',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span>⚡</span> {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
