import './cms-table.pcss'

import {useMedia, UseSet2, useSet2} from '@slimr/react'
import {useLocationChangedCb} from '@slimr/router'
import {queryStrings} from '@slimr/util'
import React, {Fragment as F, useCallback, useState} from 'react'

import {toast} from '~/foundation'

interface CmsTableProps {
  bulkOptions?: {label: string; cb: (selection: sany[]) => sany}[]
  cols: {label: string; sortValue?: string; sortDefault?: 'asc' | 'desc'}[]
  pages: number
  rows: CmsRow[]
  total: number
}
type CmsRow = {
  obj: sany // the obj that will be passed to bulk actions
  cols: React.ReactNode[] // the cols that will be displayed
}

export function getCmsTableQsProps<SortBy extends string>() {
  // TODO: Move the qs props out of cms-table
  const qs = queryStrings.parse()
  return {
    ...qs,
    search: qs.search || undefined,
    page: qs.page ? parseInt(qs.page) : 1,
    pageSize: qs.pageSize ? parseInt(qs.pageSize) : 10,
    sortBy: qs.sortBy as '' | SortBy,
    sortDirection: qs.sortDirection || ('asc' as 'asc' | 'desc'),
  }
}

export function CmsTable(props: CmsTableProps) {
  const {bulkOptions, cols, pages, rows, total} = props

  const qs = getCmsTableQsProps()

  const checked = useSet2<CmsRow>()
  useLocationChangedCb(() => checked.clear())

  return (
    <div className="cms-table-div">
      <SearchRow current={qs.search} />
      <BulkOptionsAndPagination
        bulkOptions={bulkOptions}
        checked={checked}
        page={qs.page}
        pages={pages}
        total={total}
      />

      {total ? (
        <table>
          <thead>
            <THeadOrFoot
              cols={cols}
              rows={rows}
              checked={checked}
              sortBy={qs.sortBy}
              sortDirection={qs.sortDirection}
            />
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <BodyRow key={i} cols={cols} row={row} rowNumber={i} checked={checked} />
            ))}
          </tbody>
          <tfoot>
            <THeadOrFoot
              cols={cols}
              isFooter
              rows={rows}
              checked={checked}
              sortBy={qs.sortBy}
              sortDirection={qs.sortDirection}
            />
          </tfoot>
        </table>
      ) : (
        <div className="no-result-div">
          <div>No records found of this type.</div>
        </div>
      )}
      <BulkOptionsAndPagination
        total={total}
        page={qs.page}
        pages={pages}
        bulkOptions={bulkOptions}
        checked={checked}
        isFooter
      />
    </div>
  )
}

/**  */
function SearchRow({current}: {current?: string}) {
  // TODO: decide if should be in table
  // TODO: Make inputs have a left, center, right class
  return (
    <div className="search-form-row">
      <form
        onSubmit={(e: React.ChangeEvent<HTMLFormElement>) => {
          e.preventDefault()
          const next = new FormData(e.target).get('search') as string
          console.log(next, current)
          if (next === (current || '')) {
            toast({key: 'sqhc', message: "Search query hasn't changed", variant: 'alert'})
          } else qsGo({search: next ? next : undefined, page: undefined})
        }}
      >
        <input name="search" defaultValue={current} aria-label="Search" />
        <button type="submit" className="right">
          Search
        </button>
      </form>
    </div>
  )
}

/**  */
function BulkOptionsAndPagination(
  p: Pick<CmsTableProps, 'total' | 'pages' | 'bulkOptions'> & {
    isFooter?: boolean
    checked: UseSet2<CmsRow>
    page: number
  }
) {
  return (
    <div className="header-footer-div" data-footer={p.isFooter}>
      <div className="left">
        <BulkActionsForm bulkOptions={p.bulkOptions} checked={p.checked} />
      </div>
      <Pagination total={p.total} pages={p.pages} checked={p.checked} page={p.page} />
    </div>
  )
}

/**  */
function Pagination(
  p: Pick<CmsTableProps, 'total' | 'pages'> & {
    isFooter?: boolean
    checked: UseSet2<CmsRow>
    page: number
  }
) {
  return (
    <div className="pagination-div">
      <div>{p.total} items&nbsp;</div>
      {p.pages > 1 && (
        <F>
          <PageButton title="First Page" page={p.page} pages={p.pages} pageTo={1}>
            «
          </PageButton>
          <PageButton title="Go back one page" page={p.page} pages={p.pages} pageTo={p.page - 1}>
            ‹
          </PageButton>
          <div>
            &nbsp;{p.page} of {p.pages}&nbsp;
          </div>
          <PageButton title="Go forward one page" page={p.page} pages={p.pages} pageTo={p.page + 1}>
            ›
          </PageButton>
          <PageButton title="Go to last page" page={p.page} pages={p.pages} pageTo={p.pages}>
            »
          </PageButton>
        </F>
      )}
    </div>
  )
}

/**  */
function PageButton(
  p: Pick<CmsTableProps, 'pages'> & {
    title: string
    page: number
    pageTo: number
    children: React.ReactNode
  }
) {
  let pageTo = p.pageTo
  if (pageTo < 1) pageTo = 1
  if (pageTo > p.pages) pageTo = p.pages
  return (
    <button
      title={p.title}
      className="button"
      data-disabled={pageTo === p.page}
      onClick={() => {
        if (pageTo === p.page) {
          toast({
            key: 'pbhc',
            message: `Youre already on the ${p.pageTo === 1 ? 'first' : 'last'} page`,
            variant: 'alert',
          })
        } else {
          qsGo({page: pageTo})
        }
      }}
      type="button"
    >
      {p.children}
    </button>
  )
}

function BulkActionsForm({
  checked,
  bulkOptions,
}: Pick<CmsTableProps, 'bulkOptions'> & {checked: UseSet2<CmsRow>}) {
  const [action, setAction] = useState('-1')
  const [executing, setExecuting] = useState(false)
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => setAction(e.target.value)

  return (
    <form
      className="bulk-actions-form-div"
      onSubmit={async e => {
        e.preventDefault()
        if (action === '-1') {
          return toast({key: 'nas', message: 'No action selected', variant: 'alert'})
        }
        if (!checked.size) {
          return toast({key: 'nrs', message: 'No rows selected', variant: 'alert'})
        }
        setExecuting(true)
        const selectionObjs = [...checked].map(o => o.obj)
        const callback = bulkOptions!.find(o => o.label === action)!.cb
        await Promise.promisify(callback)(selectionObjs)
        checked.clear()
        console.log(checked)
        setExecuting(false)
      }}
    >
      <select
        aria-label="Bulk Actions"
        className="select"
        name="action"
        value={action}
        onChange={onChange}
        disabled={executing}
      >
        <option value="-1">Bulk Actions</option>
        {bulkOptions?.map((o, i) => (
          <option key={i} value={o.label}>
            {o.label}
          </option>
        ))}
      </select>
      <button type="submit" className="right" disabled={executing}>
        Apply
      </button>
    </form>
  )
}

/**  */
function THeadOrFoot({
  checked,
  cols,
  isFooter,
  rows,
  sortBy,
  sortDirection,
}: Pick<CmsTableProps, 'cols' | 'rows'> & {
  checked: UseSet2<CmsRow>
  isFooter?: boolean
  sortBy?: string
  sortDirection?: string
}) {
  const isWide = useMedia('(min-width: 700px)')
  const colsResponsive = isWide ? cols : cols.slice(0, 1)
  const toggleChecks = () => {
    if (checked.size === rows.length) checked.clear()
    else checked.union(new Set(rows))
  }

  const SelectAllInput = (
    <input
      aria-label="Select All"
      checked={checked.size === rows.length}
      name="select-all"
      onChange={toggleChecks}
      type="checkbox"
    />
  )

  return (
    <tr>
      {isFooter ? (
        <td className="checkbox-cell">{SelectAllInput}</td>
      ) : (
        <th className="checkbox-cell">{SelectAllInput}</th>
      )}
      {colsResponsive.map((col, i) => (
        <HeadCol colData={col} key={i} sortBy={sortBy} sortDirection={sortDirection} />
      ))}
    </tr>
  )
}

const carrotProps = {
  size: 20,
  style: {marginBottom: -4, marginTop: -4, color: 'var(--black)'},
}

/**  */
function HeadCol({
  colData,
  sortBy,
  sortDirection,
}: {
  colData: CmsTableProps['cols'][0]
  sortBy?: string
  sortDirection?: string
}) {
  const sortCurrent =
    (sortBy === colData.sortValue && sortDirection) || (!sortBy && colData.sortDefault) || undefined

  const sortDirectionNext =
    (sortCurrent && (sortCurrent === 'asc' ? 'desc' : 'asc')) || colData.sortDefault || 'asc'

  const sort = colData.sortValue
    ? () => qsGo({sortBy: colData.sortValue, sortDirection: sortDirectionNext})
    : undefined

  const carrot =
    sort &&
    ((sortCurrent === 'asc' && <Icon name="carrotDown" {...carrotProps} />) ||
      (sortCurrent === 'desc' && <Icon name="carrotUp" {...carrotProps} />) ||
      (colData.sortDefault === 'asc' && <Icon name="carrotDown" {...carrotProps} />) ||
      (colData.sortDefault === 'desc' && <Icon name="carrotUp" {...carrotProps} />) || (
        <Icon name="carrotDown" {...carrotProps} />
      ))

  return (
    <th
      aria-label={sort ? `Sort ${colData.label} by ${sortDirectionNext}` : undefined}
      onClick={sort}
      data-sort-active={sortCurrent}
      role={sort ? 'button' : undefined}
    >
      {colData.label} {carrot}
    </th>
  )
}

/**  */
function BodyRow(
  p: Pick<CmsTableProps, 'cols'> & {
    row: CmsRow
    rowNumber: number
    checked: UseSet2<CmsRow>
  }
) {
  const isWide = useMedia('(min-width: 700px)')
  const colToString = (col: React.ReactNode) =>
    col || (col === 0 && 0) || (col === false && 'false') || '--'
  return (
    <tr>
      <td className="checkbox-cell">
        <RowCheckbox {...p} />
      </td>
      {isWide ? (
        p.row.cols.map((col, i) => <td key={i}>{colToString(col)}</td>)
      ) : (
        <td>
          {p.cols.map(
            (col, i) =>
              (i === 0 && (
                <div key={i}>
                  <div>
                    <b>{p.row.cols[i]}</b>
                  </div>
                  <div style={{margin: '-.4rem 0 .4rem'}}>_ _ _</div>
                </div>
              )) || (
                <div key={i}>
                  {col.label}: {p.row.cols[i] || '--'}
                </div>
              )
          )}
        </td>
      )}
    </tr>
  )
}

/**  */
function RowCheckbox(p: {row: CmsRow; rowNumber: number; checked: UseSet2<CmsRow>}) {
  const onClick = useCallback(() => p.checked.toggle(p.row), [])
  return (
    <input
      aria-label={`Select row #${p.rowNumber + 1}`}
      checked={p.checked.has(p.row)}
      name="row-selected"
      onChange={onClick}
      type="checkbox"
    />
  )
}

function qsGo(vals: Record<string, string | number | boolean | undefined>) {
  history.replaceState(Date.now(), '', queryStrings.create(vals, {upsert: true}))
}
