import {renderToStaticMarkup} from 'react-dom/server'
import {describe, expect, it} from 'vitest'

import {ADFContent} from './adf-content'

describe('ADFContent', () => {
  it('renders basic formatting and Jira inline cards', () => {
    const html = renderToStaticMarkup(
      <ADFContent
        doc={{
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {type: 'text', text: 'Hello '},
                {marks: [{type: 'strong'}], text: 'World', type: 'text'},
                {type: 'text', text: ' '},
                {
                  attrs: {url: 'https://demo.atlassian.net/browse/FC-123'},
                  type: 'inlineCard',
                },
              ],
            },
          ],
        }}
      />
    )

    expect(html).toContain('<strong>World</strong>')
    expect(html).toContain('href="/j-lite/issues/FC-123"')
    expect(html).toContain('FC-123')
  })
})
