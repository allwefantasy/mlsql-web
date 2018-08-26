import Vue from 'vue'
import Router from 'vue-router'
import Query from '@/components/Query'
import StreamJobs from '@/components/StreamJobs'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Query',
      component: Query
    },
    {
      path: "/stream/jobs",
      name: 'streamJobs',
      component: StreamJobs
    }
  ]
})
