import { View, Text, Pressable, StyleSheet, ScrollView, Linking } from 'react-native';
import { getTheme } from '../styles/theme';

const FEATURES = [
  'Simple player movement with on-screen left/right buttons',
  'Jump and duck mechanics via on-screen buttons',
  'Animated slime sprite (idle/walk/duck states) built from sprite sheets',
  "Runs natively on Android/iOS and in the browser via Expo's web support",
];

export default function AboutScreen({ onBack, highContrast = false }) {
  const theme = getTheme(highContrast);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backButtonText, { color: theme.text }]}>{'\u2190'} Menu</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>About</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.heading, { color: theme.text }]}>Browser Platformer</Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          A small 2D platformer built with React Native and Expo. The project includes a simple
          playable scene with a moving character, jumping, ducking, and basic on-screen controls,
          and runs on Android, iOS, and web from a single codebase.
        </Text>

        <Text style={[styles.subheading, { color: theme.text }]}>Features</Text>
        {FEATURES.map((feature) => (
          <Text key={feature} style={[styles.listItem, { color: theme.text }]}>
            {'\u2022'} {feature}
          </Text>
        ))}

        <Text style={[styles.subheading, { color: theme.text }]}>Controls</Text>
        <Text style={[styles.listItem, { color: theme.text }]}>{'\u25c0'} / {'\u25b6'} buttons: move left / right</Text>
        <Text style={[styles.listItem, { color: theme.text }]}>JUMP button: jump</Text>
        <Text style={[styles.listItem, { color: theme.text }]}>DUCK button: duck</Text>

        <Text style={[styles.subheading, { color: theme.text }]}>AI & Asset Disclosure</Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          This project was built entirely with the assistance of AI (GitHub Copilot) — all game
          logic, code, and iterative changes in this repository were generated and refined through
          AI pair-programming.
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          The character sprites (idle/walk/death sprite sheets) are free-license assets from{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://craftpix.net')}>
            CraftPix
          </Text>{' '}
          (freebie tier). Under CraftPix&apos;s freebie license, these assets may be used freely in
          personal and commercial projects; no attribution is required, but credit is appreciated,
          so it&apos;s given here.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 480,
  },
  backButton: {
    minWidth: 80,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scroll: {
    width: 480,
    maxHeight: 420,
  },
  scrollContent: {
    gap: 8,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
  },
  link: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
