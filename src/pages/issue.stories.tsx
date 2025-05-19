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

type IssueStoryArgs = {
  dataset: IssueStoryDataset
  mode: JiraStoryMode
  recents: StoryRecentsMode
}

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

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ErrorState: Story = {
  args: {
    mode: 'issue-error',
    recents: 'none',
  },
}
