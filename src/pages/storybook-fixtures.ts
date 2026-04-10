import type {RecentView} from '~/util/jira'

export const storyCurrentUser = {
  accountId: 'story-user',
  displayName: 'Brian Dombrowski',
  emailAddress: 'brian@example.com',
}

export const storyFieldDefinitions = [
  {id: 'customfield_18557', name: 'Story point estimate'},
  {id: 'summary', name: 'Summary'},
  {id: 'status', name: 'Status'},
]

export const storyProject = {
  id: '27264',
  key: 'FC',
  name: 'Facade1',
  projectTypeKey: 'software',
}

function makeIssue(
  key: string,
  summary: string,
  status: string,
  assignee: string,
  parentKey?: string,
  storyPoints?: number
) {
  return {
    key,
    fields: {
      assignee: assignee ? {displayName: assignee} : null,
      issuetype: {
        name: 'Story',
      },
      parent: parentKey
        ? {
            key: parentKey,
          }
        : undefined,
      project: {
        key: 'FC',
      },
      status: {
        name: status,
      },
      summary,
      customfield_18557: storyPoints ?? null,
    },
  }
}

export const storyProjectIssues = [
  makeIssue(
    'FC-209',
    'e-com toolkit implementation',
    'To Do',
    storyCurrentUser.displayName,
    'FC-145',
    5
  ),
  makeIssue('FC-208', 'cross issue in UA dev environment', 'Done', 'Toney Sebastian', 'FC-145', 3),
  makeIssue('FC-206', 'Test case creation and execution', 'In Progress', 'QA User', 'FC-150', 8),
  makeIssue(
    'FC-205',
    'Homepage merchandising updates',
    'To Do',
    storyCurrentUser.displayName,
    'FC-150',
    2
  ),
]

export const storyIssue = {
  key: 'FC-207',
  fields: {
    assignee: {displayName: storyCurrentUser.displayName},
    comment: {
      comments: [
        {
          author: {displayName: 'Brian Dombrowski'},
          body: {
            content: [
              {
                content: [{text: 'Is for NA - USA and Canada only', type: 'text'}],
                type: 'paragraph',
              },
            ],
            type: 'doc',
            version: 1,
          },
          created: '2025-05-13T05:48:30.340-0500',
          id: '1417440',
        },
        {
          author: {displayName: 'Toney Sebastian'},
          body: {
            content: [
              {
                content: [
                  {marks: [{type: 'strong'}], text: 'QA note:', type: 'text'},
                  {text: ' ready for validation.', type: 'text'},
                ],
                type: 'paragraph',
              },
            ],
            type: 'doc',
            version: 1,
          },
          created: '2025-05-13T06:12:11.000-0500',
          id: '1417441',
        },
      ],
    },
    customfield_18557: 5,
    description: {
      content: [
        {
          content: [
            {
              text: 'Render the Content Carousel module on the homepage using the modeled CMS content.',
              type: 'text',
            },
          ],
          type: 'paragraph',
        },
        {
          content: [
            {
              content: [
                {
                  content: [{text: 'Header, subheader, and snipe text', type: 'text'}],
                  type: 'paragraph',
                },
              ],
              type: 'listItem',
            },
            {
              content: [
                {
                  content: [{text: 'Marketing cards with media and CTA', type: 'text'}],
                  type: 'paragraph',
                },
              ],
              type: 'listItem',
            },
            {
              content: [
                {
                  content: [{text: 'Linked implementation issue ', type: 'text'}],
                  type: 'paragraph',
                },
                {
                  content: [
                    {
                      attrs: {url: 'https://demo.atlassian.net/browse/FC-145'},
                      type: 'inlineCard',
                    },
                  ],
                  type: 'paragraph',
                },
              ],
              type: 'listItem',
            },
          ],
          type: 'bulletList',
        },
      ],
      type: 'doc',
      version: 1,
    },
    issuelinks: [
      {
        outwardIssue: makeIssue(
          'FC-145',
          'Homepage content carousel implementation',
          'Code Review',
          'Toney Sebastian',
          undefined,
          8
        ),
        type: {
          name: 'Cloners',
          outward: 'clones',
        },
      },
      {
        outwardIssue: makeIssue(
          'FC-113',
          'CMS Migration - CTA partials',
          'Ready For QA',
          'QA User',
          undefined,
          3
        ),
        type: {
          name: 'Blocker',
          outward: 'is blocking',
        },
      },
    ],
    issuetype: {name: 'Story'},
    labels: ['homepage', 'content', 'cms'],
    parent: {key: 'FC-145'},
    project: {
      key: 'FC',
      name: 'Facade1',
    },
    reporter: {displayName: 'Toney Sebastian'},
    status: {name: 'To Do'},
    summary: 'Render content carousel on homepage',
  },
}

export const storyIssueChildren = {
  issues: [
    makeIssue('FC-189', 'Content carousel nested child story', 'To Do', 'QA User', 'FC-207', 2),
    makeIssue(
      'FC-190',
      'Carousel acceptance test case',
      'Ready For QA',
      'Brian Dombrowski',
      'FC-207',
      1
    ),
  ],
}

export const storyMinimalIssue = {
  ...storyIssue,
  key: 'FC-321',
  fields: {
    ...storyIssue.fields,
    assignee: null,
    comment: {
      comments: [],
    },
    customfield_18557: null,
    description: null,
    issuelinks: [],
    labels: [],
    parent: undefined,
    reporter: undefined,
    summary: 'Minimal issue state',
  },
}

export const storyRecentProjects: RecentView[] = [
  {
    href: '/j-lite/projects/FC',
    key: 'FC',
    subtitle: '4 issues',
    title: 'Facade1',
    type: 'project',
    viewedAt: Date.now() - 1000 * 60 * 10,
  },
]

export const storyRecentIssues: RecentView[] = [
  {
    href: '/j-lite/issues/FC-207',
    key: 'FC-207',
    subtitle: 'To Do',
    title: 'Render content carousel on homepage',
    type: 'issue',
    viewedAt: Date.now() - 1000 * 60 * 5,
  },
  {
    href: '/j-lite/issues/FC-189',
    key: 'FC-189',
    subtitle: 'Ready for QA',
    title: 'Content carousel nested child story',
    type: 'issue',
    viewedAt: Date.now() - 1000 * 60 * 30,
  },
]
