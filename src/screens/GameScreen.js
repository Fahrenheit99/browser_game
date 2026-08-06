import { useEffect, useRef, useState } from 'react';
import { View, Image, Pressable, StyleSheet, Text } from 'react-native';

import idleSheet from '../assets/sprites/Slime1_Idle_without_shadow.png';
import walkSheet from '../assets/sprites/Slime1_Walk_without_shadow.png';
import deathSheet from '../assets/sprites/Slime1_Death_without_shadow.png';
import { getTheme, CONTROL_SIZES } from '../styles/theme';

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
const DASH_SPEED = MAX_SPEED * 2.2;
const DASH_DURATION = 220;
const DOUBLE_TAP_WINDOW = 300;

// The spritesheets are laid out as [row = facing direction][col = animation frame],
// each frame a 64x64 square. Row 2 is the left-facing strip; the right-facing look
// is achieved by mirroring that same row horizontally.
const SPRITE_ROW = 2;
const IDLE_FRAME_COUNT = 6;
const WALK_FRAME_COUNT = 8;
const DUCK_FRAME_COUNT = 10;
const DUCK_FROZEN_FRAME = DUCK_FRAME_COUNT - 1;
const FRAME_DURATION = 120;

// --- Atomic game-logic helpers ---
// Each function handles exactly one rule and has no side effects,
// so the main loop below reads like a checklist and each piece is easy
// to test/reason about in isolation.

function getHorizontalInput(keys) {
  return (keys.left ? -1 : 0) + (keys.right ? 1 : 0);
}

function updateHorizontalVelocity(vx, input, dt) {
  if (input !== 0) {
    const next = vx + input * ACCEL * dt;
    return Math.max(-MAX_SPEED, Math.min(MAX_SPEED, next));
  }
  if (vx === 0) return 0;
  const decel = FRICTION * dt;
  return Math.abs(vx) <= decel ? 0 : vx - Math.sign(vx) * decel;
}

function clampPositionX(x) {
  return Math.max(0, Math.min(ARENA_WIDTH - PLAYER_WIDTH, x));
}

function shouldStartJump(keys) {
  return keys.jump && !keys.duck;
}

function applyJumpCut(vy, jumpHeld) {
  const jumpCutVelocity = -JUMP_POWER * JUMP_CUT_MULTIPLIER;
  return !jumpHeld && vy < jumpCutVelocity ? jumpCutVelocity : vy;
}

function applyGravity(vy, dt) {
  return vy + GRAVITY * dt;
}

function resolveGroundCollision(y, vy) {
  const floorY = GROUND_Y - PLAYER_HEIGHT;
  if (y >= floorY) {
    return { y: floorY, vy: 0, onGround: true };
  }
  return { y, vy, onGround: false };
}

function resolveFacing(currentFacing, vx) {
  if (vx === 0) return currentFacing;
  return vx < 0 ? 'left' : 'right';
}

function isGroundDucking(onGround, duckHeld) {
  return onGround && duckHeld;
}

function getPlayerHeight(ducking) {
  return ducking ? DUCK_HEIGHT : PLAYER_HEIGHT;
}

function advanceAnimationFrame(animTimer, animFrame, rawDelta, frameCount) {
  let timer = animTimer + rawDelta;
  let frame = animFrame;
  if (timer >= FRAME_DURATION) {
    timer %= FRAME_DURATION;
    frame = (frame + 1) % frameCount;
  }
  return { animTimer: timer, animFrame: frame };
}

function getSpriteConfig(ducking, moving) {
  if (ducking) {
    return { sheet: deathSheet, frameCount: DUCK_FRAME_COUNT, frozenFrame: DUCK_FROZEN_FRAME };
  }
  if (moving) {
    return { sheet: walkSheet, frameCount: WALK_FRAME_COUNT, frozenFrame: null };
  }
  return { sheet: idleSheet, frameCount: IDLE_FRAME_COUNT, frozenFrame: null };
}

export default function GameScreen({ stage, controlSize = 'normal', highContrast = false, onExit }) {
  const theme = getTheme(highContrast);
  const buttonSize = CONTROL_SIZES[controlSize] ?? CONTROL_SIZES.normal;
  const dPadSize = buttonSize * 2.6;
  const armOffset = dPadSize / 2 - buttonSize / 2;

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
    dashTimeRemaining: 0,
    dashDirection: 0,
    lastLeftTap: 0,
    lastRightTap: 0,
    doubleJumpAvailable: true,
    jumpKeyWasDown: false,
  });

  const setKey = (key, value) => {
    keysRef.current[key] = value;
  };

  const handleDirectionPress = (direction) => {
    const now = Date.now();
    const state = stateRef.current;
    const tapKey = direction === 'left' ? 'lastLeftTap' : 'lastRightTap';
    if (now - state[tapKey] < DOUBLE_TAP_WINDOW) {
      state.dashTimeRemaining = DASH_DURATION;
      state.dashDirection = direction === 'left' ? -1 : 1;
    }
    state[tapKey] = now;
    setKey(direction, true);
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

      const groundDucking = isGroundDucking(state.onGround, keys.duck);
      const ducking = keys.duck;

      if (state.dashTimeRemaining > 0) {
        state.dashTimeRemaining = Math.max(0, state.dashTimeRemaining - rawDelta);
      }

      // Horizontal movement
      if (groundDucking) {
        state.vx = 0;
      } else if (state.dashTimeRemaining > 0) {
        state.vx = state.dashDirection * DASH_SPEED;
      } else {
        const input = getHorizontalInput(keys);
        state.vx = updateHorizontalVelocity(state.vx, input, dt);
      }
      state.x = clampPositionX(state.x + state.vx * dt);

      // Vertical movement (jump / gravity / landing)
      const jumpPressedEdge = keys.jump && !state.jumpKeyWasDown;
      if (state.onGround) {
        state.doubleJumpAvailable = true;
        state.vy = 0;
        if (shouldStartJump(keys)) {
          state.vy = -JUMP_POWER;
          state.onGround = false;
        }
      } else {
        if (jumpPressedEdge && state.doubleJumpAvailable) {
          state.vy = -JUMP_POWER;
          state.doubleJumpAvailable = false;
        }
        state.vy = applyJumpCut(state.vy, keys.jump);
        state.vy = applyGravity(state.vy, dt);
        state.y += state.vy * dt;

        const landing = resolveGroundCollision(state.y, state.vy);
        state.y = landing.y;
        state.vy = landing.vy;
        state.onGround = landing.onGround;
      }
      state.jumpKeyWasDown = keys.jump;

      state.facing = resolveFacing(state.facing, state.vx);

      // Animation
      if (!ducking) {
        const isMoving = state.vx !== 0;
        const frameCount = isMoving ? WALK_FRAME_COUNT : IDLE_FRAME_COUNT;
        const anim = advanceAnimationFrame(state.animTimer, state.animFrame, rawDelta, frameCount);
        state.animTimer = anim.animTimer;
        state.animFrame = anim.animFrame;
        setFrame(state.animFrame % frameCount);
        setMoving(isMoving);
      }

      setX(state.x);
      setY(state.y);
      setDucking(ducking);
      setFacing(state.facing);

      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const height = getPlayerHeight(ducking);
  const { sheet, frameCount, frozenFrame } = getSpriteConfig(ducking, moving);
  const displayFrame = frozenFrame !== null ? frozenFrame : frame;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable style={[styles.backButton, { borderColor: theme.border }]} onPress={onExit}>
          <Text style={[styles.backButtonText, { color: theme.text }]}>{'\u2190'} Menu</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>{stage?.name ?? 'Browser Platformer'}</Text>
        <View style={styles.backButton} />
      </View>
      <View
        style={[
          styles.arena,
          { width: ARENA_WIDTH, height: ARENA_HEIGHT, borderColor: theme.border, backgroundColor: stage?.arenaBg ?? theme.background },
        ]}
      >
        <View style={[styles.floor, { height: FLOOR_HEIGHT, backgroundColor: stage?.floorColor ?? theme.border }]} />
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
        <View style={[styles.dPad, { width: dPadSize, height: dPadSize }]}>
          <Pressable
            style={[
              styles.dPadArm,
              { width: buttonSize, height: buttonSize, top: 0, left: armOffset, backgroundColor: theme.primary },
            ]}
            onPressIn={() => setKey('jump', true)}
            onPressOut={() => setKey('jump', false)}
          >
            <Text style={[styles.buttonText, { color: theme.primaryText, fontSize: buttonSize / 2 }]}>▲</Text>
          </Pressable>
          <Pressable
            style={[
              styles.dPadArm,
              { width: buttonSize, height: buttonSize, top: dPadSize - buttonSize, left: armOffset, backgroundColor: theme.primary },
            ]}
            onPressIn={() => setKey('duck', true)}
            onPressOut={() => setKey('duck', false)}
          >
            <Text style={[styles.buttonText, { color: theme.primaryText, fontSize: buttonSize / 2 }]}>▼</Text>
          </Pressable>
          <Pressable
            style={[
              styles.dPadArm,
              { width: buttonSize, height: buttonSize, top: armOffset, left: 0, backgroundColor: theme.primary },
            ]}
            onPressIn={() => handleDirectionPress('left')}
            onPressOut={() => setKey('left', false)}
          >
            <Text style={[styles.buttonText, { color: theme.primaryText, fontSize: buttonSize / 2 }]}>◀</Text>
          </Pressable>
          <Pressable
            style={[
              styles.dPadArm,
              { width: buttonSize, height: buttonSize, top: armOffset, left: dPadSize - buttonSize, backgroundColor: theme.primary },
            ]}
            onPressIn={() => handleDirectionPress('right')}
            onPressOut={() => setKey('right', false)}
          >
            <Text style={[styles.buttonText, { color: theme.primaryText, fontSize: buttonSize / 2 }]}>▶</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ARENA_WIDTH,
  },
  backButton: {
    minWidth: 80,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  arena: {
    position: 'relative',
    borderWidth: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  floor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  player: {
    position: 'absolute',
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dPad: {
    position: 'relative',
  },
  dPadArm: {
    position: 'absolute',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
