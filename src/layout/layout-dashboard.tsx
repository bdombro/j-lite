import './layout-dashboard.css'

import {router as r} from '~/router'

import {BurgerIconA, NavA, NavLogo, TopHeader} from './top-header'

/** App shell with sidebar, corner decorations, scrollable main, and footer nav. */
export function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="layout-dashboard">
      <TopHeader
        burger={
          <>
            <BurgerIconA href="/#account" icon="account">
              Account
            </BurgerIconA>
            <BurgerIconA href={r.routes.login.path} icon="login">
              Logout
            </BurgerIconA>
          </>
        }
        left={<NavLogo href={r.routes.index.path} />}
      />
      <div className="main-wrapper">
        <Sidebar />
        <main>
          {children}
          <Corners />
        </main>
      </div>
      <Footer />
    </div>
  )
}

/** Standard content column inside the dashboard main region. */
Layout.Section = function LayoutSection({
  children,
  innerProps,
  ...outerProps
}: SectionProps & {innerProps?: DivProps}) {
  return (
    <Section _p={16} {...outerProps}>
      <Div _maxW={800} _mx="auto" {...innerProps}>
        {children}
      </Div>
    </Section>
  )
}

/** Decorative rounded-corner glyphs at the main content edges. */
function Corners() {
  return (
    <>
      <div className="corners-wrapper">
        <div>
          <Icon name="roundedCornerInv" size={10} />
        </div>
        <div>
          <Icon name="roundedCornerInv" size={10} horizontal />
        </div>
        <div>
          <Icon name="roundedCornerInv" size={10} vertical horizontal />
        </div>
        <div>
          <Icon name="roundedCornerInv" size={10} vertical />
        </div>
      </div>
    </>
  )
}

/** Bottom icon strip mirroring key sidebar destinations. */
function Footer() {
  return (
    <footer className="bottom-footer">
      <nav>
        <FooterIconA href="/#account" icon="account" title="Account" />
        <FooterIconA href={r.routes.login.path} icon="login" title="Log in" />
      </nav>
    </footer>
  )
}

/** Icon-only footer link using shared nav active styling. */
function FooterIconA({icon, ...p}: {icon: IconKeys} & AProps) {
  return (
    <NavA {...p}>
      <Icon name={icon} />
    </NavA>
  )
}

/** Collapsible side navigation with account and logout entries. */
function Sidebar() {
  const [isMini, setIsMini] = useState(false)
  return (
    <aside className={isMini ? 'mini' : undefined}>
      <nav>
        <SidebarIconA href="/#account" icon="account">
          Account
        </SidebarIconA>
        <SidebarIconA href={r.routes.login.path} icon="login">
          Logout
        </SidebarIconA>
      </nav>
      <button
        className="ghost minimize"
        onClick={() => setIsMini(p => !p)}
        title={isMini ? 'expand sidebar' : 'collapse sidebar'}
        type="button"
      >
        {isMini ? (
          <Icon name="arrowExpand" />
        ) : (
          <>
            <Icon name="arrowCollapse" size={20} /> minimize
          </>
        )}
      </button>
    </aside>
  )
}

/** Sidebar row link with leading icon and text label. */
function SidebarIconA({icon, ...p}: {icon: IconKeys} & AProps) {
  return (
    <NavA {...p}>
      <Icon name={icon} />
      <div>{p.children}</div>
    </NavA>
  )
}
