import type {Meta, StoryObj} from '@storybook/react'

import NotFound from './not-found'
import {JiraStoryEnvironment} from './storybook-support'

type NotFoundStoryArgs = {
  context: 'general' | 'j-lite'
}

const meta = {
  argTypes: {
    context: {
      control: 'select',
      options: ['general', 'j-lite'],
    },
  },
  args: {
    context: 'general',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args: NotFoundStoryArgs) => {
    if (args.context === 'j-lite') {
      return (
        <JiraStoryEnvironment path="/j-lite/unknown-path">
          <NotFound />
        </JiraStoryEnvironment>
      )
    }
    return <NotFound />
  },
  title: 'Pages/Not Found',
} satisfies Meta<NotFoundStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const General: Story = {}

export const JLite: Story = {
  args: {
    context: 'j-lite',
  },
}
