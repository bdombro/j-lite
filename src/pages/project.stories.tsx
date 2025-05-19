import type {Meta, StoryObj} from '@storybook/react'

import ProjectPage from './project'
import {
  buildProjectPath,
  getProjectRouteMatch,
  getRecentStoryData,
  JiraStoryEnvironment,
  JiraStoryMode,
  ProjectStoryDataset,
  ProjectStoryFilter,
  StoryRecentsMode,
} from './storybook-support'

type ProjectStoryArgs = {
  dataset: ProjectStoryDataset
  mode: JiraStoryMode
  projectFilter: ProjectStoryFilter
  recents: StoryRecentsMode
}

const meta = {
  argTypes: {
    dataset: {
      control: 'select',
      options: ['default', 'empty'],
    },
    mode: {
      control: 'select',
      options: ['happy', 'project-error'],
    },
    projectFilter: {
      control: 'select',
      options: ['all', 'open', 'todo', 'currentUser'],
    },
    recents: {
      control: 'select',
      options: ['none', 'projects', 'issues', 'both'],
    },
  },
  args: {
    dataset: 'default',
    mode: 'happy',
    projectFilter: 'all',
    recents: 'both',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args: ProjectStoryArgs) => (
    <JiraStoryEnvironment
      mode={args.mode}
      path={buildProjectPath('FC', args.projectFilter)}
      projectDataset={args.dataset}
      {...getRecentStoryData(args.recents)}
    >
      <ProjectPage route={getProjectRouteMatch('FC', args.projectFilter)} />
    </JiraStoryEnvironment>
  ),
  title: 'Pages/Project',
} satisfies Meta<ProjectStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FilteredToDo: Story = {
  args: {
    projectFilter: 'todo',
  },
}

export const ErrorState: Story = {
  args: {
    mode: 'project-error',
    recents: 'none',
  },
}
