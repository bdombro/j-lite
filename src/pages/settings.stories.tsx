import type {Meta, StoryObj} from '@storybook/react'

import SettingsPage from './settings'
import {
  buildSettingsPath,
  getRecentStoryData,
  JiraStoryEnvironment,
  JiraStoryMode,
  makeRouteMatch,
  makeStoryUrl,
  StoryRecentsMode,
  StorySourceMode,
} from './storybook-support'

type SettingsStoryArgs = {
  mode: JiraStoryMode
  recents: StoryRecentsMode
  source: StorySourceMode
}

const meta = {
  argTypes: {
    mode: {
      control: 'select',
      options: ['happy', 'bootstrap-error'],
    },
    recents: {
      control: 'select',
      options: ['none', 'projects', 'issues', 'both'],
    },
    source: {
      control: 'select',
      options: ['none', 'issue', 'project'],
    },
  },
  args: {
    mode: 'happy',
    recents: 'both',
    source: 'issue',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args: SettingsStoryArgs) => (
    <JiraStoryEnvironment
      mode={args.mode}
      path={buildSettingsPath(args.source)}
      {...getRecentStoryData(args.recents)}
    >
      <SettingsPage
        route={makeRouteMatch('/j-lite/settings')}
        url={makeStoryUrl(buildSettingsPath(args.source))}
      />
    </JiraStoryEnvironment>
  ),
  title: 'Pages/Settings',
} satisfies Meta<SettingsStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
