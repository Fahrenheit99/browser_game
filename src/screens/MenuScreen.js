import { View, Text, Pressable, StyleSheet } from 'react-native';
import { getTheme } from '../styles/theme';

const MENU_ITEMS = [
  { key: 'stages', label: 'Play' },
  { key: 'characters', label: 'Characters' },
  { key: 'settings', label: 'Settings' },
  { key: 'about', label: 'About' },
];

export default function MenuScreen({ onNavigate, highContrast = false }) {
  const theme = getTheme(highContrast);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Browser Platformer</Text>
      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.key}
            style={[styles.menuButton, { backgroundColor: theme.primary }]}
            onPress={() => onNavigate(item.key)}
          >
            <Text style={[styles.menuButtonText, { color: theme.primaryText }]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  menu: {
    gap: 16,
    width: 220,
  },
  menuButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
