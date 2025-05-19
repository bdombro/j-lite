import {Router} from '@slimr/router'

import Dashboard from './pages/dashboard'
import Index from './pages/index'
import IssuePage from './pages/issue'
import Login from './pages/login'
import NotFound from './pages/not-found'
import ProjectPage from './pages/project'
import SettingsPage from './pages/settings'

export const router = new Router(
  {
    dashboard: {
      component: Dashboard,
      path: '/j-lite',
    },
    project: {
      component: ProjectPage,
      path: '/j-lite/projects/:projectKey',
    },
    issue: {
      component: IssuePage,
      path: '/j-lite/issues/:issueKey',
    },
    settings: {
      component: SettingsPage,
      path: '/j-lite/settings',
    },
    index: {
      component: Index,
      path: '/',
    },
    about: {
      component: Index,
      path: '/j-lite/about',
    },
    login: {
      component: Login,
      path: '/login',
    },
    jLiteNotFound: {
      exact: false,
      component: NotFound,
      path: '/j-lite',
    },
    notFound: {
      exact: false,
      component: NotFound,
      path: '/',
    },
  },
  {
    scrollElSelector: 'main',
  }
)
