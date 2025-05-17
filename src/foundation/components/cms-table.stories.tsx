/* eslint-disable require-jsdoc */
import {CmsTable, getCmsTableQsProps} from './cms-table'

export default {
  component: CmsTable,
}

export function CmsTable1() {
  const qsProps = getCmsTableQsProps<keyof User>()

  const {entries, pages, refetch, total} = userDb.find(qsProps)

  return (
    <CmsTable
      cols={[
        {label: 'Name', sortValue: 'fullName'},
        {label: 'Email', sortValue: 'email'},
        {label: 'Status', sortValue: 'status'},
        {label: 'Roles', sortValue: 'roles'},
      ]}
      bulkOptions={[
        {label: 'Delete', cb: deleteCb},
        {label: 'Ban', cb: banCb},
      ]}
      pages={pages}
      total={total}
      rows={entries.map((entry, i) => ({
        obj: entry,
        cols: [
          <a href={`${entry.fullName}`} key={i + '1'}>
            {entry.fullName}
          </a>,
          <a href={`mailto:${entry.email}`} key={i + '2'}>
            {entry.email}
          </a>,
          entry.status,
          entry.roles.join(),
        ],
      }))}
    />
  )

  async function deleteCb(selection: sany[]) {
    // const confirmed = await Portal.confirm({
    //   message: `Okay to delete ${selection.length} user(s)?`,
    // })
    alert(`Okay to delete ${selection.length} user(s)?`)
    const confirmed = true
    if (confirmed) {
      await Promise.all(selection.map((entry: User) => entry.delete()))
      // ToastStore.setValue({
      //   message: `Deleted ${selection.length} entries`,
      //   icon: 'success',
      //   placement: 'right',
      // })
      await refetch()
    }
  }

  async function banCb(selection: sany[]) {
    // TODO: Ban should prompt for reason
    // const confirmed = await Portal.confirm({
    //   message: `Okay to ban ${selection.length} user(s)?`,
    // })
    alert(`Okay to ban ${selection.length} user(s)?`)
    const confirmed = true
    if (confirmed) {
      await Promise.all(selection.map((entry: User) => entry.ban('Banned by bulk action')))
      // ToastStore.setValue({
      //   message: `Banned ${selection.length} user(s)`,
      //   icon: 'success',
      //   placement: 'right',
      // })
      await refetch()
    }
  }
}

type User = {
  _id: string
  email: string
  fullName: string
  roles: string[]
  status: string
  ban: (reason: string) => Promise<void>
  delete: () => Promise<void>
}

/** A mock fetch data hook with typical props */

class UserDb {
  entries: User[] = []
  size = 1

  constructor() {
    this.entries = Array(100).fill(0).map(this.createUser.bind(this))
  }

  createUser(): User {
    const i = this.size++
    return {
      _id: '' + i,
      email: 'joe@s.com' + i,
      fullName: 'Joe Smith' + i,
      roles: Math.random() < 0.5 ? ['admin'] : [],
      status: Math.random() < 0.5 ? 'active' : 'banned',
      ban: async (reason: string) => console.log('ban bc ' + reason),
      delete: async () => console.log('delete'),
    }
  }

  find({
    filter = {},
    page = 1,
    pageSize = 10,
    sortBy = '',
    sortDirection = 'asc',
    search,
  }: {
    filter?: Partial<User>
    page: number
    pageSize?: number
    sortBy: '' | keyof User
    sortDirection: 'asc' | 'desc'
    search: string
  }) {
    const res = [...this.entries]
      .sort((a, b) => {
        if (sortBy) {
          if (a[sortBy] < b[sortBy]) {
            return sortDirection === 'asc' ? -1 : 1
          }
          if (a[sortBy] > b[sortBy]) {
            return sortDirection === 'asc' ? 1 : -1
          }
        }
        return 0
      })
      .filter(u => {
        if (filter) {
          return Object.entries(filter).every(([k, v]) => !v || u[k as keyof User] === v)
        }
        return true
      })
      .filter(u => {
        if (search) {
          return (
            u.email.includes(search) ||
            u.fullName.includes(search) ||
            u.roles.includes(search) ||
            u.status.includes(search)
          )
        }
        return true
      })

    return {
      entries: res.slice((page - 1) * pageSize, page * pageSize),
      page,
      pages: Math.ceil(res.length / pageSize),
      refetch: async () => console.log('refetch'),
      total: res.length,
    }
  }
}

const userDb = new UserDb()
