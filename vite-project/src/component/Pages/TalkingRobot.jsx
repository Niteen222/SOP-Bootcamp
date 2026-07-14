import React from 'react';
import './TalkingRobot.css';

export default function TalkingRobot({ isTalking }) {
  return (
    <div className="robot-container">
      {/* Decorative background aura */}
      <div className="robot-aura"></div>
      
      {/* Floating Robot SVG */}
      <svg className="talking-robot" viewBox="0 0 200 220" width="100%" height="100%">
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="50%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="neonGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0ea5e9" floodOpacity="0.15" />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          {/* Antenna */}
          <line x1="100" y1="40" x2="100" y2="20" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="15" r="8" fill="url(#neonGlowGrad)" className="antenna-glow" />
          
          {/* Ears / Side Connectors */}
          <rect x="30" y="65" width="15" height="30" rx="6" fill="#0284c7" className="ear-left" />
          <rect x="155" y="65" width="15" height="30" rx="6" fill="#0284c7" className="ear-right" />
          
          {/* Neck */}
          <rect x="85" y="120" width="30" height="15" rx="4" fill="#64748b" />
          
          {/* Head Panel */}
          <rect x="40" y="40" width="120" height="85" rx="24" fill="url(#bodyGrad)" stroke="#0284c7" strokeWidth="4" />
          
          {/* Screen Border Glow */}
          <rect x="50" y="50" width="100" height="65" rx="16" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
          
          {/* Screen */}
          <rect x="52" y="52" width="96" height="61" rx="14" fill="url(#screenGrad)" />
          
          {/* Eyes (Glowing LEDs) */}
          <g className="robot-eyes">
            <ellipse cx="76" cy="78" rx="8" ry="8" fill="#38bdf8" className="robot-eye eye-left" />
            <ellipse cx="124" cy="78" rx="8" ry="8" fill="#38bdf8" className="robot-eye eye-right" />
          </g>
          
          {/* Mouth (Equalizer visualizer that acts as lip-sync) */}
          <g className={`robot-mouth ${isTalking ? 'is-talking' : 'is-idle'}`}>
            <line x1="78" y1="98" x2="78" y2="98" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" className="mouth-bar bar-1" />
            <line x1="87" y1="98" x2="87" y2="98" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" className="mouth-bar bar-2" />
            <line x1="96" y1="98" x2="96" y2="98" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" className="mouth-bar bar-3" />
            <line x1="104" y1="98" x2="104" y2="98" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" className="mouth-bar bar-4" />
            <line x1="113" y1="98" x2="113" y2="98" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" className="mouth-bar bar-5" />
            <line x1="122" y1="98" x2="122" y2="98" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" className="mouth-bar bar-6" />
          </g>
          
          {/* Body */}
          <path d="M65,135 L135,135 L145,185 L55,185 Z" fill="url(#bodyGrad)" stroke="#0284c7" strokeWidth="4" strokeLinejoin="round" />
          
          {/* Interactive Chest Plate Heartbeat */}
          <rect x="75" y="145" width="50" height="28" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
          <path d="M80,159 L90,159 L93,150 L97,168 L101,154 L104,162 L107,159 L120,159" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="chest-heartbeat" 
          />
        </g>
        
        {/* Floating Shadow below Robot */}
        <ellipse cx="100" cy="205" rx="35" ry="5" fill="#cbd5e1" opacity="0.6" className="robot-shadow" />
      </svg>
    </div>
  );
}
