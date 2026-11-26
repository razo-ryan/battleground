// Pixel-art icons for the Arcade '89 theme. Each is drawn on a small grid with
// crisp edges and filled with currentColor, so CSS sets the colour.
// All are decorative (aria-hidden); the text next to them carries the meaning.

function Pixel({ size, className, children }) {
  const [w, h] = size
  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function BoltIcon(props) {
  return (
    <Pixel size={[16, 16]} {...props}>
      <path d="M9 1h4v1h-1v2h-1v2h3v1h-1v1h-1v1h-1v1h-1v1H9v1H8v1H7v1H5v-1h1v-2h1v-2H4V9h1V8h1V7h1V6h1V5h1V4h1V2H9z" />
    </Pixel>
  )
}

export function SwordsIcon(props) {
  return (
    <Pixel size={[16, 16]} {...props}>
      <path d="M1 1h2v2H1z M2 2h2v2H2z M3 3h2v2H3z M4 4h2v2H4z M5 5h2v2H5z M6 6h2v2H6z M7 7h2v2H7z M8 8h2v2H8z M9 9h2v2H9z M13 1h2v2h-2z M12 2h2v2h-2z M11 3h2v2h-2z M10 4h2v2h-2z M9 5h2v2H9z M8 6h2v2H8z M6 8h2v2H6z M5 9h2v2H5z M11 11h2v2h-2z M12 12h2v2h-2z M3 11h2v2H3z M2 12h2v2H2z M13 13h2v2h-2z M1 13h2v2H1z" />
    </Pixel>
  )
}

export function DexIcon(props) {
  return (
    <Pixel size={[16, 16]} {...props}>
      <path fillRule="evenodd" d="M3 1h10v14H3z M5 3v7h6V3z M5 12v1h6v-1z" />
    </Pixel>
  )
}

export function VerdictIcon(props) {
  return (
    <Pixel size={[16, 16]} {...props}>
      <path fillRule="evenodd" d="M2 1h9l3 3v11H2z M4 5v1h8V5z M4 8v1h8V8z M4 11v1h5v-1z" />
    </Pixel>
  )
}

export function AlertIcon(props) {
  return (
    <Pixel size={[16, 16]} {...props}>
      <path fillRule="evenodd" d="M7 1h2v2h1v3h1v3h1v3h1v3H3v-3h1V9h1V6h1V3h1z M7 5v5h2V5z M7 11v2h2v-2z" />
    </Pixel>
  )
}

// Large two-tone warning sign for popups. Colours come from .warn__edge and .warn__fill.
export function WarningIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <path className="warn__edge" d="M7 0h2v1h1v3h1v3h1v3h1v3h1v3H1v-3h1v-3h1V7h1V4h1V1h1z" />
      <path className="warn__fill" fillRule="evenodd" d="M7 2h2v2h1v3h1v3h1v3h1v1H3v-1h1v-3h1V7h1V4h1z M7 5v5h2V5z M7 11v2h2v-2z" />
    </svg>
  )
}

export function ChipIcon(props) {
  return (
    <Pixel size={[16, 16]} {...props}>
      <path fillRule="evenodd" d="M4 4h8v8H4z M6 6v4h4V6z M5 1h1v3H5z M10 1h1v3h-1z M5 12h1v3H5z M10 12h1v3h-1z M1 5h3v1H1z M1 10h3v1H1z M12 5h3v1h-3z M12 10h3v1h-3z" />
    </Pixel>
  )
}

export function CheckIcon(props) {
  return (
    <Pixel size={[12, 12]} {...props}>
      <path d="M1 6h2v2H1z M3 8h2v2H3z M5 6h2v2H5z M7 4h2v2H7z M9 2h2v2H9z" />
    </Pixel>
  )
}

export function ExclaimIcon(props) {
  return (
    <Pixel size={[8, 8]} {...props}>
      <path d="M3 0h2v5H3z M3 6h2v2H3z" />
    </Pixel>
  )
}

export function CrownIcon(props) {
  return (
    <Pixel size={[7, 6]} {...props}>
      <path d="M0 0h1v1h1v1h1V0h1v2h1V1h1V0h1v6H0z" />
    </Pixel>
  )
}

export function MinIcon(props) {
  return (
    <Pixel size={[10, 10]} {...props}>
      <path d="M2 7h6v2H2z" />
    </Pixel>
  )
}

export function MaxIcon(props) {
  return (
    <Pixel size={[10, 10]} {...props}>
      <path fillRule="evenodd" d="M1 1h8v8H1z M3 4v3h4V4z" />
    </Pixel>
  )
}

export function CloseIcon(props) {
  return (
    <Pixel size={[10, 10]} {...props}>
      <path d="M1 1h2v2H1z M2 2h2v2H2z M3 3h2v2H3z M4 4h2v2H4z M5 5h2v2H5z M6 6h2v2H6z M7 7h2v2H7z M7 1h2v2H7z M6 2h2v2H6z M5 3h2v2H5z M3 5h2v2H3z M2 6h2v2H2z M1 7h2v2H1z" />
    </Pixel>
  )
}

// Hooded figure drawn on the static background of a card with no art.
export function SilhouetteIcon(props) {
  return (
    <Pixel size={[20, 24]} {...props}>
      <path d="M8 5h4v1h1v4h-1v1H8v-1H7V6h1z M5 12h10v1h1v2h1v9H3v-9h1v-2h1z" />
    </Pixel>
  )
}
