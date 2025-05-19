import type {Meta, StoryObj} from '@storybook/react'

import Dashboard from './dashboard'
import {
  buildDashboardPath,
  getRecentStoryData,
  JiraStoryEnvironment,
  JiraStoryMode,
  makeRouteMatch,
  makeStoryUrl,
  StoryRecentsMode,
  StorySourceMode,
} from './storybook-support'

type DashboardStoryArgs = {
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
  render: (args: DashboardStoryArgs) => (
    <JiraStoryEnvironment
      path={buildDashboardPath(args.source)}
      {...getRecentStoryData(args.recents)}
      mode={args.mode}
    >
      <Dashboard
        route={makeRouteMatch('/j-lite')}
        url={makeStoryUrl(buildDashboardPath(args.source))}
      />
    </JiraStoryEnvironment>
  ),
  title: 'Pages/Dashboard',
} satisfies Meta<DashboardStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const BootstrapError: Story = {
  args: {
    mode: 'bootstrap-error',
    recents: 'none',
    source: 'none',
  },
}
