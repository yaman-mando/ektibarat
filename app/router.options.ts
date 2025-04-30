import type { RouterConfig } from '@nuxt/schema';
import { webPathKudratPathUtil } from '~/main/utils/web-routes.utils';

export default {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  routes: (_routes) => {
    return _routes.map((item) => {
      if (item.name === 'path-kudrat') {
        item.path = webPathKudratPathUtil();
      }
      return item;
    });
  },
} satisfies RouterConfig;
