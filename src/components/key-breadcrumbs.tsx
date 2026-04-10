import {buildIssueHref, buildProjectHref} from '~/util/jira'

/** Project / optional parent / current issue key trail with in-app links. */
export function KeyBreadcrumbs({
  issueKey,
  parentKey,
  projectKey,
}: {
  issueKey: string
  parentKey?: string
  projectKey: string
}) {
  const divider = <div style={{display: 'inline', padding: '0 3px 0 5px'}}>/</div>
  return (
    <div className="breadcrumbs">
      <a className="pa" href={buildProjectHref(projectKey)}>
        {projectKey}
      </a>
      {parentKey ? (
        <>
          {divider}
          <a className="pa" href={buildIssueHref(parentKey)}>
            {parentKey}
          </a>
        </>
      ) : null}
      {divider}
      <span>{issueKey}</span>
    </div>
  )
}
