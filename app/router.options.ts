import type { RouterConfig } from '@nuxt/schema';
import {
  webPathKudratPathUtil,
  webPathTahselPathUtil,
} from '~/main/utils/web-routes.utils';

const namePathRecord: Record<string, string> = {
  'path-kudrat': webPathKudratPathUtil(),
  'path-tahsel': webPathTahselPathUtil(),
};
export default {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  routes: (_routes) => {
    return _routes.map((item) => {
      const path = namePathRecord[item.name as string];
      if (path) {
        item.path = path;
      }

      //exam-questions
      if (item.path.includes('exam-questions/:id')) {
        item.path = '/exam-questions/:id()/:title()?';
      }

      //exam-info
      if (item.path.includes('exam-info/:id')) {
        item.path = '/exam-info/:id()/:title()?';
      }

      return item;
    });
  },
} satisfies RouterConfig;
