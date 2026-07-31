import { useEffect, useRef, useState } from 'react';
import idleSheet from './assets/sprites/Slime1_Idle_without_shadow.png';
import walkSheet from './assets/sprites/Slime1_Walk_without_shadow.png';
import deathSheet from './assets/sprites/Slime1_Death_without_shadow.png';

const ARENA_WIDTH = 640;
const ARENA_HEIGHT = 420;
const FLOOR_HEIGHT = 24;
const PLAYER_WIDTH = 48;
const PLAYER_HEIGHT = 48;
const DUCK_HEIGHT = 30;
const GROUND_Y = ARENA_HEIGHT - FLOOR_HEIGHT;
const GRAVITY = 0.6;
const JUMP_POWER = 12;
const JUMP_CUT_MULTIPLIER = 0.4;
const MAX_SPEED = 4;
const ACCEL = 0.6;
const FRICTION = 0.5;

// The spritesheets are laid out as [row = facing direction][col = animation frame],
// each frame a 64x64 square. Row 2 is the left-facing strip; the right-facing look
// is achieved by mirroring that same row horizontally.
const SPRITE_ROW = 2;
const IDLE_FRAME_COUNT = 6;
const WALK_FRAME_COUNT = 8;
const DUCK_FRAME_COUNT = 10;
const DUCK_FROZEN_FRAME = 1;
const FRAME_DURATION = 120;

function App() {
  const [x, setX] = useState(80);
  const [y, setY] = useState(GROUND_Y - PLAYER_HEIGHT);
  const [ducking, setDucking] = useState(false);

  const [facing, setFacing] = useState('right');
  const [frame, setFrame] = useState(0);
  const [moving, setMoving] = useState(false);

  const keysRef = useRef({ left: false, right: false, jump: false, duck: false });
  const stateRef = useRef({
    x: 80,
    y: GROUND_Y - PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    onGround: true,
    facing: 'right',
    animTimer: 0,
    animFrame: 0,
  });

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
      const rawDelta = Math.min(time - lastTime, 32);
      const dt = rawDelta / 16.67;
      lastTime = time;

      const keys = keysRef.current;
      const state = stateRef.current;

      const isDucking = state.onGround && keys.duck;
      const height = isDucking ? DUCK_HEIGHT : PLAYER_HEIGHT;

      if (isDucking) {
        state.vx = 0;
      } else {
        const input = (keys.left ? -1 : 0) + (keys.right ? 1 : 0);
        if (input !== 0) {
          state.vx += input * ACCEL * dt;
          state.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, state.vx));
        } else if (state.vx !== 0) {
          const decel = FRICTION * dt;
          state.vx = Math.abs(state.vx) <= decel ? 0 : state.vx - Math.sign(state.vx) * decel;
        }
      }

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
        const jumpCutVelocity = -JUMP_POWER * JUMP_CUT_MULTIPLIER;
        if (!keys.jump && state.vy < jumpCutVelocity) {
          state.vy = jumpCutVelocity;
        }
        state.vy += GRAVITY * dt;
        state.y += state.vy * dt;
        if (state.y >= GROUND_Y - PLAYER_HEIGHT) {
          state.y = GROUND_Y - PLAYER_HEIGHT;
          state.vy = 0;
          state.onGround = true;
        }
      }

      if (state.vx !== 0) state.facing = state.vx < 0 ? 'left' : 'right';

      if (!isDucking) {
        const isMoving = state.vx !== 0;
        const frameCount = isMoving ? WALK_FRAME_COUNT : IDLE_FRAME_COUNT;
        state.animTimer += rawDelta;
        if (state.animTimer >= FRAME_DURATION) {
          state.animTimer %= FRAME_DURATION;
          state.animFrame = (state.animFrame + 1) % frameCount;
        }
        setFrame(state.animFrame % frameCount);
        setMoving(isMoving);
      }

      setX(state.x);
      setY(state.y);
      setDucking(isDucking);
      setFacing(state.facing);

      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const height = ducking ? DUCK_HEIGHT : PLAYER_HEIGHT;
  const sheet = ducking ? deathSheet : moving ? walkSheet : idleSheet;
  const frameCount = ducking ? DUCK_FRAME_COUNT : moving ? WALK_FRAME_COUNT : IDLE_FRAME_COUNT;
  const displayFrame = ducking ? DUCK_FROZEN_FRAME : frame;

  return (
    <div className="game-shell">
      <h1>Browser Platformer</h1>
      <p>Use A/D or arrow keys to move, W/Space/Up to jump, and S/Down to duck.</p>
      <div className="game-area" style={{ width: ARENA_WIDTH, height: ARENA_HEIGHT }}>
        <div className="floor" style={{ height: FLOOR_HEIGHT }} />
        <div
          className="player"
          style={{
            left: x,
            top: y,
            width: PLAYER_WIDTH,
            height,
            backgroundImage: `url(${sheet})`,
            backgroundSize: `${PLAYER_WIDTH * frameCount}px ${height * 4}px`,
            backgroundPosition: `-${displayFrame * PLAYER_WIDTH}px -${SPRITE_ROW * height}px`,
            transform: facing === 'right' ? 'scaleX(-1)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

export default App;


