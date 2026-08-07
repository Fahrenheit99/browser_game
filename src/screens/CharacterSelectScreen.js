import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CHARACTERS } from '../data/characters';
import CharacterThumbnail from '../components/CharacterThumbnail';
import { getTheme } from '../styles/theme';

export default function CharacterSelectScreen({ selectedCharacterId, onSelectCharacter, onBack, highContrast = false }) {
  const theme = getTheme(highContrast);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backButtonText, { color: theme.text }]}>{'\u2190'} Menu</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Characters</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.list}>
        {CHARACTERS.map((character) => {
          const isSelected = character.id === selectedCharacterId;
          return (
            <Pressable
              key={character.id}
              disabled={character.locked}
              style={[
                styles.card,
                {
                  borderColor: isSelected ? theme.primary : theme.border,
                  backgroundColor: character.locked ? theme.locked : theme.background,
                },
              ]}
              onPress={() => onSelectCharacter(character)}
            >
              <CharacterThumbnail character={character} size={56} placeholderColor={theme.locked} />
              <View style={styles.cardText}>
                <Text style={[styles.cardName, { color: character.locked ? theme.background : theme.text }]}>
                  {character.name}
                  {character.locked ? ' 🔒' : ''}
                  {isSelected ? ' ✓' : ''}
                </Text>
                <Text style={[styles.cardDescription, { color: character.locked ? theme.background : theme.muted }]}>
                  {character.description}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
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
    width: 420,
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
  list: {
    width: 420,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 3,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardText: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 13,
    marginTop: 4,
  },
});
