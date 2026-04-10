import type {Meta, StoryObj} from '@storybook/react'

import NotFound from './not-found'
import {JiraStoryEnvironment} from './storybook-support'

/** Chooses marketing vs in-app 404 preview. */
type NotFoundStoryArgs = {
  context: 'general' | 'j-lite'
}

/** Switches between marketing vs in-app 404 chrome via a path wrapper. */
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

/** Story object typed against this module’s `meta` export. */
type Story = StoryObj<typeof meta>

/** Unknown path outside `/j-lite` (marketing layout). */
export const General: Story = {}

/** Unknown path inside `/j-lite` with Jira header mock. */
export const JLite: Story = {
  args: {
    context: 'j-lite',
  },
}
