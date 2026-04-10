/** Inline “J-LITE” wordmark SVG with theme-driven stroke and fill. */
export const Logo = (svgProps: SvgProps) => (
  <Svg
    height="20px"
    viewBox="0 0 48 20"
    xmlns="http://www.w3.org/2000/svg"
    {...svgProps}
    _zx={{
      ...svgProps._zx,
      '--color': 'var(--color-primary)',
    }}
    _hover={{
      ...svgProps._hover,
      '--color': 'var(--color-primary-darker)',
    }}
  >
    <g fill="none">
      <path d="M3.768 16.141H.826V.447h43.406v2.941" stroke="var(--color)" strokeWidth={0.882} />
      <path d="M3.768 3.388h43.406v15.694H3.768z" fill="var(--color)" />
      <text
        x="10"
        y="15"
        fill="#fefefd"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="bold"
        fontSize="12"
        fontStyle="italic"
        transform="scale(.9,1)"
      >
        J-LITE
      </text>
    </g>
  </Svg>
)
