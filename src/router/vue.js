// vue Demo
export const vueDemoRoute = [
  {
    path: '/vueModel',
    name: 'VueModel',
    meta: {
      title: 'vueModel示例'
    },
    component: () => import('@/views/vueModel/index.vue')
  }
]
