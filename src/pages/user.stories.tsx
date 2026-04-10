import type {Meta, StoryObj} from '@storybook/react'

import UserPage from './user'
import {storyCurrentUser} from './storybook-fixtures'
import {
  buildUserPath,
  getRecentStoryData,
  getUserRouteMatch,
  JiraStoryEnvironment,
  JiraStoryMode,
  StoryRecentsMode,
} from './storybook-support'

const demoEmail = storyCurrentUser.emailAddress || 'brian@example.com'

/** Storybook control payload for user lookup errors and optional recents seeding. */
type UserStoryArgs = {
  mode: JiraStoryMode
  recents: StoryRecentsMode
}

/** Mocked `/user/search` and assignee JQL for the user profile page. */
const meta = {
  argTypes: {
    mode: {
      control: 'select',
      options: ['happy', 'bootstrap-error', 'user-error'],
    },
    recents: {
      control: 'select',
      options: ['none', 'projects', 'issues', 'both'],
    },
  },
  args: {
    mode: 'happy',
    recents: 'none',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args: UserStoryArgs) => (
    <JiraStoryEnvironment
      mode={args.mode}
      path={buildUserPath(demoEmail)}
      {...getRecentStoryData(args.recents)}
    >
      <UserPage route={getUserRouteMatch(demoEmail)} />
    </JiraStoryEnvironment>
  ),
  title: 'Pages/User',
} satisfies Meta<UserStoryArgs>

export default meta

/** Story object typed against this module’s `meta` export. */
type Story = StoryObj<typeof meta>

/** Resolved user with assigned issues from mocked search. */
export const Default: Story = {}

/** Empty `/user/search` results so the page shows a not-found style error. */
export const UserNotFound: Story = {
  args: {
    mode: 'user-error',
    recents: 'none',
  },
}

/** Bootstrap (`/myself`) fails before user data can load. */
export const BootstrapError: Story = {
  args: {
    mode: 'bootstrap-error',
    recents: 'none',
  },
}
