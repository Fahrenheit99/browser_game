import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import MenuScreen from './src/screens/MenuScreen';
import StagesScreen from './src/screens/StagesScreen';
import CharacterSelectScreen from './src/screens/CharacterSelectScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import GameScreen from './src/screens/GameScreen';
import { STAGES } from './src/data/stages';
import { CHARACTERS, getCharacterById } from './src/data/characters';

export default function App() {
  const [view, setView] = useState('menu');
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState(CHARACTERS[0].id);
  const [controlSize, setControlSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  const goToMenu = () => setView('menu');

  const handleSelectStage = (stage) => {
    if (stage.locked) return;
    setSelectedStage(stage);
    setView('game');
  };

  const handleSelectCharacter = (character) => {
    if (character.locked) return;
    setSelectedCharacterId(character.id);
  };

  return (
    <>
      <StatusBar hidden />
      {view === 'menu' && <MenuScreen onNavigate={setView} highContrast={highContrast} />}
      {view === 'stages' && (
        <StagesScreen onSelectStage={handleSelectStage} onBack={goToMenu} highContrast={highContrast} />
      )}
      {view === 'characters' && (
        <CharacterSelectScreen
          selectedCharacterId={selectedCharacterId}
          onSelectCharacter={handleSelectCharacter}
          onBack={goToMenu}
          highContrast={highContrast}
        />
      )}
      {view === 'settings' && (
        <SettingsScreen
          controlSize={controlSize}
          onChangeControlSize={setControlSize}
          highContrast={highContrast}
          onToggleHighContrast={() => setHighContrast((prev) => !prev)}
          onBack={goToMenu}
        />
      )}
      {view === 'about' && <AboutScreen onBack={goToMenu} highContrast={highContrast} />}
      {view === 'game' && (
        <GameScreen
          stage={selectedStage ?? STAGES[0]}
          character={getCharacterById(selectedCharacterId)}
          controlSize={controlSize}
          highContrast={highContrast}
          onExit={goToMenu}
        />
      )}
    </>
  );
}
