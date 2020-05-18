// 类蚂蚁森林效果
export const questionnaireRoute = [
  {
    path: '/antForest',
    name: 'AntForest',
    meta: {
      title: '蚂蚁森林动态气泡'
    },
    component: () => import('@/views/antForest/index.vue')
  }
]
