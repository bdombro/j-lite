import {Router} from '@slimr/router'

import About from './pages/about'
import Index from './pages/index'
import Login from './pages/login'
import NotFound from './pages/not-found'
import StackTest from './pages/stack-test'

export const router = new Router(
  {
    index: {
      component: Index,
      path: '/',
    },
    about: {
      component: About,
      path: '/about',
    },
    login: {
      component: Login,
      path: '/login',
    },
    stack1: {
      isStack: true,
      component: StackTest,
      path: '/stack1',
    },
    stack1Inner: {
      exact: false,
      component: StackTest,
      path: '/stack1',
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
