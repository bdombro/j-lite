import {useEffect, useMemo, useState} from 'react'

import {clearJLiteStorage, readCachedValue, writeCachedValue} from './cache'

type QueryOptions<T> = {
  cacheKey: string
  deps?: React.DependencyList
  enabled?: boolean
  fetcher: () => Promise<T>
}

type QueryState<T> = {
  data?: T
  error?: string
  fetchedAt?: number
  loading: boolean
  refreshing: boolean
  source?: 'cache' | 'network'
}

export function useCachedQuery<T>({cacheKey, deps = [], enabled = true, fetcher}: QueryOptions<T>) {
  const [reloadToken, setReloadToken] = useState(0)
  const [state, setState] = useState<QueryState<T>>({
    loading: enabled,
    refreshing: false,
  })

  useEffect(() => {
    if (!enabled) {
      setState({loading: false, refreshing: false})
      return
    }

    let cancelled = false
    const cached = readCachedValue<T>(cacheKey)

    setState({
      data: cached?.data,
      error: undefined,
      fetchedAt: cached?.fetchedAt,
      loading: !cached,
      refreshing: Boolean(cached),
      source: cached ? 'cache' : undefined,
    })

    fetcher()
      .then(data => {
        if (cancelled) return
        const saved = writeCachedValue(cacheKey, data)
        setState({
          data,
          error: undefined,
          fetchedAt: saved.fetchedAt,
          loading: false,
          refreshing: false,
          source: 'network',
        })
      })
      .catch(error => {
        if (cancelled) return
        setState(current => ({
          ...current,
          error: error instanceof Error ? error.message : 'Unknown Jira error',
          loading: false,
          refreshing: false,
        }))
      })

    return () => {
      cancelled = true
    }
  }, [cacheKey, enabled, reloadToken, ...deps])

  return useMemo(
    () => ({
      ...state,
      hasData: state.data != null,
      isStale: Boolean(state.data && state.error),
      refresh: () => setReloadToken(token => token + 1),
      clearAll: () => clearJLiteStorage(),
    }),
    [state]
  )
}
