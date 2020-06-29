import Vue from 'vue'
import Router from 'vue-router'
import { questionnaireRoute } from '@/router/antForest'

Vue.use(Router)

const router = new Router({
  routes: [
    ...questionnaireRoute
  ]
})

// routes.beforeEach((to, from, next) => {
//   if (to.meta.title) {
//     // 判断是否有标题
//     document.title = to.meta.title
//   }
// })
export default router
