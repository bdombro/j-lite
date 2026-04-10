import type {Meta, StoryObj} from '@storybook/react'

import Index from './index'

/** Marketing landing page with default layout chrome. */
const meta = {
  component: Index,
  parameters: {
    layout: 'fullscreen',
  },
  title: 'Pages/Home',
} satisfies Meta<typeof Index>

export default meta

/** Story object typed against this module’s `meta` export. */
type Story = StoryObj<typeof meta>

/** Standard hero and feature sections. */
export const Default: Story = {}
