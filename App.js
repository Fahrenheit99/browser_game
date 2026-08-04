import { useEffect, useRef, useState } from 'react';
import { View, Image, Pressable, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import idleSheet from './src/assets/sprites/Slime1_Idle_without_shadow.png';
import walkSheet from './src/assets/sprites/Slime1_Walk_without_shadow.png';
import deathSheet from './src/assets/sprites/Slime1_Death_without_shadow.png';

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

export default function App() {
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

  const setKey = (key, value) => {
    keysRef.current[key] = value;
  };

  useEffect(() => {
    let animationFrame;
    let lastTime = Date.now();

    const loop = () => {
      const time = Date.now();
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
    <View style={styles.screen}>
      <StatusBar hidden />
      <Text style={styles.title}>Browser Platformer</Text>
      <View style={[styles.arena, { width: ARENA_WIDTH, height: ARENA_HEIGHT }]}>
        <View style={[styles.floor, { height: FLOOR_HEIGHT }]} />
        <View
          style={[
            styles.player,
            {
              left: x,
              top: y,
              width: PLAYER_WIDTH,
              height,
              transform: [{ scaleX: facing === 'right' ? -1 : 1 }],
            },
          ]}
        >
          <Image
            source={sheet}
            style={{
              width: PLAYER_WIDTH * frameCount,
              height: height * 4,
              transform: [
                { translateX: -displayFrame * PLAYER_WIDTH },
                { translateY: -SPRITE_ROW * height },
              ],
            }}
          />
        </View>
      </View>

      <View style={[styles.controls, { width: ARENA_WIDTH }]}>
        <View style={styles.buttonGroup}>
          <Pressable style={styles.button} onPressIn={() => setKey('left', true)} onPressOut={() => setKey('left', false)}>
            <Text style={styles.buttonText}>◀</Text>
          </Pressable>
          <Pressable style={styles.button} onPressIn={() => setKey('right', true)} onPressOut={() => setKey('right', false)}>
            <Text style={styles.buttonText}>▶</Text>
          </Pressable>
        </View>
        <View style={styles.buttonGroup}>
          <Pressable style={styles.button} onPressIn={() => setKey('duck', true)} onPressOut={() => setKey('duck', false)}>
            <Text style={styles.buttonText}>DUCK</Text>
          </Pressable>
          <Pressable style={styles.button} onPressIn={() => setKey('jump', true)} onPressOut={() => setKey('jump', false)}>
            <Text style={styles.buttonText}>JUMP</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  arena: {
    position: 'relative',
    borderWidth: 4,
    borderColor: '#111827',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  floor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#111827',
  },
  player: {
    position: 'absolute',
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
