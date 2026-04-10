import type {Meta, StoryObj} from '@storybook/react'

import IssuePage from './issue'
import {
  getRecentStoryData,
  IssueStoryDataset,
  JiraStoryEnvironment,
  JiraStoryMode,
  makeRouteMatch,
  StoryRecentsMode,
} from './storybook-support'

/** Storybook control payload for dataset, error mode, and recents toggles. */
type IssueStoryArgs = {
  dataset: IssueStoryDataset
  mode: JiraStoryMode
  recents: StoryRecentsMode
}

/** Controls dataset, error mode, and recents when previewing the issue screen in Storybook. */
const meta = {
  argTypes: {
    dataset: {
      control: 'select',
      options: ['default', 'minimal'],
    },
    mode: {
      control: 'select',
      options: ['happy', 'issue-error'],
    },
    recents: {
      control: 'select',
      options: ['none', 'projects', 'issues', 'both'],
    },
  },
  args: {
    dataset: 'default',
    mode: 'happy',
    recents: 'both',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args: IssueStoryArgs) => (
    <JiraStoryEnvironment
      issueDataset={args.dataset}
      mode={args.mode}
      path="/j-lite/issues/FC-207"
      {...getRecentStoryData(args.recents)}
    >
      <IssuePage route={makeRouteMatch('/j-lite/issues/FC-207', {issueKey: 'FC-207'})} />
    </JiraStoryEnvironment>
  ),
  title: 'Pages/Issue',
} satisfies Meta<IssueStoryArgs>

export default meta

/** Story object typed against this module’s `meta` export. */
type Story = StoryObj<typeof meta>

/** Default mocked Jira responses and full recents. */
export const Default: Story = {}

/** Forces the issue REST handler to 404. */
export const ErrorState: Story = {
  args: {
    mode: 'issue-error',
    recents: 'none',
  },
}
