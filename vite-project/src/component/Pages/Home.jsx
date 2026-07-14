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
  const [speechText, setSpeechText] = useState("Beep Boop! 🤖 Ready for a magical coding adventure? ✨");
  
  // Progression state
  const [unlockedCount, setUnlockedCount] = useState(1);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [question, setQuestion] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);

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
      speakText("Beep boop! Ready for a magical coding adventure?");
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

  const handleBackToHome = () => {
    // Reset lesson state and stop any speaking
    setStarted(false);
    setActiveTopicIndex(0);
    setSelectedTopic(null);
    setUserAnswer('');
    setFeedback(null);
    setSpeechText("Hi! How may I help you? 👋");
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Interactive topic quiz: show arrows and ask variable/value question
  const handleTopicClickInteractive = (topic) => {
    setSelectedTopic(topic);
    setUserAnswer('');
    setFeedback(null);

    if (topic === 'Variables') {
      setQuestion('Which token in the statement \nlet x = 5;\n is the variable name? Type the variable name.');
      setSpeechText('Identify the variable in this code: let x equals five. Which token is the variable name?');
      speakText('Identify the variable in this code: let x equals five. Which token is the variable name?');
    } else {
      setQuestion(`Explain what is the key idea behind ${topic}.`);
      setSpeechText(`Tell me briefly: what is the key idea behind ${topic}?`);
      speakText(`Tell me briefly: what is the key idea behind ${topic}?`);
    }
  };

  const checkAnswer = () => {
    if (!selectedTopic) return;
    const answer = (userAnswer || '').trim().toLowerCase();
    let correct = false;
    let expected = '';

    if (selectedTopic === 'Variables') {
      expected = 'x';
      correct = answer === expected;
    } else {
      // For non-variables topics accept any non-empty response as "answered"
      correct = answer.length > 2;
    }

    if (correct) {
      setFeedback({ ok: true, text: 'Correct — well done!' });
      speakText('Correct! Great job.');
      // progress to next topic after a short delay
      setTimeout(() => {
        completeTopic();
        setSelectedTopic(null);
      }, 1200);
    } else {
      setFeedback({ ok: false, text: `Not quite — try again.` });
      speakText('Not quite, please try again.');
    }
  };

  return (
    <div className="root-container premium-bg" style={{ minHeight: '100vh', padding: '32px 24px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; font-family: 'Outfit', sans-serif; }
        
        /* Premium Background Animation */
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .premium-bg {
          background: linear-gradient(-45deg, #f0f7ff, #e0f2fe, #dbeafe, #eff6ff);
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }

        @keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes floatAnim { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        
        .interactive-card {
          display: flex;
          gap: 32px;
          align-items: stretch;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 30px 60px rgba(37, 99, 235, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
          border-radius: 36px;
          padding: 40px;
          width: 100%;
          animation: popIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sidebar {
          flex: 0 0 280px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border-radius: 28px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.05);
          animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1);
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
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.3);
          transform: scale(1.02);
        }

        .btn {
          padding: 16px 36px;
          border-radius: 999px;
          border: none;
          font-size: 1.15rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .start-btn { 
          background: linear-gradient(135deg, #f59e0b, #ef4444); 
          box-shadow: 0 10px 24px rgba(239, 68, 68, 0.3), inset 0 -4px 0 rgba(0,0,0,0.15); 
          animation: floatAnim 3s infinite;
        }
        .start-btn:hover { 
          transform: translateY(-4px) scale(1.05); 
          box-shadow: 0 15px 30px rgba(239, 68, 68, 0.4), inset 0 -4px 0 rgba(0,0,0,0.15); 
        }
        .start-btn:active {
          transform: translateY(2px);
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3), inset 0 -1px 0 rgba(0,0,0,0.15);
        }

        /* Quiz panel styles */
        .quiz-panel {
          width: 100%;
          background: #fff;
          border: 1px solid #e6eefc;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 12px 28px rgba(14, 165, 233, 0.06);
          display: flex;
          gap: 14px;
          align-items: center;
          justify-content: space-between;
        }

        .code-box {
          flex: 1 1 320px;
          background: #0f172a;
          color: #e6f8ff;
          padding: 18px;
          border-radius: 12px;
          position: relative;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
          font-weight: 700;
        }

        .arrow-left, .arrow-right {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.06);
          padding: 6px 10px;
          border-radius: 999px;
          color: #c7f0ff;
          font-weight: 800;
        }
        .arrow-left { left: -20px; }
        .arrow-right { right: -20px; }

        .answer-input {
          flex: 0 0 280px;
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: flex-end;
        }

        .feedback-ok { color: #059669; font-weight: 800; }
        .feedback-bad { color: #dc2626; font-weight: 800; }
        .complete-btn { background: #16a34a; box-shadow: 0 10px 24px rgba(22, 163, 74, 0.2); width: 100%; }
        .complete-btn:hover { background: #15803d; transform: translateY(-2px); }
        
        .back-btn { 
          background: #ffffff; 
          color: #475569; 
          border: 2px solid #e2e8f0; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
        }
        .back-btn:hover { 
          background: #f8fafc; 
          border-color: #cbd5e1;
          color: #1e293b;
          transform: translateY(-2px); 
          box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        }
        
        .speech-bubble-premium {
          position: relative;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(191, 219, 254, 0.6);
          border-radius: 28px;
          padding: 20px 32px;
          width: fit-content;
          maxWidth: 90%;
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.12);
          font-size: 1.15rem;
          color: #1e293b;
          font-weight: 600;
          text-align: center;
          min-height: 85px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: floatAnim 6s ease-in-out infinite;
        }
        .speech-bubble-pointer {
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.9);
          border-right: 2px solid rgba(191, 219, 254, 0.6);
          border-bottom: 2px solid rgba(191, 219, 254, 0.6);
        }

        .bot-container {
          animation: floatAnim 5s ease-in-out infinite reverse;
        }

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
                      onClick={() => { handleSelectTopic(index); handleTopicClickInteractive(topic.name); }}
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
            <div className="speech-bubble-premium">
              {speechText}
              <div className="speech-bubble-pointer" />
            </div>

            <div className="bot-container" style={{ width: '100%', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '', background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', animation: 'popIn 0.5s ease-out' }}>
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
                <button className="btn back-btn" onClick={handleBackToHome} style={{ marginTop: 8 }}>
                  <span>🔙</span> Back to Home
                </button>
                {/* Interactive quiz panel for variable/value identification */}
                {selectedTopic && (
                  <div className="quiz-panel" style={{ marginTop: 18 }}>
                    <div className="code-box">
                      <div className="arrow-left">variable →</div>
                      <div className="arrow-right">← value</div>
                      <pre style={{ margin: 0, fontSize: '1.05rem' }}>{`let x = 5;`}</pre>
                    </div>

                    <div className="answer-input">
                      <div style={{ textAlign: 'right', marginRight: 8, maxWidth: 220 }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Question</div>
                        <div style={{ fontSize: '0.95rem', color: '#334155', whiteSpace: 'pre-wrap' }}>{question}</div>
                      </div>

                      <input
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer"
                        style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', minWidth: 160 }}
                      />

                      <button onClick={checkAnswer} className="btn" style={{ background: '#2563eb' }}>Check</button>

                      {feedback && (
                        <div style={{ marginLeft: 12 }} className={feedback.ok ? 'feedback-ok' : 'feedback-bad'}>{feedback.text}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
