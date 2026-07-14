import Lesson from "./Lesson";
import AI from './AI.gif'

export default function Home() {
  return (
    <div style={{ padding: "20px", display: 'flex', gap: '20px' }}>
      <h1>🤖 AI Learning Buddy</h1>
      <div>
        <img src={AI} alt="" />
        <input type="search" />
        <button>
          Start Learning
        </button>
      </div>
    </div>
  );
}