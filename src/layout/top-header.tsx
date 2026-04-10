import {buildIssueHref} from '~/util/jira/url'

import {Logo} from './logo'

/** Top bar with optional burger menu, issue jump field, and right-side actions. */
export function TopHeader({
  burger,
  left = <NavLogo />,
  right,
}: {
  burger?: React.ReactNode
  left?: React.ReactNode
  right?: React.ReactNode
}) {
  const [burgerOpen, setBurgerOpen] = useState(false)
  return (
    <header className="top-header">
      <div className="navbar">
        {left}
        <nav className="right">
          <IssueJumpForm />
          {right}
          {burger && (
            <a
              className={classJoin('burger-toggle', burgerOpen ? 'active' : '')}
              href="#open-burger"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setBurgerOpen(last => !last)
              }}
            >
              <Icon name="menu" />
            </a>
          )}
        </nav>
        {burgerOpen && <div className="burger-menu">{burger}</div>}
      </div>
    </header>
  )
}

/** Navigation link that prefixes children with a named icon. */
export function BurgerIconA({icon, ...p}: {icon: IconKeys} & AProps) {
  return (
    <NavA {...p}>
      <Icon name={icon} />
      <div>{p.children}</div>
    </NavA>
  )
}

/** Client-side link that gets an active class when its href matches the current URL. */
export function NavA(p: AProps) {
  return (
    <A {...p} className={classJoin(p.className, location.href.includes(p.href!) ? 'active' : '')} />
  )
}

/** Small form that navigates to `/j-lite/issues/:key` when a valid key is entered. */
function IssueJumpForm() {
  const [value, setValue] = useState('')
  return (
    <form
      className="issue-jump"
      onSubmit={e => {
        e.preventDefault()
        const key = value.trim().toUpperCase()
        if (/^[A-Z][A-Z0-9_]+-\d+$/.test(key)) {
          setValue('')
          location.href = buildIssueHref(key)
        }
      }}
    >
      <input
        aria-label="Go to issue"
        className="issue-jump__input"
        onChange={e => setValue((e.target as HTMLInputElement).value)}
        placeholder="Jump to issue…"
        type="text"
        value={value}
      />
      <button aria-label="Go" className="issue-jump__button" type="submit">
        <Icon name="arrowR" size={18} />
      </button>
    </form>
  )
}

/** Brand mark linking back to the app root (or a custom href). */
export function NavLogo({href = '/j-lite'}) {
  return (
    <a className="logo" href={href}>
      <Logo height="100%" />
    </a>
  )
}
