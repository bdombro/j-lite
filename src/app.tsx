import {Switch} from '@slimr/router'

import {ToastPack} from '~/foundation'
import {router} from '~/router'

/** Renders global toast hosts and the active route from the slim router. */
export function App() {
  return (
    <div data-testid="appComponent">
      <ToastPack />
      <Switch router={router} />
    </div>
  )
}
