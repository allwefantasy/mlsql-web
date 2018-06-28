import Vue from 'vue'
import Router from 'vue-router'
import Query from '@/components/Query'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Query',
      component: Query
    }
  ]
})
