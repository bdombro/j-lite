/** Short lorem snippet duplicated to build long-scroll filler paragraphs. */
const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, or'

/** Long-scroll placeholder paragraphs for layout stress-testing. */
export function Filler() {
  return (
    <>
      {Array(window.innerWidth < 600 ? 10 : 100)
        .fill(0)
        .map((_, i) => (
          <p key={i}>{text}</p>
        ))}
    </>
  )
}
