import Header from './components/Header.jsx'
import Arena from './components/Arena.jsx'
import BattleDex from './components/BattleDex.jsx'
import MockPanel from './components/MockPanel.jsx'

export default function App() {
  return (
    <div className="app">
      {/* Neon grid floor behind the windows (decoration only). */}
      <div className="app-floor" aria-hidden="true" />
      <Header />
      <main className="app-main">
        <Arena />
        <BattleDex />
      </main>
      <footer className="app-footer">
        <span className="app-footer__text">Battleground · verdicts and art are AI generated</span>
      </footer>
      {/* Dev-only failure switches for the mock API; dropped from production builds. */}
      {import.meta.env.DEV && <MockPanel />}
    </div>
  )
}
