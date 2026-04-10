import './layout-marketing.css'

import {useNetworkState} from '@slimr/react'

import {router as r} from '~/router'

import {BurgerIconA, NavA, TopHeader} from './top-header'

/** Public-site shell: top header with nav, optional offline pill, and main content. */
export function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="layout-marketing">
      <TopHeader
        burger={
          <>
            <BurgerIconA href={r.routes.dashboard.path} icon="home">
              Dashboard
            </BurgerIconA>
            <BurgerIconA href={r.routes.about.path} icon="info">
              About
            </BurgerIconA>
          </>
        }
        right={
          <>
            <OfflinePill />
            <NavA href={r.routes.dashboard.path}>Dashboard</NavA>
            <NavA href={r.routes.about.path}>About</NavA>
          </>
        }
      />
      <div className="main-wrapper">
        <main>{children}</main>
      </div>
    </div>
  )
}

/** Constrained content width for marketing and issue-style pages. */
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

/** Compact badge shown in the header when the browser reports offline. */
function OfflinePill() {
  const {online} = useNetworkState()
  if (online) return null
  const fontSize = '.7em'
  return (
    <div
      // TODO: maybe move these styles to a CSS file and maybe preact-template
      className="network-state"
      style={{
        alignItems: 'center',
        background: 'var(--color-primary)',
        borderRadius: '.5em',
        display: 'inline-flex',
        fontSize,
        gap: '.5em',
        marginRight: '1em',
        padding: '.5em',
      }}
    >
      <div
        className="circle"
        style={{
          backgroundColor: 'var(--color-alert)',
          width: fontSize,
          height: fontSize,
          borderRadius: '50%',
        }}
      ></div>
      Offline
    </div>
  )
}
