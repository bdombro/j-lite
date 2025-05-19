import {Router} from '@slimr/router'

import About from './pages/about'
import Index from './pages/index'
import Login from './pages/login'
import NotFound from './pages/not-found'

export const router = new Router(
  {
    index: {
      component: Index,
      path: '/j-lite',
    },
    about: {
      component: About,
      path: '/j-lite/about',
    },
    login: {
      component: Login,
      path: '/j-lite/login',
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
