import { View, Image, StyleSheet } from 'react-native';
import { CHARACTER_FRAME_SIZE, CHARACTER_ROWS } from '../data/characters';

// Crops a single static idle frame out of a character's sprite sheet, for use
// as a thumbnail in menus/select screens. Renders a plain placeholder box
// when the character has no sprites yet (e.g. locked "coming soon" entries).
export default function CharacterThumbnail({ character, size = CHARACTER_FRAME_SIZE, style, placeholderColor }) {
  const idle = character?.sprites?.idle;

  if (!idle) {
    return <View style={[styles.frame, { width: size, height: size, backgroundColor: placeholderColor }, style]} />;
  }

  const scale = size / CHARACTER_FRAME_SIZE;

  return (
    <View style={[styles.frame, { width: size, height: size }, style]}>
      <Image
        source={idle.sheet}
        style={{
          width: CHARACTER_FRAME_SIZE * idle.frameCount * scale,
          height: CHARACTER_FRAME_SIZE * CHARACTER_ROWS * scale,
          transform: [{ translateY: -character.spriteRow * CHARACTER_FRAME_SIZE * scale }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    borderRadius: 8,
  },
});
