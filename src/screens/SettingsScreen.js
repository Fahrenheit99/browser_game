import { View, Text, Pressable, StyleSheet } from 'react-native';
import { getTheme } from '../styles/theme';

const CONTROL_SIZE_OPTIONS = [
  { key: 'small', label: 'Small' },
  { key: 'normal', label: 'Normal' },
  { key: 'large', label: 'Large' },
];

function OptionRow({ label, theme, children }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      <View style={styles.rowControl}>{children}</View>
    </View>
  );
}

export default function SettingsScreen({
  controlSize,
  onChangeControlSize,
  highContrast,
  onToggleHighContrast,
  onBack,
}) {
  const theme = getTheme(highContrast);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backButtonText, { color: theme.text }]}>{'\u2190'} Menu</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.panel}>
        <OptionRow label="Control size" theme={theme}>
          {CONTROL_SIZE_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              style={[
                styles.choiceButton,
                {
                  borderColor: theme.border,
                  backgroundColor: controlSize === option.key ? theme.primary : 'transparent',
                },
              ]}
              onPress={() => onChangeControlSize(option.key)}
            >
              <Text
                style={{
                  color: controlSize === option.key ? theme.primaryText : theme.text,
                  fontWeight: 'bold',
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </OptionRow>

        <OptionRow label="High contrast mode" theme={theme}>
          <Pressable
            style={[
              styles.choiceButton,
              {
                borderColor: theme.border,
                backgroundColor: highContrast ? theme.primary : 'transparent',
              },
            ]}
            onPress={onToggleHighContrast}
          >
            <Text style={{ color: highContrast ? theme.primaryText : theme.text, fontWeight: 'bold' }}>
              {highContrast ? 'On' : 'Off'}
            </Text>
          </Pressable>
        </OptionRow>
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
  panel: {
    width: 420,
    gap: 20,
  },
  row: {
    gap: 8,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rowControl: {
    flexDirection: 'row',
    gap: 10,
  },
  choiceButton: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});
