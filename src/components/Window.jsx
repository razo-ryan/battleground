import { CloseIcon, MaxIcon, MinIcon } from './icons.jsx'

// Arcade '89 window chrome: a striped title bar over a dark panel.
// The minimise / maximise / close buttons are decoration only (nothing in the
// app opens or closes windows), so they are hidden from assistive tech.

const CONTROL_ICONS = { min: MinIcon, max: MaxIcon, close: CloseIcon }

// variant: 'active' (gold stripes) | 'idle' (purple) | 'alert' (red stripes)
// heading: element used for the title, e.g. 'h2', 'h3' or 'span'
export function TitleBar({
  title,
  titleId,
  icon,
  variant = 'active',
  small = false,
  heading: Heading = 'h2',
  controls = ['min', 'max', 'close'],
  children,
}) {
  return (
    <div className={`bar bar--${variant}${small ? ' bar--sm' : ''}`}>
      {icon && <span className="bar__icon">{icon}</span>}
      <Heading id={titleId} className="bar__title">{title}</Heading>
      {children}
      {controls.length > 0 && (
        <div className="bar__ctls" aria-hidden="true">
          {controls.map((name) => {
            const Icon = CONTROL_ICONS[name]
            return <span key={name} className="bar__ctl"><Icon /></span>
          })}
        </div>
      )}
    </div>
  )
}

// A titled window. `extra` renders inside the title bar, after the title (e.g. a count tag).
export default function Window({
  title,
  titleId,
  icon,
  idle = false,
  heading,
  controls,
  extra,
  className = '',
  bodyClassName = '',
  children,
}) {
  const classes = ['win', idle && 'win--idle', className].filter(Boolean).join(' ')
  return (
    <section className={classes} aria-labelledby={titleId}>
      <TitleBar
        title={title}
        titleId={titleId}
        icon={icon}
        variant={idle ? 'idle' : 'active'}
        heading={heading}
        controls={controls}
      >
        {extra}
      </TitleBar>
      <div className={['win__body', bodyClassName].filter(Boolean).join(' ')}>{children}</div>
    </section>
  )
}
