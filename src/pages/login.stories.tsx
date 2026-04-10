import type {Meta, StoryObj} from '@storybook/react'

import Login from './login'

/** Fullscreen demo of the sample login form component. */
const meta = {
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
  title: 'Pages/Login',
} satisfies Meta<typeof Login>

export default meta

/** Story object typed against this module’s `meta` export. */
type Story = StoryObj<typeof meta>

/** Interactive email/password validation demo. */
export const Default: Story = {}
