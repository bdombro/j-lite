import './issue-table.css'

import type {JiraIssueListItem} from '~/util/jira'
import {buildIssueHref} from '~/util/jira'

import {EmptyState} from './empty-state'

export function IssueTable({caption, issues}: {caption?: string; issues: JiraIssueListItem[]}) {
  if (!issues.length) {
    return <EmptyState>No issues matched this view.</EmptyState>
  }

  return (
    <div className="issue-table">
      <div className="issue-table__scroll">
        <table className="issue-table__table">
          {caption ? <caption className="issue-table__caption">{caption}</caption> : null}
          <thead>
            <tr>
              <th scope="col">Epic</th>
              <th scope="col">Key</th>
              <th scope="col">Summary</th>
              <th scope="col">Assignee</th>
              <th scope="col">Status</th>
              <th scope="col">SPs</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue.key}>
                <td className="issue-table__epic">
                  {issue.parentKey ? (
                    <a href={buildIssueHref(issue.parentKey)}>{issue.parentKey}</a>
                  ) : null}
                </td>
                <td className="issue-table__key">
                  <a href={buildIssueHref(issue.key)}>{issue.key}</a>
                </td>
                <td className="issue-table__summary">{issue.summary}</td>
                <td>{issue.assignee || ''}</td>
                <td>{issue.status || ''}</td>
                <td>{issue.storyPoints ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
