import {describe, expect, it} from 'vitest'

import {pickStoryPointsField} from './api'

describe('jira api helpers', () => {
  it('prefers the explicit story point estimate field', () => {
    expect(
      pickStoryPointsField([
        {id: 'customfield_10016', name: 'Story Points'},
        {id: 'customfield_10042', name: 'Story point estimate'},
      ])
    ).toBe('customfield_10042')
  })

  it('falls back to the legacy default field when no match exists', () => {
    expect(pickStoryPointsField([{id: 'customfield_10111', name: 'Business Value'}])).toBe(
      'customfield_18557'
    )
  })
})
