import {Logo} from './logo'

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

/** An anchor with an icon on the left */
export function BurgerIconA({icon, ...p}: {icon: IconKeys} & AProps) {
  return (
    <NavA {...p}>
      <Icon name={icon} />
      <div>{p.children}</div>
    </NavA>
  )
}

/** An anchor element with active classname injected  */
export function NavA(p: AProps) {
  return (
    <A {...p} className={classJoin(p.className, location.href.includes(p.href!) ? 'active' : '')} />
  )
}

export function NavLogo({href = '/'}) {
  return (
    <a className="logo" href={href}>
      <Logo height="100%" />
    </a>
  )
}
