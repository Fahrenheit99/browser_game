import { View, Text, Pressable, StyleSheet } from 'react-native';
import { STAGES } from '../data/stages';
import { getTheme } from '../styles/theme';

export default function StagesScreen({ onSelectStage, onBack, highContrast = false }) {
  const theme = getTheme(highContrast);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backButtonText, { color: theme.text }]}>{'\u2190'} Menu</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Stages</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.list}>
        {STAGES.map((stage) => (
          <Pressable
            key={stage.id}
            disabled={stage.locked}
            style={[
              styles.stageCard,
              { borderColor: theme.border, backgroundColor: stage.locked ? theme.locked : stage.arenaBg },
            ]}
            onPress={() => onSelectStage(stage)}
          >
            <Text style={[styles.stageName, { color: stage.locked ? theme.background : theme.border }]}>
              {stage.name}
              {stage.locked ? ' 🔒' : ''}
            </Text>
            <Text style={[styles.stageDescription, { color: stage.locked ? theme.background : theme.border }]}>
              {stage.description}
            </Text>
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
  stageCard: {
    borderWidth: 3,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  stageName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stageDescription: {
    fontSize: 13,
    marginTop: 4,
  },
});
