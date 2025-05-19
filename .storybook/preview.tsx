import './preview.css'

import {Router, Switch} from '@slimr/react'
import React from 'react'

import '../src/foundation'
import {ToastPack} from '../src/foundation'
import Theme from './theme'

export const decorators = [
  (Story: React.FC<any>) => (
    <Switch
      router={
        new Router({
          notFound: {
            component: Story,
            exact: false,
            path: '/',
          },
        })
      }
    />
  ),
  (Story: React.FC<any>) => (
    <>
      <ToastPack />
      <Story />
    </>
  ),
]

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: Theme,
  },
}
