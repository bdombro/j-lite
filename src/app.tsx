import {Switch} from '@slimr/router'

import {ToastPack} from '~/foundation'
import {router} from '~/router'

/**
 * The main app component
 */
export function App() {
  return (
    <div data-testid="appComponent">
      <ToastPack />
      <Switch router={router} />
    </div>
  )
}
