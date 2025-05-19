import type {Meta, StoryObj} from '@storybook/react'

import Login from './login'

const meta = {
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
  title: 'Pages/Login',
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
