import { Message } from 'element-ui'
import Router, { Route } from 'vue-router'

declare module 'vue/types/vue' {
  interface Vue {
    $router: Router
    $route: Route
    $message: typeof Message
  }
}
declare module '*.json' {
  const value: any
  export default value
}
