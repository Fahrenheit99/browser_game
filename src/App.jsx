import { useEffect, useState } from 'react';

const GRAVITY = 0.5;
const JUMP_POWER = 10;
const SPEED = 4;

function App() {
  const [x, setX] = useState(80);
  const [y, setY] = useState(220);
  const [vx, setVx] = useState(0);
  const [vy, setVy] = useState(0);
  const [onGround, setOnGround] = useState(true);
  const [keys, setKeys] = useState({ left: false, right: false, jump: false });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') setKeys((k) => ({ ...k, left: true }));
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') setKeys((k) => ({ ...k, right: true }));
      if (event.key === 'ArrowUp' || event.key === ' ' || event.key.toLowerCase() === 'w') setKeys((k) => ({ ...k, jump: true }));
    };

    const handleKeyUp = (event) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') setKeys((k) => ({ ...k, left: false }));
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') setKeys((k) => ({ ...k, right: false }));
      if (event.key === 'ArrowUp' || event.key === ' ' || event.key.toLowerCase() === 'w') setKeys((k) => ({ ...k, jump: false }));
    };

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
      const delta = time - lastTime;
      lastTime = time;

      setVx((prevVx) => {
        let nextVx = prevVx;
        if (keys.left) nextVx = -SPEED;
        if (keys.right) nextVx = SPEED;
        if (!keys.left && !keys.right) nextVx = 0;
        return nextVx;
      });

      setY((prevY) => {
        let nextY = prevY;
        let nextVy = vy;
        if (keys.jump && onGround) {
          nextVy = -JUMP_POWER;
          setOnGround(false);
        }

        nextVy += GRAVITY * (delta / 16.67);
        nextY += nextVy * (delta / 16.67);

        if (nextY >= 220) {
          nextY = 220;
          nextVy = 0;
          setOnGround(true);
        }

        setVy(nextVy);
        return nextY;
      });

      setX((prevX) => {
        let nextX = prevX + vx * (delta / 16.67);
        if (nextX < 20) nextX = 20;
        if (nextX > 560) nextX = 560;
        return nextX;
      });

      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [keys, onGround, vx, vy]);

  return (
    <div className="game-shell">
      <h1>React Platformer</h1>
      <p>Use A/D or arrow keys to move, and W/Space to jump.</p>
      <div className="game-area">
        <div className="platform" style={{ left: 40, width: 220, top: 280 }} />
        <div className="platform" style={{ left: 320, width: 180, top: 220 }} />
        <div className="platform" style={{ left: 120, width: 140, top: 360 }} />
        <div className="player" style={{ left: x, top: y }} />
      </div>
    </div>
  );
}

export default App;
