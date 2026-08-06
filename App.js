import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import MenuScreen from './src/screens/MenuScreen';
import StagesScreen from './src/screens/StagesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import GameScreen from './src/screens/GameScreen';
import { STAGES } from './src/data/stages';

export default function App() {
  const [view, setView] = useState('menu');
  const [selectedStage, setSelectedStage] = useState(null);
  const [controlSize, setControlSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  const goToMenu = () => setView('menu');

  const handleSelectStage = (stage) => {
    if (stage.locked) return;
    setSelectedStage(stage);
    setView('game');
  };

  return (
    <>
      <StatusBar hidden />
      {view === 'menu' && <MenuScreen onNavigate={setView} highContrast={highContrast} />}
      {view === 'stages' && (
        <StagesScreen onSelectStage={handleSelectStage} onBack={goToMenu} highContrast={highContrast} />
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
          controlSize={controlSize}
          highContrast={highContrast}
          onExit={goToMenu}
        />
      )}
    </>
  );
}
