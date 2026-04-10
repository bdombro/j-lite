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

/** Storybook control payload mirroring dashboard: mode, recents, and `from` source. */
type SettingsStoryArgs = {
  mode: JiraStoryMode
  recents: StoryRecentsMode
  source: StorySourceMode
}

/** Mocked bootstrap, `from` query, and recents around the settings screen. */
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

/** Story object typed against this module’s `meta` export. */
type Story = StoryObj<typeof meta>

/** Typical session details and cache key listing. */
export const Default: Story = {}
