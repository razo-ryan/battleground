import { BoltIcon } from './icons.jsx'

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <h1 className="logo">
          <span className="logo__mark" aria-hidden="true"><BoltIcon /></span>
          Battleground
        </h1>
        <p className="tagline">Two fighters enter. One verdict leaves.</p>
      </div>
    </header>
  )
}
