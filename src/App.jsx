import { useEffect, useRef, useState } from 'react';

const ARENA_WIDTH = 640;
const ARENA_HEIGHT = 420;
const FLOOR_HEIGHT = 24;
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 48;
const DUCK_HEIGHT = 24;
const GROUND_Y = ARENA_HEIGHT - FLOOR_HEIGHT;
const GRAVITY = 0.6;
const JUMP_POWER = 12;
const SPEED = 4;

function App() {
  const [x, setX] = useState(80);
  const [y, setY] = useState(GROUND_Y - PLAYER_HEIGHT);
  const [ducking, setDucking] = useState(false);

  const keysRef = useRef({ left: false, right: false, jump: false, duck: false });
  const stateRef = useRef({ x: 80, y: GROUND_Y - PLAYER_HEIGHT, vx: 0, vy: 0, onGround: true });

  useEffect(() => {
    const setKey = (key, value) => {
      const k = keysRef.current;
      const lower = key.toLowerCase();
      if (key === 'ArrowLeft' || lower === 'a') k.left = value;
      if (key === 'ArrowRight' || lower === 'd') k.right = value;
      if (key === 'ArrowUp' || key === ' ' || lower === 'w') k.jump = value;
      if (key === 'ArrowDown' || lower === 's') k.duck = value;
    };

    const handleKeyDown = (event) => setKey(event.key, true);
    const handleKeyUp = (event) => setKey(event.key, false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let animationFrame;
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = Math.min(time - lastTime, 32) / 16.67;
      lastTime = time;

      const keys = keysRef.current;
      const state = stateRef.current;

      const isDucking = state.onGround && keys.duck;
      const height = isDucking ? DUCK_HEIGHT : PLAYER_HEIGHT;

      state.vx = isDucking ? 0 : keys.left ? -SPEED : keys.right ? SPEED : 0;
      state.x += state.vx * dt;
      if (state.x < 0) state.x = 0;
      if (state.x > ARENA_WIDTH - PLAYER_WIDTH) state.x = ARENA_WIDTH - PLAYER_WIDTH;

      if (state.onGround) {
        state.vy = 0;
        state.y = GROUND_Y - height;
        if (keys.jump && !keys.duck) {
          state.vy = -JUMP_POWER;
          state.onGround = false;
        }
      } else {
        state.vy += GRAVITY * dt;
        state.y += state.vy * dt;
        if (state.y >= GROUND_Y - PLAYER_HEIGHT) {
          state.y = GROUND_Y - PLAYER_HEIGHT;
          state.vy = 0;
          state.onGround = true;
        }
      }

      setX(state.x);
      setY(state.y);
      setDucking(isDucking);

      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="game-shell">
      <h1>Browser Platformer</h1>
      <p>Use A/D or arrow keys to move, W/Space/Up to jump, and S/Down to duck.</p>
      <div className="game-area" style={{ width: ARENA_WIDTH, height: ARENA_HEIGHT }}>
        <div className="floor" style={{ height: FLOOR_HEIGHT }} />
        <div
          className="player"
          style={{ left: x, top: y, width: PLAYER_WIDTH, height: ducking ? DUCK_HEIGHT : PLAYER_HEIGHT }}
        />
      </div>
    </div>
  );
}

export default App;


