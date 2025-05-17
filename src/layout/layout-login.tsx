/**
 * A layout with a header and a main section
 */
export function Layout({children}: {children: React.ReactNode}) {
  return (
    <Main _ai="center" _d="flex" _jc="center" _my={40} _pt="var(--statusbar-height)">
      {children}
    </Main>
  )
}

Layout.Section = function LayoutSection({
  children,
  innerProps,
  ...outerProps
}: SectionProps & {innerProps?: DivProps}) {
  return (
    <Section _p={16} {...outerProps}>
      <Div _w={273} _mx="auto" {...innerProps}>
        {children}
      </Div>
    </Section>
  )
}
