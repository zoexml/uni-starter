import { createRouter } from 'uni-mini-router'

console.log('🚀 ~ routes----:', ROUTES)
const router = createRouter({
  routes: [...ROUTES], // 路由表信息
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  // console.log(from)
  next()
})
router.afterEach((_to, _from) => {
  // console.log(to)
  // console.log(from)
})

export default router
