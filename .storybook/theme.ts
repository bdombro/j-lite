import {create} from '@storybook/theming/create'

/** Whether the OS reports a dark color scheme for manager chrome. */
const prefersDarkMode = window.matchMedia('(prefers-color-scheme:dark)').matches // true

/** Light or dark Storybook shell branding from `create`. */
export default create({
  base: prefersDarkMode ? 'dark' : 'light',
  brandTitle: 'preact-template',
  brandUrl: 'https://github.com/bdombro/preact-template',
  // brandImage: 'https://storybook.js.org/images/placeholders/350x150.png',
  brandTarget: '_blank',
})
