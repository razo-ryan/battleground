import Header from './components/Header.jsx'
import Arena from './components/Arena.jsx'
import BattleDex from './components/BattleDex.jsx'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Arena />
        <BattleDex />
      </main>
      <footer className="app-footer">Battleground · verdicts and art are AI generated</footer>
    </div>
  )
}
