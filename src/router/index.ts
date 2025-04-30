import { createRouter } from 'uni-mini-router'

const router = createRouter({
  routes: [...ROUTES], // 路由表信息
})

router.beforeEach((to, from, next) => {
  console.log(to)
  console.log(from)
  next()
})
router.afterEach((to, from) => {
  console.log(to)
  console.log(from)
})

export default router
