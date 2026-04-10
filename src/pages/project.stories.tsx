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

/** Storybook control payload for dataset, filters, errors, and recents. */
type ProjectStoryArgs = {
  dataset: ProjectStoryDataset
  mode: JiraStoryMode
  projectFilter: ProjectStoryFilter
  recents: StoryRecentsMode
}

/** Dataset, JQL preset, errors, and recents for project-page Storybook states. */
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

/** Story object typed against this module’s `meta` export. */
type Story = StoryObj<typeof meta>

/** Full issue list with default filters. */
export const Default: Story = {}

/** Applies the “To Do” quick-filter JQL fragment. */
export const FilteredToDo: Story = {
  args: {
    projectFilter: 'todo',
  },
}

/** Project or search endpoint returns an error from mocks. */
export const ErrorState: Story = {
  args: {
    mode: 'project-error',
    recents: 'none',
  },
}
