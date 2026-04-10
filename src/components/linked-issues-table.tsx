import './linked-issues-table.css'

import type {JiraLinkedIssue} from '~/util/jira'
import {buildIssueHref} from '~/util/jira'

import {EmptyState} from './empty-state'

/** Tabular view of inward/outward linked issues with type and status. */
export function LinkedIssuesTable({issues}: {issues: JiraLinkedIssue[]}) {
  if (!issues.length) {
    return <EmptyState>No linked issues found for this issue.</EmptyState>
  }

  return (
    <div className="linked-issues-table">
      <div className="linked-issues-table__scroll">
        <table className="linked-issues-table__table">
          <thead>
            <tr>
              <th scope="col">Key</th>
              <th scope="col">Summary</th>
              <th scope="col">Assignee</th>
              <th scope="col">Status</th>
              <th scope="col">Link Type</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={`${issue.direction}-${issue.key}-${issue.linkType}`}>
                <td className="linked-issues-table__key">
                  <a href={buildIssueHref(issue.key)}>{issue.key}</a>
                </td>
                <td className="linked-issues-table__summary">{issue.summary}</td>
                <td>{issue.assignee || ''}</td>
                <td>{issue.status || ''}</td>
                <td>{issue.linkType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
