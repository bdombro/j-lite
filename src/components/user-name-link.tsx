import './user-name-link.css'

import type {JiraNamedUser, JiraUser} from '~/util/jira'
import {buildUserHref} from '~/util/jira'

/** Renders a Jira person’s display name as a link to their J-Lite user page when email is known. */
export function UserNameLink({person}: {person?: JiraNamedUser | JiraUser | null}) {
  if (!person?.displayName) {
    return null
  }

  const email = person.emailAddress?.trim()
  if (email) {
    return (
      <a className="user-name-link" href={buildUserHref(email)}>
        {person.displayName}
      </a>
    )
  }

  return <>{person.displayName}</>
}
