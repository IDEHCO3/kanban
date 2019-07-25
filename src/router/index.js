import Vue from 'vue'
import Router from 'vue-router'
import state from '@/store/state'

import login from '@/components/user/login'
import register from '@/components/user/register'
import userAccount from '@/components/user/user-account'

import home from '@/components/home/home'
import continuousActivity from '@/components/continuous-activity/continuous-activity'
import project from '@/components/project/project'
import sprint from '@/components/sprint/sprint'
import task from '@/components/task/task'
import userTasks from '@/components/user-tasks/user-tasks'

Vue.use(Router)

function requireAuth (to, from, next) {
  const auth = state.auth
  if (auth.token === null || auth.username === null) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/my_account',
      name: 'my_account',
      component: userAccount,
      beforeEnter: requireAuth
    },
    {
      path: '/',
      name: 'home',
      component: home,
      beforeEnter: requireAuth
    },
    {
      path: '/continuous_activity',
      name: 'continuous_activity',
      component: continuousActivity,
      beforeEnter: requireAuth
    },
    {
      path: '/project',
      name: 'project',
      component: project,
      beforeEnter: requireAuth
    },
    {
      path: '/sprint',
      name: 'sprint',
      component: sprint,
      beforeEnter: requireAuth
    },
    {
      path: '/task',
      name: 'task',
      component: task,
      beforeEnter: requireAuth
    },
    {
      path: '/user_tasks',
      name: 'user_tasks',
      component: userTasks,
      beforeEnter: requireAuth
    }
  ]
})
