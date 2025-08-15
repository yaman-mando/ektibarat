export default defineNuxtRouteMiddleware(async () => {
  const auth:any = useAuth()

  if (!auth.status.value.loggedIn) return

  const token = auth.data.value?.token
  const expireDateStr = auth.data.value?.tokenExpireDate

  if (!token || !expireDateStr) return

  const expireTime = new Date(expireDateStr).getTime()
  const now = Date.now()
  const remaining = expireTime - now


  if (remaining < 5 * 60 * 1000) {
    try {
      await auth.refresh()
      console.log('🔄 Token refreshed')
    } catch (err) {
      console.error('❌ Refresh failed', err)
      return navigateTo('/auth/signup')
    }
  }
})
