import type {JiraComment} from '~/util/jira'

import {ADFContent} from './adf-content'
import {EmptyState} from './empty-state'

export function CommentsList({comments}: {comments: JiraComment[]}) {
  if (!comments.length) {
    return <EmptyState>No comments found for this issue.</EmptyState>
  }

  return (
    <div className="comments-list">
      {comments.map(comment => (
        <article
          className="comment-card"
          key={comment.id || `${comment.author}-${comment.created}`}
        >
          <div className="comment-meta">
            <strong>{comment.author || 'Unknown author'}</strong>
            <span>{comment.created ? new Date(comment.created).toLocaleString() : ''}</span>
          </div>
          <ADFContent doc={comment.body} />
        </article>
      ))}
    </div>
  )
}
