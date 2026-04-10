import React from 'react'

import type {JiraAdfDoc, JiraAdfNode} from '~/util/jira'
import {buildIssueHref} from '~/util/jira'

/** Renders plain ADF text nodes, applying strong/em/code marks when present. */
function renderTextNode(node: JiraAdfNode, key: string) {
  if (!node.text) return null

  let content: React.ReactNode = node.text
  for (const mark of node.marks || []) {
    if (mark.type === 'strong') content = <strong key={`${key}-strong`}>{content}</strong>
    if (mark.type === 'em') content = <em key={`${key}-em`}>{content}</em>
    if (mark.type === 'code') content = <code key={`${key}-code`}>{content}</code>
  }

  return <>{content}</>
}

/** Renders inline ADF nodes including smart links to in-app issue URLs. */
function renderInline(node: JiraAdfNode, key: string): React.ReactNode {
  if (!node.type) return null

  if (node.type === 'text') return renderTextNode(node, key)

  if (node.type === 'inlineCard') {
    const rawUrl = node.attrs?.url
    if (!rawUrl || typeof rawUrl !== 'string') return null

    const issueKey = rawUrl.split('/').filter(Boolean).at(-1)
    if (!issueKey) return <a href={rawUrl}>{rawUrl}</a>

    return <a href={buildIssueHref(issueKey)}>{issueKey}</a>
  }

  if (node.content?.length) {
    return node.content.map((child, index) => (
      <React.Fragment key={`${key}-${index}`}>
        {renderInline(child, `${key}-${index}`)}
      </React.Fragment>
    ))
  }

  return null
}

/** Maps block-level ADF (paragraphs, headings, lists, rules) to DOM structure. */
function renderBlock(node: JiraAdfNode, key: string): React.ReactNode {
  if (!node.type) return null

  if (node.type === 'paragraph') {
    return (
      <p key={key}>
        {node.content?.map((child, index) => (
          <React.Fragment key={`${key}-${index}`}>
            {renderInline(child, `${key}-${index}`)}
          </React.Fragment>
        ))}
      </p>
    )
  }

  if (node.type === 'heading') {
    const level = Math.max(1, Math.min(6, Number(node.attrs?.level || 1)))
    const children = node.content?.map((child, index) => (
      <React.Fragment key={`${key}-${index}`}>
        {renderInline(child, `${key}-${index}`)}
      </React.Fragment>
    ))

    if (level === 1) return <h1 key={key}>{children}</h1>
    if (level === 2) return <h2 key={key}>{children}</h2>
    if (level === 3) return <h3 key={key}>{children}</h3>
    if (level === 4) return <h4 key={key}>{children}</h4>
    if (level === 5) return <h5 key={key}>{children}</h5>
    return <h6 key={key}>{children}</h6>
  }

  if (node.type === 'bulletList' || node.type === 'orderedList') {
    const Tag = node.type === 'bulletList' ? 'ul' : 'ol'
    return (
      <Tag key={key}>
        {node.content?.map((item, index) => (
          <li key={`${key}-${index}`}>
            {item.content?.map((child, childIndex) => (
              <React.Fragment key={`${key}-${index}-${childIndex}`}>
                {renderBlock(child, `${key}-${index}-${childIndex}`)}
              </React.Fragment>
            ))}
          </li>
        ))}
      </Tag>
    )
  }

  if (node.type === 'rule') return <hr key={key} />

  return node.content?.map((child, index) => (
    <React.Fragment key={`${key}-${index}`}>{renderBlock(child, `${key}-${index}`)}</React.Fragment>
  ))
}

/** Turns Atlassian Document Format into readable HTML for descriptions and comments. */
export function ADFContent({doc}: {doc?: JiraAdfDoc | null}) {
  if (!doc?.content?.length) {
    return <p className="muted">No description available.</p>
  }

  return (
    <div className="adf-content">
      {doc.content.map((block, index) => (
        <React.Fragment key={`adf-${index}`}>{renderBlock(block, `adf-${index}`)}</React.Fragment>
      ))}
    </div>
  )
}
