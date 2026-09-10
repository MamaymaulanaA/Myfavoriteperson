import { GameProgressProvider } from './GameProgressProvider';
import { AudioManager } from '../components/AudioManager/AudioManager';
import { SceneManager } from './SceneManager';

/**
 * A small romantic interactive world, made for one person.
 *
 * The whole thing is one portrait stage. On a phone it fills the screen; on
 * a desktop it stays 430px wide and centred on a blurred botanical ground,
 * because turning it into a wide web page would turn it into a web page.
 */
export default function App() {
  return (
    <GameProgressProvider>
      <AudioManager>
        <div className="app-ground" aria-hidden="true" />
        <main className="stage no-select">
          <SceneManager />
        </main>
      </AudioManager>
    </GameProgressProvider>
  );
}
